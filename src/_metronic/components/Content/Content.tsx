import React, { useEffect, useState } from "react";
import DataTable, { defaultThemes } from "react-data-table-component";
import { toast, ToastContainer } from "react-toastify";
import { Toolbar } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import { List } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Dialog } from "@material-ui/core";
import { ApiDelete, ApiGet, ApiPost, ApiPut } from "../../../helpers/API/ApiData";
import { getUserInfo } from "../../../utils/user.util";
import useDebounce from "../../hooks/useDebounce";
import moment from "moment";
import InfoOutlined from "@material-ui/icons/InfoOutlined";
import ReactQuill from "react-quill";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { Tooltip } from "@material-ui/core";
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
import Quill from "quill";

const Content = () => {
  // pagination
  const [page, setPage] = useState<any>(1);
  const [count, setCount] = useState<any>(0);
  const [countPerPage, setCountPerPage] = useState<any>(10);
  const [errors, setErrors] = useState<any>({});
  const [inputValue, setInputValue] = useState<any>({
    description: "",
  });
  const [show, setShow] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [isUser, setIsUser] = useState<boolean>(false);
  const [propertyBuilder, setPropertyBuilder] = useState<any>([]);
  const [loadingBtn, setLoadingBtn] = useState<any>(false);
  const [loadingData, setLoadingData] = useState<any>(false);
  const [searchTerm, setSearchTerm] = useState<any>();
  const [info, setInfo] = useState<any>(false);
  const [rowinfo, setRowInfo] = useState<any>(false);
  const [deleteId, setdeleteId] = useState<any>();
  const [isEditApi, setIsEditApi] = useState<any>(false);
  const [idForEditRealEstate, setIdForEditRealEstate] = useState<any>();

  const debouncedSearchTerm = useDebounce(searchTerm, 800);
  const userInfo = getUserInfo();

  useEffect(() => {
    getPropertyBuilder();
  }, [debouncedSearchTerm, page, countPerPage]);

  const handleClose = () => {
    setInfo(false);
  };

  const getPropertyBuilder = async () => {
    setLoadingData(true);
    await ApiGet(`static/get-static?limit=${countPerPage}&page=${page}&isAll=true&letter=${searchTerm ?? ""}`)
      .then((res: any) => {
        console.log("getuser", res);
        setLoadingData(false);
        setPropertyBuilder(res?.data?.payload?.getStatic);
        setCount(res?.data?.payload?.count);
      })
      .catch((err) => {
        setLoadingData(false);
        console.log("err", err);
      });
  };

  const handleOnChange = (e: any) => {
    console.log("e value", e.target === undefined);
    if (e.target !== undefined) {
      const { name, value } = e.target;
      setInputValue((preValue: any) => ({ ...preValue, [name]: value }));
      setErrors({ ...errors, [name]: "" });
    } else {
      setInputValue((preValue: any) => ({
        ...preValue,
        ["description"]: e,
      }));
      setErrors({ ...errors, ["description"]: "" });
    }
  };

  const handleOnChnageAddImg = (e: any) => {
    const { name } = e.target;
    setInputValue({ ...inputValue, [name]: e.target.files[0] });
    setErrors({ ...errors, [name]: "" });
  };
  console.log("inputValue", inputValue);
  const addRealEstate = async () => {
    setLoadingBtn(true);
    let formData: any = new FormData();
    formData.append("name", inputValue?.name);
    formData.append("title", inputValue?.title);
    formData.append("subTitle", inputValue?.subTitle);
    formData.append("description", inputValue?.description);
    formData.append("services", inputValue?.services);
    formData.append("image", inputValue?.image);
    await ApiPost(`static/add-static`, formData)
      .then((res: any) => {
        console.log("logsignup", res);
        setIsUser(false);
        toast.success(res?.data?.messages);
        setLoadingBtn(false);
        setInputValue({});
        getPropertyBuilder();
      })
      .catch((err) => {
        console.log(err?.response);
        setLoadingBtn(false);
        toast.error("Etwas ist schief gelaufen.Bitte versuche es erneut");
      });
  };
  const handleAddClose = () => {
    setIsUser(false);
    setErrors({});
    setInputValue({});
  };

  const handleSearch = (e: any) => {
    console.log("firsteeeeeeeee", e.target.value);
    setSearchTerm(e.target.value);
  };
  const deleteContact = async () => {
    let data = {};
    await ApiDelete(`static/delete-static?_id=${deleteId}`, data)
      .then((res: any) => {
        if (res?.status === 200) {
          console.log("ressss", res);
          setShow(false);
          getPropertyBuilder();
          setShowDelete(false);
          toast.success(res?.data?.messages);
        } else {
          setShowDelete(false);
        }
      })
      .catch((err) => {
        console.log("errrr", err);
        setShowDelete(false);
        toast.error(err?.response);
      });
  };

  const editRealEstate = async (e: any) => {
    setLoadingBtn(true);
    let formData: any = new FormData();
    formData.append("name", inputValue?.name);
    formData.append("title", inputValue?.title);
    formData.append("subTitle", inputValue?.subTitle);
    formData.append("description", inputValue?.description);
    formData.append("services", inputValue?.services);
    formData.append("image", inputValue?.imageForUpdate);

    await ApiPut(`static/update-static?_id=${idForEditRealEstate}`, formData)
      .then((res: any) => {
        if (res?.status === 200) {
          setIsUser(false);
          toast.success(res?.data?.messages);
          setLoadingBtn(false);
          setInputValue({});
          setIsEditApi(false);
          getPropertyBuilder();
        } else {
          setLoadingBtn(false);
          toast.error("Etwas ist schief gelaufen.Bitte versuche es erneut");
        }
      })
      .catch((err) => {
        setLoadingBtn(false);
        toast.error("Etwas ist schief gelaufen.Bitte versuche es erneut");
      });
  };

  const handleMenu = () => {
    setShowDelete(true);
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
    // {
    //     name: "Datum",
    //     selector: (row: any) => moment(row?.createdAt).format("DD/MM/YYYY") ?? "-",
    //     sortable: true,
    // },
    {
      name: "Name",
      selector: (row: any) => row?.name ?? "-",
      sortable: true,
    },
    // {
    //     name: "Description",
    //     selector: (row: any) => row?.description ?? "-",
    //     sortable: true,
    // },

    {
      name: "Titel",
      selector: (row: any) => row?.title ?? "-",
      sortable: true,
    },
    {
      name: "Untertitel",
      selector: (row: any) => row?.subTitle ?? "-",
      sortable: true,
    },
    {
      name: "Aktionen",
      cell: (row: any) => {
        return (
          <>
            <div className="d-flex align-items-center" style={{ gap: "10px" }}>
              <div
                className="cursor-pointer"
                onClick={() => {
                  console.log("Rowww", row);
                  setRowInfo(row);
                  setInfo(true);
                }}
              >
                <InfoOutlined />
              </div>
              <div
                className="cursor-pointer"
                onClick={() => {
                  setIsUser(true);
                  console.log("rowsresss", row);
                  setIsEditApi(true);
                  setIdForEditRealEstate(row?._id);
                  setInputValue({
                    name: row?.name,
                    description: row?.description,
                    title: row?.title,
                    subTitle: row?.subTitle,
                    services: row?.services,
                    image: row?.image,
                  });
                }}
              >
                <Tooltip title="Speichern" arrow>
                  <CreateIcon />
                </Tooltip>
              </div>
              {/* <div
                                className="pl-3 cursor-pointer"
                                onClick={() => {
                                    handleMenu();
                                    setdeleteId(row._id);
                                }}
                            >
                                <DeleteIcon />
                            </div> */}
            </div>
          </>
        );
      },
    },
  ];

  const fontSizeArr = ["8px", "9px", "10px", "12px", "14px", "16px", "20px", "24px", "32px", "40px", "54px", "68px", "84px", "98px"];
  var Size = Quill.import("attributors/style/size");
  Size.whitelist = fontSizeArr;
  Quill.register(Size, true);
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      [{ font: [] }],
      [{ size: fontSizeArr }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
    ],
  };
  const formats = ["header", "bold", "font", "size", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image"];

  console.log("inputValue?.description", inputValue);

  return (
    <>
      <ToastContainer />
      <div className="card p-1">
        <div className="p-2 mb-2">
          <div className="row mb-4 pr-3">
            <div className="col d-flex justify-content-between">
              <h2 className="pl-3 pt-2">Inhalt</h2>
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
            {/* {userInfo?.role?.roleName === "admin" && (
              <div className="cus-medium-button-style button-height">
                <button className="btn btncolor mr-2" onClick={() => setIsUser(true)}>
                  Hinzufügen
                </button>
              </div>
            )} */}
          </div>

          {loadingData ? (
            <div className="d-flex justify-content-center" style={{ marginTop: "20px" }}>
              <div className="spinner-border text-dark " role="status"></div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={propertyBuilder}
              customStyles={customStyles}
              highlightOnHover
              paginationComponentOptions={paginationComponentOptions}
              pagination
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
        </div>
      </div>
      {isUser ? (
        <Dialog fullScreen open={isUser} onClose={handleAddClose}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleAddClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
          <List>
            {isUser === true ? (
              <div className="form ml-30 ">
                <div className="form ml-30 ">
                  <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">Name</label>
                    <div className="col-lg-9 col-xl-6">
                      <div>
                        <input
                          type="text"
                          name="name"
                          value={inputValue?.name}
                          onChange={(e) => handleOnChange(e)}
                          className={`form-control form-control-lg form-control-solid`}
                        />
                      </div>
                      <span
                        style={{
                          color: "red",
                          top: "5px",
                          fontSize: "12px",
                        }}
                      >
                        {errors["name"]}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="form ml-30 ">
                  <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">Beschreibung</label>
                    <div className="col-lg-9 col-xl-6">
                      {/* <input
                                                type="text"
                                                name="description"
                                                value={inputValue?.description}
                                                onChange={(e) => handleOnChange(e)}
                                                className={`form-control form-control-lg form-control-solid`}
                                            /> */}
                      <ReactQuill
                        style={{ whiteSpace: "pre-line" }}
                        theme="snow"
                        id="description"
                        value={inputValue?.description}
                        modules={modules}
                        formats={formats}
                        onChange={(e) => handleOnChange(e)}
                        placeholder="Type..."
                      />
                      <span
                        style={{
                          color: "red",
                          top: "5px",
                          fontSize: "12px",
                        }}
                      >
                        {errors["description"]}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="form ml-30 ">
                  <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">Titel</label>
                    <div className="col-lg-9 col-xl-6">
                      <input
                        type="text"
                        name="title"
                        className={`form-control form-control-lg form-control-solid`}
                        value={inputValue?.title}
                        onChange={(e) => handleOnChange(e)}
                      />
                      {/* <ReactQuill
                                                style={{ whiteSpace: "pre-line" }}
                                                theme="snow"
                                                id="title"
                                                // value={inputValue?.description}
                                                modules={modules}
                                                formats={formats}
                                                onChange={(e) => handleOnChangeTitle(e)}
                                                placeholder="Type..."
                                            /> */}
                      <span
                        style={{
                          color: "red",
                          top: "5px",
                          fontSize: "12px",
                        }}
                      >
                        {errors["title"]}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="form ml-30 ">
                  <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">Untertitel</label>
                    <div className="col-lg-9 col-xl-6">
                      <input
                        type="text"
                        name="subTitle"
                        value={inputValue?.subTitle}
                        className={`form-control form-control-lg form-control-solid`}
                        onChange={(e) => handleOnChange(e)}
                      />
                      {/* <ReactQuill
                                                style={{ whiteSpace: "pre-line" }}
                                                theme="snow"
                                                id="subTitle"
                                                modules={modules}
                                                formats={formats}
                                                onChange={(e) => handleOnChangeSub(e)}
                                                placeholder="Type..."
                                            /> */}
                      <span
                        style={{
                          color: "red",
                          top: "5px",
                          fontSize: "12px",
                        }}
                      >
                        {errors["subTitle"]}
                      </span>{" "}
                    </div>
                  </div>
                </div>
                <div className="form ml-30 ">
                  <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">Services?</label>
                    <div className="col-lg-9 col-xl-6">
                      <div className="form-check form-check-inline">
                        <input
                          type="radio"
                          name="services"
                          value="true"
                          className="form-check-input"
                          onChange={(e) => handleOnChange(e)}
                          defaultChecked={inputValue?.services === true}
                        />
                        <label className="form-check-label">Ja</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="services"
                          value="false"
                          onChange={(e) => handleOnChange(e)}
                          defaultChecked={inputValue?.services === false}
                        />
                        <label className="form-check-label">Nein</label>
                      </div>
                      <div>
                        <span
                          style={{
                            color: "red",
                            top: "5px",
                            fontSize: "12px",
                          }}
                        >
                          {errors["services"]}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {isEditApi ? (
                  <div className="form ml-30 ">
                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">Bild</label>
                      <div className="col-lg-9 col-xl-6">
                        <div>
                          <input
                            type="file"
                            className={`form-control form-control-lg form-control-solid`}
                            name="imageForUpdate"
                            // value={productValues.image || null}
                            onChange={(e) => {
                              handleOnChnageAddImg(e);
                            }}
                            accept="image/*"
                            required
                          />
                        </div>
                        {console.log("firstImageeeeeeeee", inputValue?.imageForUpdate)}
                        <div>
                          {inputValue?.imageForUpdate && (
                            <img style={{ height: "128px", width: "128px" }} src={URL.createObjectURL(inputValue?.imageForUpdate)} />
                          )}
                        </div>

                        <span
                          style={{
                            color: "red",
                            top: "5px",
                            fontSize: "12px",
                          }}
                        >
                          {errors["imageForUpdate"]}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="form ml-30 ">
                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">Bild</label>
                      <div className="col-lg-9 col-xl-6">
                        <div>
                          <input
                            type="file"
                            className={`form-control form-control-lg form-control-solid`}
                            name="image"
                            // value={productValues.image || null}
                            onChange={(e) => {
                              handleOnChnageAddImg(e);
                            }}
                            accept="image/*"
                            required
                          />
                        </div>
                        <div>
                          {inputValue?.image && <img style={{ height: "128px", width: "128px" }} src={URL.createObjectURL(inputValue?.image)} />}
                        </div>
                        <span
                          style={{
                            color: "red",
                            top: "5px",
                            fontSize: "12px",
                          }}
                        >
                          {errors["image"]}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {isEditApi && !inputValue?.imageForUpdate && (
                  <div className="form ml-30 ">
                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">Bild hochladen</label>
                      <div className="col-lg-9 col-xl-6">
                        <div>
                          <img style={{ height: "128px", width: "128px" }} src={inputValue?.image} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="d-flex align-items-center justify-content-center">
                  {loadingBtn ? (
                    <button className="btn btncolor mr-2">
                      <span>{isEditApi ? "Speichern" : "Hinzufügen"}</span>
                      {loadingBtn && <span className="mx-3 spinner spinner-white"></span>}
                    </button>
                  ) : (
                    <button
                      className="btn btncolor mr-2"
                      onClick={(e) => {
                        isEditApi ? editRealEstate(e) : addRealEstate();
                      }}
                    >
                      <span>{isEditApi ? "Speichern" : "Hinzufügen"}</span>
                      {loadingBtn && <span className="mx-3 spinner spinner-white"></span>}
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </List>
        </Dialog>
      ) : null}
      <Modal show={showDelete} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Alarm!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Möchten Sie dieses Inserat entfernen?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Abbrechen
          </Button>
          <Button variant="danger" onClick={() => deleteContact()}>
            Löschen
          </Button>
        </Modal.Footer>
      </Modal>
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
                    {/* propertyName */}
                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">Name :</label>
                      <div className="col-lg-9 col-xl-6 pt-3">
                        <div>
                          <span>{rowinfo?.name ?? "-"}</span>
                        </div>
                      </div>
                    </div>

                    {/* propertyInterval */}
                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">Beschreibung :</label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: rowinfo?.description,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* houseType */}
                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">Untertitel :</label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>{rowinfo?.subTitle ?? "-"}</span>
                        </div>
                      </div>
                    </div>

                    {/* telephone */}
                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">Titel :</label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>{rowinfo?.title ?? "-"}</span>
                        </div>
                      </div>
                    </div>
                    {/* Image */}
                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">Bild:</label>
                      <div className="col-xl-9 col-lg-9 pt-3">
                        <div className="new-image-grid-align-for-modal">
                          {rowinfo?.image?.map((item: any, index: any) => (
                            <div className="new-image-grid-align-for-modal-items">
                              <img src={item} />
                            </div>
                          ))}
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

export default Content;
