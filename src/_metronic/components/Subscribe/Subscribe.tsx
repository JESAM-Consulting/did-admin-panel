import React, { useEffect, useState } from "react";
import DataTable, { defaultThemes } from "react-data-table-component";
import { toast, ToastContainer } from "react-toastify";
import { ApiDelete, ApiGet } from "../../../helpers/API/ApiData";
import DeleteIcon from "@material-ui/icons/Delete";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import useDebounce from "../../hooks/useDebounce";
import moment from "moment";

const Subscribe = () => {
  const [page, setPage] = useState<any>(1);
  const [count, setCount] = useState<any>(0);
  const [countPerPage, setCountPerPage] = useState<any>(10);
  const [show, setShow] = useState(false);
  const [subscribe, setSubscribe] = useState([]);
  const [deleteId, setDeleteId] = useState<any>();
  const [searchTerm, setSearchTerm] = useState<any>();
  const [loadingData, setLoadingData] = useState<any>(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 800);
  useEffect(() => {
    GetLicensePartner();
  }, [debouncedSearchTerm, page, countPerPage]);

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const handleClose = () => {
    setShow(false);
  };

  const GetLicensePartner = async () => {
    setLoadingData(true);
    await ApiGet(`drop-mail/get-mail?limit=${countPerPage}&page=${page}&letter=${searchTerm ?? ""}`)
      .then((res: any) => {
        setLoadingData(false);
        console.log("Subscribe", res.data);
        setSubscribe(res?.data?.payload?.getEmail);
        setCount(res?.data?.payload?.count);
      })

      .catch((err) => {
        setLoadingData(false);
        console.log("errrr", err);
      });
  };

  const DeleteLicensepartner = async () => {
    await ApiDelete(`drop-mail/remove-mail?_id=${deleteId}`)
      .then((res: any) => {
        console.log("ressss", res);
        setShow(false);
        toast.success(res?.data?.messages);
        GetLicensePartner();
      })
      .catch((err) => {
        console.log("errrr", err);
        toast.error(err?.messages);
      });
  };

  const customStyles = {
    header: {
      style: {
        minHeight: "56px",
      },
    },
    headRow: {
      style: {
        borderTopStyle: "solid",
        borderTopWidth: "1px",
        borderTopColor: defaultThemes.default.divider.default,
      },
    },
    headCells: {
      style: {
        "&:not(:last-of-type)": {
          borderRightStyle: "solid",
          borderRightWidth: "1px",
          borderRightColor: defaultThemes.default.divider.default,
        },
      },
    },
    cells: {
      style: {
        "&:not(:last-of-type)": {
          borderRightStyle: "solid",
          borderRightWidth: "1px",
          borderRightColor: defaultThemes.default.divider.default,
        },
      },
    },
  };

  const paginationComponentOptions = {
    rowsPerPageText: "Zeilen pro Seite",
    rangeSeparatorText: "von",
  };

  const columns = [
    {
      name: " Nr.",
      // cell: (row: any, index: any) => index + 1,
      cell: (row: any, index: any) => (page - 1) * countPerPage + (index + 1),
      width: "5%",
    },
    {
      name: "Datum",
      selector: (row: any) => moment(row?.createdAt).format("DD/MM/YYYY"),
      sortable: true,
    },
    {
      name: "E-Mail",
      selector: (row: any) => row?.email,
      sortable: true,
    },
    {
      name: "Aktionen",
      cell: (row: any) => {
        return (
          <>
            <div className=" d-flex justify-content-center">
              <div
                className="pl-3 cursor-pointer"
                onClick={() => {
                  setDeleteId(row._id);
                  setShow(true);
                }}
              >
                <DeleteIcon />
              </div>
            </div>
          </>
        );
      },
    },
  ];

  return (
    <>
      <ToastContainer />
      <div className="card p-1">
        <div className="p-2 mb-2">
          <div className="row mb-4 pr-3">
            <div className="col d-flex justify-content-between">
              <h2 className="pl-3 pt-2">Newsletter</h2>
            </div>
            <div className="col">
              <div>
                <input
                  type="text"
                  className={`form-control form-control-lg form-control-solid `}
                  name="search"
                  onChange={(e) => handleSearch(e)}
                  placeholder="Suchen…"
                  style={{ borderRadius: "999px" }}
                />
              </div>
            </div>
          </div>
          {loadingData ? (
            <div className="d-flex justify-content-center" style={{ marginTop: "20px" }}>
              <div className="spinner-border text-dark " role="status"></div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={subscribe}
              customStyles={customStyles}
              highlightOnHover
              pagination
              paginationComponentOptions={paginationComponentOptions}
              paginationServer
              paginationTotalRows={count}
              paginationPerPage={countPerPage}
              paginationRowsPerPageOptions={[10, 20, 25, 50, 100]}
              paginationDefaultPage={page}
              noDataComponent="Es sind keine Daten zum Anzeigen vorhanden."
              onChangePage={(page) => {
                setPage(page);
              }}
              onChangeRowsPerPage={(rowPerPage) => {
                setCountPerPage(rowPerPage);
              }}
            />
          )}
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title className="text-danger">Alarm!</Modal.Title>
            </Modal.Header>
            <Modal.Body>Wollen Sie dieses Newsletter entfernen ?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Abbrechen
              </Button>
              <Button variant="danger" onClick={() => DeleteLicensepartner()}>
                Löschen
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Subscribe;
