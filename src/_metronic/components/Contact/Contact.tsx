import React, { useEffect, useState } from "react";
import DataTable, { defaultThemes } from "react-data-table-component";
import { toast, ToastContainer } from "react-toastify";
import { ApiDelete, ApiGet } from "../../../helpers/API/ApiData";
import DeleteIcon from "@material-ui/icons/Delete";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import useDebounce from "../../hooks/useDebounce";
import InfoOutlined from "@material-ui/icons/InfoOutlined";
import { Toolbar } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import { List } from "@material-ui/core";
import { Tooltip } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Dialog } from "@material-ui/core";
import moment from "moment";

const Contact = () => {
  const [page, setPage] = useState<any>(1);
  const [count, setCount] = useState<any>(0);
  const [countPerPage, setCountPerPage] = useState<any>(10);
  const [show, setShow] = useState(false);
  const [contactData, setContactData] = useState([]);
  const [deleteId, setdeleteId] = useState<any>();
  const [searchTerm, setSearchTerm] = useState<any>();
  const [loadingData, setLoadingData] = useState<any>(false);
  const [info, setInfo] = useState<any>(false);
  const [rowinfo, setRowInfo] = useState<any>(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  useEffect(() => {
    getAllContact();
  }, [debouncedSearchTerm, page, countPerPage]);

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const handleClose = () => {
    setShow(false);
    setInfo(false);
  };

  const handleMenu = () => {
    setShow(true);
  };

  const getAllContact = async () => {
    setLoadingData(true);
    await ApiGet(
      `contact/get-contact?type=kaufen|kontakt&limit=${countPerPage}&page=${page}&letter=${
        searchTerm ?? ""
      }`
    )
      .then((res: any) => {
        setLoadingData(false);
        setContactData(res?.data?.payload?.getContact);
        setCount(res?.data?.payload?.count);
      })

      .catch((err) => {
        setLoadingData(false);
        console.log("errrr", err);
      });
  };

  const deleteContact = async () => {
    await ApiDelete(`contact/remove-contact?limit=10&_id=${deleteId}`)
      .then((res: any) => {
        setShow(false);
        getAllContact();
      })
      .catch((err) => {
        console.log("errrr", err);
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
      selector: (row: any) => row?.firstName + " " + row?.lastName,
      sortable: true,
    },

    {
      name: "Status",
      selector: (row: any) => row?.occupationRole,
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
      name: "Aktionen",
      cell: (row: any) => {
        return (
          <>
            <div className=" d-flex justify-content-center">
              <div
                className="pl-3 cursor-pointer"
                onClick={() => {
                  handleMenu();
                  setdeleteId(row._id);
                }}
              >
                <DeleteIcon />
              </div>
              <div
                className="pl-3 cursor-pointer"
                onClick={() => {
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
              <h2 className="pl-3 pt-2">Kontaktanfrage</h2>
            </div>
            <div className="col">
              <div>
                <input
                  type="text"
                  style={{ borderRadius: "9999px" }}
                  className={`form-control form-control-lg form-control-solid `}
                  name="search"
                  onChange={(e) => handleSearch(e)}
                  placeholder="Suchen…"
                />
              </div>
            </div>
          </div>
          {loadingData ? (
            <div
              className="d-flex justify-content-center"
              style={{ marginTop: "20px" }}
            >
              <div className="spinner-border text-dark " role="status"></div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={contactData}
              customStyles={customStyles}
              highlightOnHover
              pagination
              paginationComponentOptions={paginationComponentOptions}
              paginationServer
              paginationTotalRows={count}
              paginationPerPage={countPerPage}
              paginationRowsPerPageOptions={[10, 20, 25, 50, 100]}
              paginationDefaultPage={page}
              noDataComponent="Es sind keine Daten zum Anzeigen vorhanden"
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
            <Modal.Body>
              Möchten Sie diesen Kontaktanfrage entfernen ?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Abbrechen
              </Button>
              <Button variant="danger" onClick={() => deleteContact()}>
                Löschen
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
      {info ? (
        <Dialog fullScreen open={info} onClose={handleClose}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
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
                      <label className="col-xl-3 col-lg-3 col-form-label">
                        Name :
                      </label>
                      <div className="col-lg-9 col-xl-6 pt-3">
                        <div>
                          <span>
                            {rowinfo?.firstName + " " + rowinfo?.lastName ??
                              "-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">
                        E-Mail :
                      </label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>{rowinfo?.email ?? "-"}</span>
                        </div>
                      </div>
                    </div>

                    {/* telephone */}
                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">
                        Telefon :
                      </label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>{rowinfo?.phone ?? "-"}</span>
                        </div>
                      </div>
                    </div>
                    {/* postalCode */}
                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">
                        berufliche Rolle :
                      </label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>{rowinfo?.occupationRole ?? "-"}</span>
                        </div>
                      </div>
                    </div>
                    {/* description */}
                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">
                        Bezeichnung :
                      </label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>{rowinfo?.knowUs ?? "-"}</span>
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

export default Contact;
