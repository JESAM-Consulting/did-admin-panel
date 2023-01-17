import React, { useEffect, useState } from "react";
import DataTable, { defaultThemes } from "react-data-table-component";
import { toast, ToastContainer } from "react-toastify";
import { ApiDelete, ApiGet } from "../../../helpers/API/ApiData";
import DeleteIcon from "@material-ui/icons/Delete";
import InfoOutlined from "@material-ui/icons/InfoOutlined";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import useDebounce from "../../hooks/useDebounce";
import CloseIcon from "@material-ui/icons/Close";
import { Dialog } from "@material-ui/core";
import { Toolbar } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import { List } from "@material-ui/core";
import moment from "moment";
import { getUserInfo } from "../../../utils/user.util";

const Apraisal = () => {
  const [page, setPage] = useState<any>(1);
  const [count, setCount] = useState<any>(0);
  const [countPerPage, setCountPerPage] = useState<any>(10);
  const [show, setShow] = useState(false);
  const [appraisalData, SetAppraisalData] = useState([]);
  const [deleteId, setDeleteId] = useState<any>();
  const [searchTerm, setSearchTerm] = useState<any>();
  const [info, setInfo] = useState<any>(false);
  const [rowinfo, setRowInfo] = useState<any>(false);
  const [loadingData, setLoadingData] = useState<any>(false);
  const userInfo = getUserInfo();
  const debouncedSearchTerm = useDebounce(searchTerm, 800);
  useEffect(() => {
    GetAppraisal();
  }, [debouncedSearchTerm, page, countPerPage]);

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const handleClose = () => {
    setShow(false);
    setInfo(false);
  };

  const GetAppraisal = async () => {
    setLoadingData(true);
    await ApiGet(`appraisal/get-appraisal?limit=${countPerPage}&page=${page}&letter=${searchTerm ?? ""}`)
      .then((res: any) => {
        console.log("Apraisal", res?.data?.payload?.getAppraisal);
        SetAppraisalData(res?.data?.payload?.getAppraisal);
        setCount(res?.data?.payload?.count);
        setLoadingData(false);
      })

      .catch((err) => {
        setLoadingData(false);
        console.log("errrr", err);
      });
  };

  const DeleteAppraisal = async () => {
    await ApiDelete(`appraisal/remove-appraisal?_id=${deleteId}`)
      .then((res: any) => {
        console.log("ressss", res);
        setShow(false);
        toast.success(res?.data?.messages);
        GetAppraisal();
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
      name: "Art der Immobilie",
      selector: (row: any) => row?.houseType,
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
              <h2 className="pl-3 pt-2">Immobilienbewertung</h2>
            </div>
            <div className="col">
              <div>
                <input
                  type="text"
                  className={`form-control form-control-lg form-control-solid `}
                  name="search"
                  onChange={(e) => handleSearch(e)}
                  style={{ borderRadius: "999px" }}
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
              data={appraisalData}
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
            <Modal.Body>Wollen Sie diese Bewertung entfernen?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Abbrechen
              </Button>
              <Button variant="danger" onClick={() => DeleteAppraisal()}>
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

                    {/* builtDate */}
                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">Baujahr :</label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>{moment(rowinfo?.builtDate).format("DD/MM/YYYY") ?? "-"}</span>
                        </div>
                      </div>
                    </div>

                    {/* appraisal */}
                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">Status :</label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>{rowinfo?.appraisal ?? "-"}</span>
                        </div>
                      </div>
                    </div>

                    {/* isOwner */}
                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">Eigentümer :</label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>{rowinfo?.isOwner ?? "-"}</span>
                        </div>
                      </div>
                    </div>

                    {/* areaSize */}
                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">Bereiche :</label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>{rowinfo?.areaSize ?? "-"}</span>
                        </div>
                      </div>
                    </div>
                    {/* livingSize */}
                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">Wohnfläche :</label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>{rowinfo?.livingSize ?? "-"}</span>
                        </div>
                      </div>
                    </div>
                    {/* houseType */}
                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">Haustyp :</label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>{rowinfo?.houseType ?? "-"}</span>
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
                    {/* sellingDue */}
                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">Verkauf bis :</label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>{rowinfo?.sellingDue ?? "-"}</span>
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

export default Apraisal;
