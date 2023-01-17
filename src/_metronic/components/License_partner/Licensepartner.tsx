import React, { useEffect, useState } from "react";
import DataTable, { defaultThemes } from "react-data-table-component";
import { toast, ToastContainer } from "react-toastify";
import { ApiDelete, ApiGet } from "../../../helpers/API/ApiData";
import DeleteIcon from "@material-ui/icons/Delete";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import useDebounce from "../../hooks/useDebounce";
import CloseIcon from "@material-ui/icons/Close";
import { Dialog } from "@material-ui/core";
import { Toolbar } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import { List } from "@material-ui/core";
import InfoOutlined from "@material-ui/icons/InfoOutlined";
import moment from "moment";
import { getUserInfo } from "../../../utils/user.util";

const Licensepartner = () => {
  const [page, setPage] = useState<any>(1);
  const [count, setCount] = useState<any>(0);
  const [countPerPage, setCountPerPage] = useState<any>(10);
  const [show, setShow] = useState(false);
  const [licenseData, SetlicenseData] = useState([]);
  const [deleteId, setDeleteId] = useState<any>();
  const [searchTerm, setSearchTerm] = useState<any>();
  const [info, setInfo] = useState<any>(false);
  const [rowinfo, setRowInfo] = useState<any>(false);
  const [loadingData, setLoadingData] = useState<any>(false);
  const userInfo = getUserInfo();
  console.log("userInfo", userInfo);
  const debouncedSearchTerm = useDebounce(searchTerm, 800);
  useEffect(() => {
    GetLicensePartner();
  }, [debouncedSearchTerm, page, countPerPage]);

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const handleClose = () => {
    setShow(false);
    setInfo(false);
  };

  const GetLicensePartner = async () => {
    setLoadingData(true);
    await ApiGet(`license-partner/get-license-partner?limit=${countPerPage}&page=${page}&letter=${searchTerm ?? ""}`)
      .then((res: any) => {
        setLoadingData(false);
        console.log("Licensepartner", res?.data?.payload?.getLicensePartner);
        SetlicenseData(res?.data?.payload?.getLicensePartner);
        setCount(res?.data?.payload?.count);
      })

      .catch((err) => {
        console.log("errrr", err);
        setLoadingData(false);
      });
  };

  const DeleteLicensepartner = async () => {
    await ApiDelete(`license-partner/remove-license-partner?_id=${deleteId}`)
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
      name: "Name",
      selector: (row: any) => row?.fullName,
      sortable: true,
    },

    {
      name: "E-Mail",
      selector: (row: any) => row?.email,
      sortable: true,
    },

    {
      name: "Telefon",
      selector: (row: any) => row?.phone,
      sortable: true,
    },
    {
      name: "Verwendungszweck",
      selector: (row: any) => row?.usage,
      sortable: true,
    },
    {
      name: "Aktionen",
      cell: (row: any) => {
        return (
          <>
            <div className=" d-flex justify-content-center">
              {userInfo?.role?.roleName === "admin" && (
                <div
                  className="pl-3 cursor-pointer"
                  onClick={() => {
                    setDeleteId(row._id);
                    setShow(true);
                  }}
                >
                  <DeleteIcon />
                </div>
              )}
              <div
                className="pl-3 cursor-pointer"
                onClick={() => {
                  console.log("Rowww", row);
                  setRowInfo(row);
                  setInfo(true);
                }}
              >
                <InfoOutlined />
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
              <h2 className="pl-3 pt-2">Lizenzpartner</h2>
            </div>
            <div className="col">
              <div>
                <input
                  type="text"
                  className={`form-control form-control-lg form-control-solid `}
                  name="search"
                  style={{ borderRadius: "999px" }}
                  onChange={(e) => handleSearch(e)}
                  placeholder="Suchen…"
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
              data={licenseData}
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
            <Modal.Body>Möchten Sie diesen Lizenzpartner entfernen ?</Modal.Body>
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
      {info ? (
        <Dialog fullScreen open={info} onClose={handleClose}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
          <List>
            {info && (
              <>
                <div className="ml-40">
                  <div className="form cus-container">
                    {/* Name */}
                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">Name :</label>
                      <div className="col-lg-9 col-xl-6 pt-3">
                        <div>
                          <span>{rowinfo?.fullName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">E-Mail :</label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>{rowinfo?.email ?? "-"}</span>
                        </div>
                      </div>
                    </div>

                    {/* telephone */}
                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">Telefon :</label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>{rowinfo?.phone ?? "-"}</span>
                        </div>
                      </div>
                    </div>

                    {/* licensePartner */}
                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">Lizenzpartner :</label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>{rowinfo?.licensePartner ?? "-"}</span>
                        </div>
                      </div>
                    </div>

                    {/* usage */}
                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">Verwendungszweck :</label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>{rowinfo?.usage ?? "-"}</span>
                        </div>
                      </div>
                    </div>

                    {/* areaSize */}
                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">Flächengröße :</label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>{rowinfo?.areaSize ?? "-"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </List>
        </Dialog>
      ) : null}
    </>
  );
};

export default Licensepartner;
