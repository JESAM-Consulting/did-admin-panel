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
import { ApiDelete, ApiGet, ApiPost, ApiPut } from "../../../helpers/API/ApiData";
import { Button } from "react-bootstrap";
import { getUserInfo } from "../../../utils/user.util";
import { Modal } from "react-bootstrap";
import useDebounce from "../../hooks/useDebounce";
import moment from "moment";
import InfoOutlined from "@material-ui/icons/InfoOutlined";

const Companies = () => {
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
    const [show, setShow] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [deleteId, setdeleteId] = useState<any>();
    const [loadingBtn, setLoadingBtn] = useState<any>(false);
    const [loadingData, setLoadingData] = useState<any>(false);
    const [isEditApi, setIsEditApi] = useState<any>(false);
    const [displayModal, setDisplayModal] = useState();
    const [idForChangeStatus, setIdForChangeStatus] = useState<any>();
    const [searchTerm, setSearchTerm] = useState<any>();
    const [info, setInfo] = useState<any>(false);
    const [rowinfo, setRowInfo] = useState<any>(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 800);
    const userInfo = getUserInfo();

    useEffect(() => {
        getPropertyBuilder();
    }, [debouncedSearchTerm, page, countPerPage]);

    const handleClose = () => {
        setShow(false);
        setInfo(false);
        setShowDelete(false)
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

    const regexEmail =
        /^(([^<>()[\],;:\s@]+([^<>()[\],;:\s@]+)*)|(.+))@(([^<>()[\],;:\s@]+)+[^<>()[\],;:\s@]{2,})$/i;

    const validateforUserData = () => {
        let isFormValid: any = true;
        let errors: any = {};
        setLoader(false);
        if (inputValue && !inputValue?.name) {
            isFormValid = false;
            errors["name"] = "bitte tragen Sie Ihren vollen Namen ein!";
        }
        if (inputValue && (!inputValue?.phone)) {
            isFormValid = false;
            errors["phone"] = "Bitte gib deine Telefonnummer ein!";
        }

        if (inputValue && !inputValue?.description) {
            isFormValid = false;
            errors["description"] = "Bitte Beschreibung eingeben!";
        }
        if (
            inputValue &&
            (!inputValue?.email || regexEmail.test(inputValue.email) === false)
        ) {
            isFormValid = false;
            errors["email"] = "Bitte geben Sie Ihre E-Mail ein.";
        }
        if (!inputValue?.occupationRole && !inputValue?.occupationRole) {
            isFormValid = false;
            errors["occupationRole"] = "Bitte geben Sie die Berufsrolle ein!";
        }
        if (!inputValue?.image && !inputValue?.image) {
            isFormValid = false;
            errors["image"] = "Bitte Profilfoto eingeben!";
        }
        setErrors(errors);
        return isFormValid;
    };


    const handleUpdateStatus = async (status: any) => {
        let data = {
            isActive: status,
        };
        await ApiPut(`company/edit-company?_id=${idForChangeStatus}`, data)
            .then((res: any) => {
                setShow(false);
                console.log("ressss", res);
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
            `company/get-company?limit=${countPerPage}&page=${page}&isAll=true&letter=${searchTerm ?? ""
            }`
        )
            .then((res: any) => {
                console.log("getuser", res);
                setLoadingData(false);
                setPropertyBuilder(res?.data?.payload?.getCompany);
                setCount(res?.data?.payload?.count);
            })
            .catch((err) => {
                setLoadingData(false);
                console.log("err", err);
            });
    };

    const handleOnChange = (e: any) => {
        const { name, value } = e.target;
        console.log("namemeeeee", name, value);
        setInputValue({ ...inputValue, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const handleOnChnageAddImg = (e: any) => {
        const { name } = e.target;
        setInputValue({ ...inputValue, [name]: e.target.files[0] });
        setErrors({ ...errors, [name]: "" });
    };

    const handleMenu = () => {
        setShowDelete(true);
    };

    const addRealEstate = async () => {
        if (validateforUserData()) {
            setLoadingBtn(true);
            let formData: any = new FormData();
            formData.append("name", inputValue?.name);
            formData.append("email", inputValue?.email);
            formData.append("phone", inputValue?.phone);
            formData.append("description", inputValue?.description);
            formData.append("occupationRole", inputValue?.occupationRole);
            formData.append("userImage", inputValue?.image);

            await ApiPost(`company/list-company`, formData)
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
        }
    };

    const editRealEstate = async (e: any) => {
        if (validateforUserData()) {
            setLoadingBtn(true);
            let formData: any = new FormData();
            formData.append("name", inputValue?.name);
            formData.append("email", inputValue?.email);
            formData.append("phone", inputValue?.phone);
            formData.append("description", inputValue?.description);
            formData.append("occupationRole", inputValue?.occupationRole);
            formData.append("userImage", inputValue?.imageForUpdate);
            await ApiPut(`company/edit-company?_id=${idForEditRealEstate}`, formData)
                .then((res: any) => {
                    if (res?.status === 200) {
                        toast.success(res?.data?.messages);
                        console.log("editres", res);
                        // getAllRealEstate();
                        setIsRealstate(false);
                        setInputValue({});
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
        await ApiDelete(`company/remove-company?_id=${deleteId}`)
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

    const handleAddClose = () => {
        setIsUser(false);
        setIsEditApi(false);
        setErrors({});
        setInputValue({});
    };

    const handleSearch = (e: any) => {
        console.log("firsteeeeeeeee", e.target.value);
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

        rowsPerPageText: 'Zeilen pro Seite',
        rangeSeparatorText: 'von',
    }

    const columns = [
        {
            name: " Nr.",
            // cell: (row: any, index: any) => index + 1,
            cell: (row: any, index: any) => (page - 1) * countPerPage + (index + 1),
            width: "5%",
        },
        {
            name: "Datum",
            selector: (row: any) => moment(row?.createdAt).format("DD/MM/YYYY") ?? "-",
            sortable: true,
        },
        {
            name: "Name",
            selector: (row: any) => row?.name ?? "-",
            sortable: true,
        },
        {
            name: "E-Mail",
            selector: (row: any) => row?.email ?? "-",
            sortable: true,
        },

        {
            name: "Beruf",
            selector: (row: any) => row?.occupationRole ?? "-",
            sortable: true,
        },
        {
            name: "Telefon",
            selector: (row: any) => row?.phone ?? "-",
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
                                    setIsUser(true);
                                    console.log("rowsresss", row);
                                    setIsEditApi(true);
                                    setIdForEditRealEstate(row?._id);
                                    setInputValue({
                                        name: row?.name,
                                        phone: row?.phone,
                                        email: row?.email,
                                        occupationRole: row?.occupationRole,
                                        description: row?.description,
                                        image: row?.userImage,
                                    });

                                }}
                            >
                                <Tooltip title="Edit Content" arrow>
                                    <CreateIcon />
                                </Tooltip>
                            </div>
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
                                className="pl-3 cursor-pointer"
                                onClick={() => {
                                    handleMenu();
                                    setdeleteId(row._id);
                                }}
                            >
                                <DeleteIcon />
                            </div>
                            <div className="cus-medium-button-style button-height">
                                <Tooltip
                                    title={
                                        row?.isActive ? "Deaktivierte Kombination" : "Aktivierte Kombination"
                                    }
                                >
                                    <button
                                        // className="btn btn-success mr-2"
                                        className={
                                            row?.isActive
                                                ? "btn btn-primary maxwidth button-alignment mr-2"
                                                : "btn btn-success maxwidth button-alignment mr-2"
                                        }
                                        onClick={() => {
                                            setDisplayModal(row.isActive);
                                            setShow(true);
                                            setIdForChangeStatus(row?._id);
                                            // handleDeleteAnnouncement(row?._id)
                                        }}
                                    >
                                        {row.isActive ? "Aktiv" : "Deaktiv"}
                                    </button>
                                </Tooltip>
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
                            <h2 className="pl-3 pt-2">Mitarbeiter</h2>
                        </div>
                        <div className="col">
                            <div>
                                <input
                                    type="text"
                                    style={{ borderRadius: '9999px' }}
                                    className={`form-control form-control-lg form-control-solid `}
                                    name="search"
                                    onChange={(e) => handleSearch(e)}
                                    placeholder="Suchen…"
                                />
                            </div>
                        </div>
                        {userInfo?.role?.roleName === "admin" && (
                            <div className="cus-medium-button-style button-height">
                                <button
                                    className="btn btncolor mr-2"
                                    onClick={() => setIsUser(true)}
                                >
                                    Hinzufügen
                                </button>
                            </div>
                        )}
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
                                            Vollständiger Name
                                        </label>
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
                                        <label className="col-xl-3 col-lg-3 col-form-label">
                                            E-Mail
                                        </label>
                                        <div className="col-lg-9 col-xl-6">
                                            <input
                                                type="text"
                                                name="email"
                                                value={inputValue?.email}
                                                onChange={(e) => handleOnChange(e)}
                                                className={`form-control form-control-lg form-control-solid`}
                                            />

                                            <span
                                                style={{
                                                    color: "red",
                                                    top: "5px",
                                                    fontSize: "12px",
                                                }}
                                            >
                                                {errors["email"]}
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
                                                className={`form-control form-control-lg form-control-solid`}
                                                value={inputValue?.phone}
                                                onKeyPress={bindInput}
                                                onChange={(e) => handleOnChange(e)}
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
                                            Beschreibung
                                        </label>
                                        <div className="col-lg-9 col-xl-6">
                                            <input
                                                type="text"
                                                name="description"
                                                value={inputValue?.description}
                                                className={`form-control form-control-lg form-control-solid`}
                                                onChange={(e) => handleOnChange(e)}
                                            />
                                            <span
                                                style={{
                                                    color: "red",
                                                    top: "5px",
                                                    fontSize: "12px",
                                                }}
                                            >
                                                {errors["description"]}
                                            </span>{" "}
                                        </div>
                                    </div>
                                </div>
                                <div className="form ml-30 ">
                                    <div className="form-group row">
                                        <label className="col-xl-3 col-lg-3 col-form-label">
                                            Beruf
                                        </label>
                                        <div className="col-lg-9 col-xl-6">
                                            <input
                                                type="text"
                                                name="occupationRole"
                                                value={inputValue?.occupationRole}
                                                onChange={(e) => handleOnChange(e)}
                                                className={`form-control form-control-lg form-control-solid`}
                                            />
                                            <span
                                                style={{
                                                    color: "red",
                                                    top: "5px",
                                                    fontSize: "12px",
                                                }}
                                            >
                                                {errors["occupationRole"]}
                                            </span>{" "}
                                        </div>
                                    </div>
                                </div>
                                {isEditApi ? (
                                    <div className="form ml-30 ">
                                        <div className="form-group row">
                                            <label className="col-xl-3 col-lg-3 col-form-label">
                                                Bild
                                            </label>
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
                                                <div>
                                                    {inputValue?.imageForUpdate && <img style={{ height: "128px", width: "128px" }} src={URL.createObjectURL(inputValue?.imageForUpdate)} />}
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
                                            <label className="col-xl-3 col-lg-3 col-form-label">
                                                Bild
                                            </label>
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

                                {isEditApi && !inputValue?.imageForUpdate ? (
                                    <div className="form ml-30 ">
                                        <div className="form-group row">
                                            <label className="col-xl-3 col-lg-3 col-form-label">
                                                Bild hochladen
                                            </label>
                                            <div className="col-lg-9 col-xl-6">
                                                <div>
                                                    <img style={{ height: "128px", width: "128px" }} src={inputValue?.image} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    ""
                                )}
                                <div className="d-flex align-items-center justify-content-center">
                                    {loadingBtn ? (
                                        <button className="btn btncolor mr-2">
                                            <span>
                                                {isEditApi ? "Speichern" : "Hinzufügen"}
                                            </span>
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
                                            <span>
                                                {isEditApi
                                                    ? "Speichern"
                                                    : "Hinzufügen"}
                                            </span>
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
                    Wollen Sie das wirklich{" "}
                    {displayModal === true ? "deaktivieren" : "aktivieren"}?
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
                <Modal.Body>
                    Möchten Sie diese Firmendetails entfernen ?
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
                                        {/* propertyName */}
                                        <div className="form-group row">
                                            <label className="col-xl-3 col-lg-3 col-form-label">
                                                Vollständiger Name :
                                            </label>
                                            <div className="col-lg-9 col-xl-6 pt-3">
                                                <div>
                                                    <span>{rowinfo?.name ?? "-"}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* propertyInterval */}
                                        <div className="form-group row">
                                            <label className="col-xl-3 col-lg-3 col-form-label">
                                                Email :
                                            </label>
                                            <div className="col-xl-3 col-lg-3 pt-3">
                                                <div>
                                                    <span>{rowinfo?.email ?? "-"}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* houseType */}
                                        <div className="form-group row">
                                            <label className="col-xl-3 col-lg-3 col-form-label">
                                                Telephone :
                                            </label>
                                            <div className="col-xl-3 col-lg-3 pt-3">
                                                <div>
                                                    <span>{rowinfo?.phone ?? "-"}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* telephone */}
                                        <div className="form-group row">
                                            <label className="col-xl-3 col-lg-3 col-form-label">
                                                Beschreibung :
                                            </label>
                                            <div className="col-xl-3 col-lg-3 pt-3">
                                                <div>
                                                    <span>{rowinfo?.description ?? "-"}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* city */}
                                        <div className="form-group row">
                                            <label className="col-xl-3 col-lg-3 col-form-label">
                                                Berufsrolle :
                                            </label>
                                            <div className="col-xl-3 col-lg-3 pt-3">
                                                <div>
                                                    <span>{rowinfo?.occupationRole ?? "-"}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Image */}
                                        <div className="form-group row">
                                            <label className="col-xl-3 col-lg-3 col-form-label">
                                                Bild:
                                            </label>
                                            <div className="col-xl-9 col-lg-9 pt-3">
                                                <div className="new-image-grid-align-for-modal">
                                                    <div className="new-image-grid-align-for-modal-items">
                                                        <img
                                                            src={rowinfo?.userImage[0]}
                                                        />
                                                    </div>
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

export default Companies;
