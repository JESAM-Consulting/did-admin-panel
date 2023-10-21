import React, { useEffect, useState } from "react";
import DataTable, { defaultThemes } from "react-data-table-component";
import { toast, ToastContainer } from "react-toastify";
import DeleteIcon from "@material-ui/icons/Delete";
import CreateIcon from "@material-ui/icons/Create";
import { Toolbar } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import { List } from "@material-ui/core";
import { Tooltip } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Dialog } from "@material-ui/core";
import {
  ApiDelete,
  ApiGet,
  ApiPost,
  ApiPut,
} from "../../../helpers/API/ApiData";
import { Button } from "react-bootstrap";
import { getUserInfo } from "../../../utils/user.util";
import { Modal } from "react-bootstrap";
import useDebounce from "../../hooks/useDebounce";
import moment from "moment";
import InfoOutlined from "@material-ui/icons/InfoOutlined";

const PropertyManagement = () => {
  // pagination
  const [page, setPage] = useState<any>(1);
  const [count, setCount] = useState<any>(0);
  const [countPerPage, setCountPerPage] = useState<any>(10);
  const [loader, setLoader] = useState<any>(false);
  const [errors, setErrors] = useState<any>({});
  const [inputValue, setInputValue] = useState<any>({
    files: [],
  });
  const [isUser, setIsUser] = useState<any>(false);
  const [isRealstate, setIsRealstate] = useState<any>(false);
  const [propertyBuilder, setPropertyBuilder] = useState<any>([]);
  const [idForEditRealEstate, setIdForEditRealEstate] = useState<any>();
  const [show, setShow] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [deleteId, setdeleteId] = useState<any>();
  const [loadingBtn, setLoadingBtn] = useState<any>(false);
  const [loadingData, setLoadingData] = useState<any>(false);
  const [isEditApi, setIsEditApi] = useState<any>(false);
  const [displayModal, setDisplayModal] = useState<any>();
  const [idForChangeStatus, setIdForChangeStatus] = useState<any>();
  const [searchTerm, setSearchTerm] = useState<any>();
  const [uploadFiles, setUploadImages] = useState<any>([]);
  const [editImage, seteditimage] = useState<any>([]);
  const [info, setInfo] = useState<any>(false);
  const [rowinfo, setRowInfo] = useState<any>(false);
  const [addedimg, setAddedImg] = useState<any>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 800);
  const userInfo = getUserInfo();

  useEffect(() => {
    getPropertyBuilder();
  }, [debouncedSearchTerm, page, countPerPage]);

  const handleClose = () => {
    setShow(false);
    setInfo(false);
    setShowDelete(false);
    setUploadImages("");
  };

  const handleAddClose = () => {
    setUploadImages("");
    seteditimage("");
    setAddedImg("");
    setIsUser(false);
    setIsEditApi(false);
    setErrors({});
    setInputValue({});
  };

  const bindInput = (value: any) => {
    var regex = new RegExp("^[^0-9]*$");
    var key = String.fromCharCode(
      !value.charCode ? value.which : value.charCode
    );
    if (regex.test(key)) {
      value.preventDefault();
      return false;
    }
  };

  const handleUpdateStatus = async (status: any) => {
    let data = {
      isActive: status,
    };
    await ApiPut(`property/edit-property?_id=${idForChangeStatus}`, data)
      .then((res: any) => {
        setShow(false);
        getPropertyBuilder();
        toast.success(res?.data?.messages);
      })
      .catch((err) => {
        console.log("errrr", err);
        toast.error(err?.response);
      });
  };

  const getPropertyBuilder = async () => {
    setLoadingData(true);
    await ApiGet(
      `contact/get-contact?type=property&limit=${countPerPage}&page=${page}&isAll=true&letter=${
        searchTerm ?? ""
      }`
    )
      .then((res: any) => {
        setLoadingData(false);
        setPropertyBuilder(res?.data?.payload?.getContact);
        setCount(res?.data?.payload?.count);
      })
      .catch((err) => {
        setLoadingData(false);
        console.log("err", err);
      });
  };

  const handleOnChange = (e: any) => {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleOnChnageAddImg = (e: any) => {
    // const { files } = e.target;
    // setInputValue({
    //   ...inputValue,
    //   files: [...inputValue?.files, ...e?.target?.files],
    // });
    // setErrors({ ...errors, ["files"]: "" });
    setUploadImages(Array?.from(e.target.files));
    setErrors({ ...errors, [e.target.name]: "" });
  };

  function deleteFile(e: any) {
    const s = uploadFiles?.filter((item: any, index: any) => index !== e);
    setUploadImages(s);
  }

  const removeEditProduct = async (idForEdit: any, imgs: any) => {
    // const body = {
    //   propertyImage: imgs,
    // };
    let formdata = new FormData();
    formdata.append("propertyImage", imgs);
    await ApiPut(`property/remove-image?_id=${idForEdit}`, formdata)
      .then((res) => {
        getimg(idForEdit);
      })
      .catch((err) => {
        toast.error(err?.response);
      });
  };

  const getimg = async (id: any) => {
    await ApiGet(`property/get-property?_id=${id}`)
      .then((res: any) => {
        setAddedImg(res?.data?.payload?.getProperty[0]?.propertyImage);
        seteditimage(res?.data?.payload?.getProperty[0]?.propertyImage);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleMenu = () => {
    setShowDelete(true);
  };

  const validateforUserDataEdit = () => {
    let isFormValid: any = true;
    let errors: any = {};
    setLoader(false);
    if (inputValue && !inputValue?.name) {
      isFormValid = false;
      errors["name"] = "Bitte geben Sie Ihren Namen ein!";
    }
    if (inputValue && (!inputValue?.phone || inputValue?.phone?.length < 10)) {
      isFormValid = false;
      errors["phone"] = "Bitte gib deine Telefonnummer ein!";
    }

    if (inputValue && !inputValue?.interval) {
      isFormValid = false;
      errors["interval"] = "Bitte geben Sie Ihre Intervallzeit ein!";
    }
    if (!inputValue?.city || inputValue?.city === "") {
      isFormValid = false;
      errors["city"] = "Name der Stadt ist erforderlich!";
    }
    if (!inputValue?.state || inputValue?.state === "") {
      isFormValid = false;
      errors["state"] = "Staatsname ist erforderlich!";
    }
    if (!inputValue?.areaSize || inputValue?.areaSize === "") {
      isFormValid = false;
      errors["areaSize"] = "Flächengröße ist erforderlich!";
    }
    if (!inputValue?.description || inputValue?.description === "") {
      isFormValid = false;
      errors["description"] = "Beschreibung Feld ist erforderlich!";
    }
    if (!inputValue?.roomCount || inputValue?.roomCount === "") {
      isFormValid = false;
      errors["roomCount"] = "Raumanzahl ist erforderlich!";
    }
    if (!inputValue?.purchasePrice || inputValue?.purchasePrice === "") {
      isFormValid = false;
      errors["purchasePrice"] = "Kaufpreisfeld ist erforderlich!";
    }
    if (!inputValue?.basementCount || inputValue?.basementCount === "") {
      isFormValid = false;
      errors["basementCount"] = "Kellerzählfeld ist erforderlich!";
    }
    if (!inputValue?.houseType || inputValue?.houseType === "") {
      isFormValid = false;
      errors["houseType"] = "Das Feld vom Typ Haus ist erforderlich!";
    }
    if (!inputValue?.livingSpaceSize || inputValue?.livingSpaceSize === "") {
      isFormValid = false;
      errors["livingSpaceSize"] = "Living Space size -Feld ist erforderlich!";
    }
    if (!inputValue?.availableFrom || inputValue?.availableFrom === "") {
      isFormValid = false;
      errors["availableFrom"] = "Datum ist nicht ausgewählt!";
    }

    setErrors(errors);
    return isFormValid;
  };

  const validateforUserData = () => {
    let isFormValid: any = true;
    let errors: any = {};
    setLoader(false);
    if (inputValue && !inputValue?.name) {
      isFormValid = false;
      errors["name"] = "Bitte geben Sie Ihren Namen ein!";
    }
    if (inputValue && (!inputValue?.phone || inputValue?.phone?.length < 10)) {
      isFormValid = false;
      errors["phone"] = "Bitte gib deine Telefonnummer ein!";
    }

    if (inputValue && !inputValue?.interval) {
      isFormValid = false;
      errors["interval"] = "Bitte geben Sie Ihre Intervallzeit ein!";
    }
    if (!inputValue?.city || inputValue?.city === "") {
      isFormValid = false;
      errors["city"] = "Name der Stadt ist erforderlich!";
    }
    if (!inputValue?.state || inputValue?.state === "") {
      isFormValid = false;
      errors["state"] = "Staatsname ist erforderlich!";
    }
    if (!inputValue?.areaSize || inputValue?.areaSize === "") {
      isFormValid = false;
      errors["areaSize"] = "Flächengröße ist erforderlich!";
    }
    if (!inputValue?.roomCount || inputValue?.roomCount === "") {
      isFormValid = false;
      errors["roomCount"] = "Raumanzahl ist erforderlich!";
    }
    if (!inputValue?.purchasePrice || inputValue?.purchasePrice === "") {
      isFormValid = false;
      errors["purchasePrice"] = "Kaufpreisfeld ist erforderlich!";
    }
    if (!inputValue?.basementCount || inputValue?.basementCount === "") {
      isFormValid = false;
      errors["basementCount"] = "Kellerzählfeld ist erforderlich!";
    }
    if (!inputValue?.houseType || inputValue?.houseType === "") {
      isFormValid = false;
      errors["houseType"] = "Das Feld vom Typ Haus ist erforderlich!";
    }
    if (!inputValue?.livingSpaceSize || inputValue?.livingSpaceSize === "") {
      isFormValid = false;
      errors["livingSpaceSize"] = "LivingSpacesize -Feld ist erforderlich!";
    }
    if (!inputValue?.description || inputValue?.description === "") {
      isFormValid = false;
      errors["description"] = "Beschreibung Feld ist erforderlich!";
    }
    if (!inputValue?.isBalcony || inputValue?.isBalcony === "") {
      isFormValid = false;
      errors["isBalcony"] = "Dieses Feld ist nicht ausgewählt!";
    }
    if (!inputValue?.isBasement || inputValue?.isBasement === "") {
      isFormValid = false;
      errors["isBasement"] = "Dieses Feld ist nicht ausgewählt!";
    }
    if (!inputValue?.isGueElevator || inputValue?.isGueElevator === "") {
      isFormValid = false;
      errors["isGueElevator"] = "Dieses Feld ist nicht ausgewählt!";
    }
    if (!inputValue?.isGueToilet || inputValue?.isGueToilet === "") {
      isFormValid = false;
      errors["isGueToilet"] = "Dieses Feld ist nicht ausgewählt!";
    }
    if (!inputValue?.isFurniture || inputValue?.isFurniture === "") {
      isFormValid = false;
      errors["isFurniture"] = "Dieses Feld ist nicht ausgewählt!";
    }
    if (!inputValue?.availableFrom || inputValue?.availableFrom === "") {
      isFormValid = false;
      errors["availableFrom"] = "Datum ist nicht ausgewählt!";
    }
    if (uploadFiles?.length <= 0) {
      isFormValid = false;
      errors["image"] = "Bitte wählen Sie das Bild aus!";
    }
    setErrors(errors);
    return isFormValid;
  };

  const addRealEstate = async () => {
    if (validateforUserData()) {
      setLoadingBtn(true);
      let formData: any = new FormData();
      formData.append("propertyName", inputValue?.name);
      formData.append("contactNo", inputValue?.phone);
      formData.append("propertyInterval", inputValue?.interval);
      formData.append("city", inputValue?.city);
      formData.append("state", inputValue?.state);
      formData.append("areaSize", inputValue?.areaSize);
      formData.append("roomCount", inputValue?.roomCount);
      formData.append("price", inputValue?.purchasePrice);
      formData.append("basementCount", inputValue?.basementCount);
      formData.append("houseType", inputValue?.houseType);
      formData.append("livingSpaceSize", inputValue?.livingSpaceSize);
      formData.append("description", inputValue?.description);
      formData.append("isBalcony", inputValue?.isBalcony);
      formData.append("isBasement", inputValue?.isBasement);
      formData.append("isGueElevator", inputValue?.isGueElevator);
      formData.append("isGueToilet", inputValue?.isGueToilet);
      formData.append("isFurniture", inputValue?.isFurniture);
      formData.append(
        "availableFrom",
        moment(inputValue?.availableFrom).utc().format()
      );
      // formData.append("x-auth-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Mzg5YzBlZDhlNTFlMTkyN2QwMWQ5MzIiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2Njk5ODI2MTN9.dFrLxTcLzVxZ9MUJWKmiQhoPyBH5uky57o_Z_YiUNxM");
      let fileArr = Array?.from(uploadFiles);
      fileArr.forEach((file) => {
        formData.append("propertyImage", file);
      });
      await ApiPost(`property/list-property`, formData)
        .then((res: any) => {
          setIsUser(false);
          toast.success(res?.data?.messages);
          setLoadingBtn(false);
          setInputValue({});
          setUploadImages("");
          setAddedImg("");
          getPropertyBuilder();
        })
        .catch((err) => {
          console.log(err?.response);
          setLoadingBtn(false);
          toast.error("Etwas ist schief gelaufen.Bitte versuche es erneut");
        });
    }
  };

  const addNewImage = async (Images: any) => {
    const NewImages = new FormData();
    let fileArry = Array?.from(Images);
    fileArry.forEach((file: any) => {
      NewImages.append("propertyImage", file);
    });

    await ApiPut(`property/push-image?_id=${idForEditRealEstate}`, NewImages)
      .then((res: any) => {
        setAddedImg(res?.data?.payload?.propertyImage);
      })
      .catch((err) => {
        setLoadingBtn(false);
        toast.error(err?.response);
      });
  };

  const editRealEstate = async (e: any) => {
    if (validateforUserDataEdit()) {
      setLoadingBtn(true);
      let formData: any = new FormData();
      formData.append("propertyName", inputValue?.name);
      formData.append("contactNo", inputValue?.phone);
      formData.append("propertyInterval", inputValue?.interval);
      formData.append("city", inputValue?.city);
      formData.append("state", inputValue?.state);
      formData.append("areaSize", inputValue?.areaSize);
      formData.append("roomCount", inputValue?.roomCount);
      formData.append("price", inputValue?.purchasePrice);
      formData.append("basementCount", inputValue?.basementCount);
      formData.append("houseType", inputValue?.houseType);
      formData.append("livingSpaceSize", inputValue?.livingSpaceSize);
      formData.append(
        "availableFrom",
        moment(inputValue?.availableFrom).utc().format()
      );
      formData.append("description", inputValue?.description);
      formData.append("isBalcony", inputValue?.isBalcony);
      formData.append("isBasement", inputValue?.isBasement);
      formData.append("isGueElevator", inputValue?.isGueElevator);
      formData.append("isGueToilet", inputValue?.isGueToilet);
      formData.append("isFurniture", inputValue?.isFurniture);
      // let allImg=[...uploadFiles,...editImage]
      let fileArr = Array?.from(uploadFiles ? uploadFiles : editImage);
      fileArr.forEach((file) => {
        formData.append("propertyImage", file);
      });
      await ApiPut(
        `property/edit-property?_id=${idForEditRealEstate}`,
        formData
      )
        .then((res: any) => {
          if (res?.status === 200) {
            toast.success(res?.data?.messages);
            // getAllRealEstate();
            setIsRealstate(false);
            setInputValue({});
            seteditimage([]);
            setAddedImg([]);
            setUploadImages([]);
            setIsUser(false);
            setIsEditApi(false);
            setLoadingBtn(false);
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
    }
  };

  const deleteContact = async () => {
    // let data = {};
    await ApiDelete(`contact/remove-contact?limit=10&_id=${deleteId}`)
      .then((res: any) => {
        if (res?.status === 200) {
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

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
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
            <div className="d-flex align-items-center" style={{ gap: "10px" }}>
              {/* <div
                className="cursor-pointer"
                onClick={() => {
                  setIsUser(true);
                  console.log("rowsresss", row);
                  setIsEditApi(true);
                  setIdForEditRealEstate(row?._id);
                  setInputValue({
                    name: row?.propertyName,
                    phone: row?.contactNo,
                    interval: row?.propertyInterval,
                    city: row?.city,
                    state: row?.state,
                    areaSize: row?.areaSize,
                    roomCount: row?.roomCount,
                    purchasePrice: row?.price,
                    basementCount: row?.basementCount,
                    houseType: row?.houseType,
                    livingSpaceSize: row?.livingSpaceSize,
                    isBalcony: row?.isBalcony,
                    isBasement: row?.isBasement,
                    isGueElevator: row?.isGueElevator,
                    isGueToilet: row?.isGueToilet,
                    isFurniture: row?.isFurniture,
                    availableFrom: moment(row?.availableFrom).format(
                      "YYYY-MM-DD"
                    ),
                    description: row?.description,
                    // files: row?.propertyImage,
                  });
                  seteditimage(row?.propertyImage);
                }}
              >
                <Tooltip title="Speichern" arrow>
                  <CreateIcon />
                </Tooltip>
              </div> */}
              <div
                className="cursor-pointer"
                onClick={() => {
                  setRowInfo(row);
                  setInfo(true);
                }}
              >
                <InfoOutlined />
              </div>
              <div
                className="pl-3 cursor-pointer"
                onClick={() => {
                  handleMenu();
                  setdeleteId(row._id);
                }}
              >
                <DeleteIcon />
              </div>
              {/* <div className="cus-medium-button-style button-height">
                <Tooltip
                  title={
                    row?.isActive
                      ? "Deaktivierte Kombination"
                      : "Aktivierte Kombination"
                  }
                >
                  <button
                    // className="btn btn-success mr-2"
                    className={
                      row?.isActive
                        ? "btn btn-primary button-alignment mr-2"
                        : "btn btn-success button-alignment mr-2"
                    }
                    onClick={() => {
                      setDisplayModal(row.isActive);
                      setShow(true);
                      setIdForChangeStatus(row?._id);
                      // handleDeleteAnnouncement(row?._id)
                    }}
                  >
                    {row.isActive ? "Aktivieren" : "Deaktivieren"}
                  </button>
                </Tooltip>
              </div> */}
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
              <h2 className="pl-3 pt-2">Immobilienverwaltung</h2>
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
                <button
                  className="btn btncolor mr-2"
                  onClick={() => setIsUser(true)}
                >
                  Hinzufügen
                </button>
              </div>
            )} */}
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
              data={propertyBuilder}
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
        </div>
      </div>
      {isUser ? (
        <Dialog fullScreen open={isUser} onClose={handleAddClose}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleAddClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
          <List>
            {isUser === true ? (
              <div className="form ml-30 ">
                <div className="form ml-30 ">
                  <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">
                      Name des Anwesens
                    </label>
                    <div className="col-lg-9 col-xl-6">
                      <div>
                        <input
                          type="text"
                          name="name"
                          value={inputValue?.name}
                          onChange={(e) => handleOnChange(e)}
                          className={`form-control form-control-lg form-control-solid `}
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
                    <label className="col-xl-3 col-lg-3 col-form-label">
                      Kaufpreis
                    </label>
                    <div className="col-lg-9 col-xl-6">
                      <input
                        type="number"
                        name="purchasePrice"
                        value={inputValue?.purchasePrice}
                        onChange={(e) => handleOnChange(e)}
                        className={`form-control form-control-lg form-control-solid `}
                      />

                      <span
                        style={{
                          color: "red",
                          top: "5px",
                          fontSize: "12px",
                        }}
                      >
                        {errors["purchasePrice"]}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="form ml-30 ">
                  <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">
                      Flächengröße
                    </label>
                    <div className="col-lg-9 col-xl-6">
                      <input
                        type="number"
                        name="areaSize"
                        className={`form-control form-control-lg form-control-solid `}
                        value={inputValue?.areaSize}
                        onChange={(e) => handleOnChange(e)}
                      />

                      <span
                        style={{
                          color: "red",
                          top: "5px",
                          fontSize: "12px",
                        }}
                      >
                        {errors["areaSize"]}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="form ml-30 ">
                  <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">
                      Zimmer
                    </label>
                    <div className="col-lg-9 col-xl-6">
                      <input
                        type="number"
                        name="roomCount"
                        value={inputValue?.roomCount}
                        className={`form-control form-control-lg form-control-solid `}
                        onChange={(e) => handleOnChange(e)}
                      />
                      <span
                        style={{
                          color: "red",
                          top: "5px",
                          fontSize: "12px",
                        }}
                      >
                        {errors["roomCount"]}
                      </span>{" "}
                    </div>
                  </div>
                </div>
                <div className="form ml-30 ">
                  <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">
                      Bundesland
                    </label>
                    <div className="col-lg-9 col-xl-6">
                      <input
                        type="text"
                        name="state"
                        value={inputValue?.state}
                        onChange={(e) => handleOnChange(e)}
                        className={`form-control form-control-lg form-control-solid `}
                      />
                      <span
                        style={{
                          color: "red",
                          top: "5px",
                          fontSize: "12px",
                        }}
                      >
                        {errors["state"]}
                      </span>{" "}
                    </div>
                  </div>
                </div>
                <div className="form ml-30 ">
                  <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">
                      Stadt
                    </label>
                    <div className="col-lg-9 col-xl-6">
                      <input
                        type="text"
                        name="city"
                        value={inputValue?.city}
                        onChange={(e) => handleOnChange(e)}
                        className={`form-control form-control-lg form-control-solid `}
                      />

                      <span
                        style={{
                          color: "red",
                          top: "5px",
                          fontSize: "12px",
                        }}
                      >
                        {errors["city"]}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="form ml-30 ">
                  <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">
                      Telefon
                    </label>
                    <div className="col-lg-9 col-xl-6">
                      <input
                        type="text"
                        name="phone"
                        value={inputValue?.phone}
                        onChange={(e) =>
                          e.target.value.length <= 10 && handleOnChange(e)
                        }
                        className={`form-control form-control-lg form-control-solid `}
                        onKeyPress={bindInput}
                      />

                      <span
                        style={{
                          color: "red",
                          top: "5px",
                          fontSize: "12px",
                        }}
                      >
                        {errors["phone"]}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="form ml-30 ">
                  <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">
                      Intervall
                    </label>
                    <div className="col-lg-9 col-xl-6">
                      <input
                        type="number"
                        name="interval"
                        value={inputValue?.interval}
                        onChange={(e) => handleOnChange(e)}
                        className={`form-control form-control-lg form-control-solid `}
                      />

                      <span
                        style={{
                          color: "red",
                          top: "5px",
                          fontSize: "12px",
                        }}
                      >
                        {errors["interval"]}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="form ml-30 ">
                  <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">
                      Beschreibung
                    </label>
                    <div className="col-lg-9 col-xl-6">
                      <input
                        type="text"
                        name="description"
                        value={inputValue?.description}
                        onChange={(e) => handleOnChange(e)}
                        className={`form-control form-control-lg form-control-solid `}
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
                    <label className="col-xl-3 col-lg-3 col-form-label">
                      Tiefgaragenstellplatz
                    </label>
                    <div className="col-lg-9 col-xl-6">
                      <input
                        type="number"
                        name="basementCount"
                        value={inputValue?.basementCount}
                        onChange={(e) => handleOnChange(e)}
                        className={`form-control form-control-lg form-control-solid `}
                      />
                      <span
                        style={{
                          color: "red",
                          top: "5px",
                          fontSize: "12px",
                        }}
                      >
                        {errors["basementCount"]}
                      </span>{" "}
                    </div>
                  </div>
                </div>
                <div className="form ml-30 ">
                  <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">
                      Art des Vermögens
                    </label>
                    <div className="col-lg-9 col-xl-6">
                      <input
                        type="text"
                        name="houseType"
                        value={inputValue?.houseType}
                        onChange={(e) => handleOnChange(e)}
                        className={`form-control form-control-lg form-control-solid `}
                      />
                      <span
                        style={{
                          color: "red",
                          top: "5px",
                          fontSize: "12px",
                        }}
                      >
                        {errors["houseType"]}
                      </span>{" "}
                    </div>
                  </div>
                </div>
                <div className="form ml-30 ">
                  <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">
                      Wohnbereich
                    </label>
                    <div className="col-lg-9 col-xl-6">
                      <input
                        type="number"
                        name="livingSpaceSize"
                        value={inputValue?.livingSpaceSize}
                        onChange={(e) => handleOnChange(e)}
                        className={`form-control form-control-lg form-control-solid `}
                      />

                      <span
                        style={{
                          color: "red",
                          top: "5px",
                          fontSize: "12px",
                        }}
                      >
                        {errors["livingSpaceSize"]}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="form ml-30 ">
                  <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">
                      Bezugsfrei ab
                    </label>
                    <div className="col-lg-9 col-xl-6">
                      <input
                        type="date"
                        name="availableFrom"
                        value={inputValue?.availableFrom}
                        onChange={(e) => handleOnChange(e)}
                        min={new Date().toISOString().split("T")[0]}
                        className={`form-control form-control-lg form-control-solid `}
                      />

                      <span
                        style={{
                          color: "red",
                          top: "5px",
                          fontSize: "12px",
                        }}
                      >
                        {errors["availableFrom"]}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="form ml-30 ">
                  <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">
                      Gibt es Balkon/Terrasse?
                    </label>
                    <div className="col-lg-9 col-xl-6">
                      <div className="form-check form-check-inline">
                        <input
                          type="radio"
                          name="isBalcony"
                          value="true"
                          className="form-check-input"
                          onChange={(e) => handleOnChange(e)}
                          defaultChecked={inputValue?.isBalcony === true}
                        />
                        <label className="form-check-label">Ja</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="isBalcony"
                          value="false"
                          onChange={(e) => handleOnChange(e)}
                          defaultChecked={inputValue?.isBalcony === false}
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
                          {errors["isBalcony"]}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form ml-30 ">
                  <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">
                      Gibt es einen Keller/Keller?
                    </label>
                    <div className="col-lg-9 col-xl-6">
                      <div className="form-check form-check-inline">
                        <input
                          type="radio"
                          name="isBasement"
                          value="true"
                          className="form-check-input"
                          onChange={(e) => handleOnChange(e)}
                          defaultChecked={inputValue?.isBasement === true}
                        />
                        <label className="form-check-label">Ja</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="isBasement"
                          value="false"
                          onChange={(e) => handleOnChange(e)}
                          defaultChecked={inputValue?.isBasement === false}
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
                          {errors["isBasement"]}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form ml-30 ">
                  <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">
                      Gibt es einen Personenaufzug?
                    </label>
                    <div className="col-lg-9 col-xl-6">
                      <div className="form-check form-check-inline">
                        <input
                          type="radio"
                          name="isGueElevator"
                          value="true"
                          className="form-check-input"
                          onChange={(e) => handleOnChange(e)}
                          defaultChecked={inputValue?.isGueElevator === true}
                        />
                        <label className="form-check-label">Ja</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="isGueElevator"
                          value="false"
                          onChange={(e) => handleOnChange(e)}
                          defaultChecked={inputValue?.isGueElevator === false}
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
                          {errors["isGueElevator"]}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form ml-30 ">
                  <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">
                      Gibt es ein Gäste-WC?
                    </label>
                    <div className="col-lg-9 col-xl-6">
                      <div className="form-check form-check-inline">
                        <input
                          type="radio"
                          name="isGueToilet"
                          value="true"
                          className="form-check-input"
                          onChange={(e) => handleOnChange(e)}
                          defaultChecked={inputValue?.isGueToilet === true}
                        />
                        <label className="form-check-label">Ja</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="isGueToilet"
                          value="false"
                          onChange={(e) => handleOnChange(e)}
                          defaultChecked={inputValue?.isGueToilet === false}
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
                          {errors["isGueToilet"]}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form ml-30 ">
                  <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">
                      Gibt es Möbel?
                    </label>
                    <div className="col-lg-9 col-xl-6">
                      <div className="form-check form-check-inline">
                        <input
                          type="radio"
                          name="isFurniture"
                          value="true"
                          className="form-check-input"
                          onChange={(e) => handleOnChange(e)}
                          defaultChecked={inputValue?.isFurniture === true}
                        />
                        <label className="form-check-label">Ja</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="isFurniture"
                          value="false"
                          onChange={(e) => handleOnChange(e)}
                          defaultChecked={inputValue?.isFurniture === false}
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
                          {errors["isFurniture"]}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {isEditApi ? (
                  <>
                    <div className="form ml-30 ">
                      <div className="form-group row">
                        <label className="col-xl-3 col-lg-3 col-form-label">
                          Bild aktualisieren
                        </label>
                        <div className="col-lg-9 col-xl-6">
                          <div>
                            <input
                              type="file"
                              className={`form-control form-control-lg form-control-solid `}
                              name="image"
                              multiple
                              onChange={(e) => {
                                // handleOnChnageAddImg(e);
                                addNewImage(e.target.files);
                              }}
                              accept="image/*"
                              required
                            />
                          </div>
                          <div
                            className="d-flex flex-wrap pt-2"
                            style={{ gap: "15px" }}
                          >
                            {addedimg && addedimg?.length > 0 ? (
                              <>
                                {addedimg?.map((imgs: any, index: any) => {
                                  return (
                                    <>
                                      <div className="position-relative">
                                        <img
                                          key={index}
                                          src={imgs}
                                          alt=""
                                          style={{
                                            width: "100px",
                                            height: "100px",
                                            borderRadius: "10px",
                                            objectFit: "cover",
                                          }}
                                        />
                                        <div
                                          className="justify-content-center p-2 position-absolute"
                                          style={{
                                            right: "-10px",
                                            top: "-13px",
                                          }}
                                        >
                                          <i
                                            className="fa-solid fa-circle-xmark"
                                            aria-hidden="true"
                                            style={{ color: "#000" }}
                                            onClick={(e: any) => {
                                              removeEditProduct(
                                                idForEditRealEstate,
                                                imgs
                                              );
                                            }}
                                          ></i>
                                        </div>
                                      </div>
                                    </>
                                  );
                                })}
                              </>
                            ) : (
                              <>
                                {editImage?.length > 0 &&
                                  editImage?.map((imgs: any, index: any) => {
                                    return (
                                      <>
                                        <div className="position-relative">
                                          <img
                                            key={index}
                                            src={imgs}
                                            alt=""
                                            style={{
                                              width: "100px",
                                              height: "100px",
                                              borderRadius: "10px",
                                              objectFit: "cover",
                                            }}
                                          />
                                          <div
                                            className="justify-content-center p-2 position-absolute"
                                            style={{
                                              right: "-10px",
                                              top: "-13px",
                                            }}
                                          >
                                            <i
                                              className="fa-solid fa-circle-xmark"
                                              style={{ color: "#000" }}
                                              aria-hidden="true"
                                              onClick={(e: any) => {
                                                removeEditProduct(
                                                  idForEditRealEstate,
                                                  imgs
                                                );
                                              }}
                                            ></i>
                                          </div>
                                        </div>
                                      </>
                                    );
                                  })}
                              </>
                            )}
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
                  </>
                ) : (
                  <>
                    <div className="form ml-30 ">
                      <div className="form-group row">
                        <label className="col-xl-3 col-lg-3 col-form-label">
                          Bild
                        </label>
                        <div className="col-lg-9 col-xl-6">
                          <div>
                            <input
                              type="file"
                              accept="image/*"
                              className={`form-control form-control-lg form-control-solid `}
                              id="image"
                              name="image"
                              multiple
                              onChange={(e) => handleOnChnageAddImg(e)}
                            />
                          </div>
                          <br />
                          <div
                            className="d-flex flex-wrap"
                            style={{ gap: "15px" }}
                          >
                            {uploadFiles &&
                              uploadFiles?.map((img: any, index: any) => {
                                return (
                                  <>
                                    <div className="position-relative">
                                      <img
                                        key={index}
                                        src={URL.createObjectURL(img)}
                                        alt=""
                                        style={{
                                          width: "100px",
                                          height: "100px",
                                          borderRadius: "10px",
                                          // objectFit: "cover",
                                        }}
                                      />
                                      <div
                                        className="justify-content-center p-2 position-absolute"
                                        style={{ right: "-10px", top: "-13px" }}
                                      >
                                        <i
                                          style={{ color: "#000" }}
                                          className="fa-solid fa-circle-xmark"
                                          aria-hidden="true"
                                          onClick={() => deleteFile(index)}
                                        ></i>
                                      </div>
                                    </div>
                                  </>
                                );
                              })}
                            <span
                              style={{
                                color: "red",
                                top: "5px",
                                fontSize: "12px",
                              }}
                            >
                              {errors.image}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <div className="d-flex align-items-center justify-content-center">
                  {loadingBtn ? (
                    <button className="btn btncolor mr-2">
                      <span>{isEditApi ? "Speichern" : "Hinzufügen"}</span>
                      {loadingBtn && (
                        <span className="mx-3 spinner spinner-white"></span>
                      )}
                    </button>
                  ) : (
                    <button
                      className="btn btncolor mr-2"
                      onClick={(e) => {
                        isEditApi ? editRealEstate(e) : addRealEstate();
                      }}
                    >
                      <span>{isEditApi ? "Speichern" : "Hinzufügen"}</span>
                      {loadingBtn && (
                        <span className="mx-3 spinner spinner-white"></span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </List>
        </Dialog>
      ) : null}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Alarm!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Wollen Sie das wirklich
          {displayModal === true ? " deaktivieren" : " aktivieren"}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Abbrechen
          </Button>
          <Button
            variant={displayModal === true ? "success" : "primary"}
            onClick={() => {
              handleUpdateStatus(!displayModal);
            }}
          >
            {displayModal === true ? "Deaktivieren" : "Aktivieren"}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showDelete} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Alarm!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Möchten Sie diesen Kontaktanfrage entfernen ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Abbrechen
          </Button>
          <Button variant="danger" onClick={() => deleteContact()}>
            Löschen
          </Button>
        </Modal.Footer>
      </Modal>

      {/* //row info */}
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
            {/* {info && (
              <>
                <div className="ml-40">
                  <div className="form cus-container">
                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">
                        Name des Anwesens :
                      </label>
                      <div className="col-lg-9 col-xl-6 pt-3">
                        <div>
                          <span>{rowinfo?.propertyName ?? "-"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">
                        Eigenschaft Intervall :
                      </label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>{rowinfo?.propertyInterval ?? "-"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">
                        Haustyp :
                      </label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>{rowinfo?.houseType ?? "-"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">
                        Telefon :
                      </label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>{rowinfo?.contactNo ?? "-"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">
                        Verfügbar ab :
                      </label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>
                            {moment(rowinfo?.availableFrom).format(
                              "MM/DD/YYYY"
                            ) ?? "-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">
                        Stadt :
                      </label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>{rowinfo?.city ?? "-"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">
                        Zustand :
                      </label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>{rowinfo?.state ?? "-"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">
                        KellerCount :
                      </label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>{rowinfo?.basementCount ?? "-"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">
                        Bezeichnung :
                      </label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>{rowinfo?.description ?? "-"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">
                        Wohnfläche Größe :
                      </label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>{rowinfo?.livingSpaceSize ?? "-"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">
                        Zimmeranzahl :
                      </label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>{rowinfo?.roomCount ?? "-"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">
                        Kaufpreis :
                      </label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>{rowinfo?.price ?? "-"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">
                        Gibt es Balkon/Terrasse? :
                      </label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>
                            {rowinfo?.isBalcony === true ? "Ja" : "Nein"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">
                        Gibt es einen Personenaufzug? :
                      </label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>
                            {rowinfo?.isGueElevator === true ? "Ja" : "Nein"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">
                        Gibt es ein Gäste-WC? :
                      </label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>
                            {rowinfo?.isGueToilet === true ? "Ja" : "Nein"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">
                        Gibt es einen Keller/Keller? :
                      </label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>
                            {rowinfo?.isBasement === true ? "Ja" : "Nein"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">
                        Gibt es Möbel? :
                      </label>
                      <div className="col-xl-3 col-lg-3 pt-3">
                        <div>
                          <span>
                            {rowinfo?.isFurniture === true ? "Ja" : "Nein"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="form-group row">
                      <label className="col-xl-3 col-lg-3 col-form-label">
                        Bild:
                      </label>
                      <div className="col-xl-9 col-lg-9 pt-3">
                        <div className="new-image-grid-align-for-modal">
                          {rowinfo?.propertyImage?.map(
                            (item: any, index: any) => (
                              <div className="new-image-grid-align-for-modal-items">
                                <img src={item} />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )} */}
          </List>
        </Dialog>
      ) : null}
    </>
  );
};

export default PropertyManagement;
