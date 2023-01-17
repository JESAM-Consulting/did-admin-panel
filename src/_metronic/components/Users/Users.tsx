import React, { useEffect, useState } from "react";
import DataTable, { defaultThemes } from "react-data-table-component";
import { toast, ToastContainer } from "react-toastify";
import CreateIcon from "@material-ui/icons/Create";
import { Toolbar } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import { List } from "@material-ui/core";
import { Tooltip } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Dialog } from "@material-ui/core";
import { ApiGet, ApiPost, ApiPut } from "../../../helpers/API/ApiData";
import { Button } from "react-bootstrap";

import { getUserInfo } from "../../../utils/user.util";

const Users = () => {
  // pagination
  const [page, setPage] = useState<any>(1);
  const [count, setCount] = useState<any>(0);
  const [countPerPage, setCountPerPage] = useState<any>(10);
  const [loader, setLoader] = useState<any>(false);
  const [errors, setErrors] = useState<any>({});
  const [inputValue, setInputValue] = useState<any>({});
  const [isUser, setIsUser] = useState<any>(false);
  const [isRealstate, setIsRealstate] = useState<any>(false);
  const [isRealStateData, setIsRealStateData] = useState<any>(false);
  const [userData, setUserData] = useState<any>();
  const [idForEditRealEstate, setIdForEditRealEstate] = useState<any>();
  const [riddata, SetRidData] = useState<any>([]);
  const [loading, setLoading] = useState<any>(false);
  const [loadingBtn, setLoadingBtn] = useState<any>(false);
  const [loadingData, setLoadingData] = useState<any>(false);

  const [isEditApi, setIsEditApi] = useState<any>(false);
  // const [userdata, SetUserData] = useState<any>();
  const [mypid, SetMyPid] = useState<any>();
  const [search, setSearch] = useState<any>("");

  const userInfo = getUserInfo();

  console.log("userInfo123", userInfo);
  useEffect(() => {
    // setPage(1);
    // setCount(0);
    // setCountPerPage(countPerPage);
    getAllUsers();
    // SetUserData(userInfo);
  }, [page, countPerPage]);

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

  const handleOnChange = (e: any) => {
    const { name, value } = e.target;
    console.log("namemeeeee", name, value);
    setInputValue({ ...inputValue, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };
  console.log("userrole", inputValue);

  const handleAddIngredientsClose = () => {
    isUser(false);
    // setIsEditApi(false);
    setErrors({});
    setInputValue({});
  };

  const getAllUsers = async () => {
    setLoadingData(true);
    if (userInfo.role === "superadmin") {
      if (!search) {
        await ApiGet(
          `admin/get-users?aid=${userInfo.id}&page=${page}&limit=${countPerPage}`
        )
          .then((res: any) => {
            console.log("getuser", res);
            setUserData(res?.data?.payload?.user);
            setCount(res?.data?.payload?.count);
            setLoadingData(false);
          })
          .catch((err) => {
            console.log("error");
            setLoadingData(false);
          });
      } else {
        await ApiGet(
          `admin/get-users?aid=${userInfo.id}&page=${page}&search=${search}&limit=${countPerPage}`
        )
          .then((res: any) => {
            console.log("getuser", res);
            setUserData(res?.data?.payload?.user);
            setLoadingData(false);
            setCount(res?.data?.payload?.count);
          })
          .catch((err) => {
            console.log("error");
            setLoadingData(false);
          });
      }
    } else {
      if (!search) {
        await ApiGet(
          `admin/get-users?aid=${userInfo.id}&page=${page}&limit=${countPerPage}`
        )
          .then((res: any) => {
            console.log("getuser", res);
            setUserData(res?.data?.payload?.user);
            setLoadingData(false);
            setCount(res?.data?.payload?.count);
          })
          .catch((err) => {
            setLoadingData(false);
          });
      } else {
        await ApiGet(
          `admin/get-users?aid=${userInfo.id}&search=${search}&page=${page}&limit=${countPerPage}`
        )
          .then((res: any) => {
            console.log("getuser", res);
            setUserData(res?.data?.payload?.user);
            setLoadingData(false);
            setCount(res?.data?.payload?.count);
          })
          .catch((err) => {
            setLoadingData(false);
          });
      }
    }
  };

  useEffect(() => {
    getAllPid();
  }, []);

  const getAllPid = async () => {
    await ApiGet(`property/getPropertyById/${userInfo.id}`)
      .then((res: any) => {
        console.log("getapi?", res?.data?.payload?.property);
        SetRidData(res?.data?.payload?.property);
      })
      .catch((error) => {
        console.log("Somthing is Wrong in Get Property......");
      });
  };

  const getAllRealEstate = async () => {
    console.log("userInfo.id", userInfo.id);
    await ApiGet(
      `admin/get-users/${userInfo.id}?page=${page}&limit=${countPerPage}`
    ).then((res: any) => {
      console.log("resget", res);
      setIsRealStateData(res?.data?.payload?.notification);
    });
  };

  const validateforUserData = () => {
    let isFormValid: any = true;
    let errors: any = {};
    setLoader(false);
    if (inputValue && !inputValue?.name) {
      isFormValid = false;
      errors["name"] = "Bitte geben Sie Ihren Namen ein!";
    }
    if (inputValue && !inputValue?.email) {
      isFormValid = false;
      errors["email"] = "Bitte geben Sie Ihren Benutzernamen ein";
    }
    if (inputValue && (!inputValue?.phone || inputValue?.phone?.length != 10)) {
      isFormValid = false;
      errors["phone"] = "Bitte gib deine Telefonnummer ein!";
    }

    if (!isEditApi) {
      if (inputValue && !inputValue?.password) {
        isFormValid = false;
        errors["password"] = "Bitte geben Sie Ihr Passwort ein!";
      }
    }

    if (inputValue && !inputValue?.pid) {
      isFormValid = false;
      errors["pid"] = "Bitte wählen Sie Ihre Immobilie aus!";
    }

    setErrors(errors);
    return isFormValid;
  };
  console.log("inputValue", inputValue);

  const addRealEstate = async () => {
    if (validateforUserData()) {
      setLoadingBtn(true)
      let data: any = {
        userName: inputValue?.email,
        password: inputValue?.password,
        name: inputValue?.name,
        phone: inputValue?.phone,
        role: "user",
        pid: inputValue?.pid,
        aid: userInfo.id,
      };
      console.log("dataobject", data);
      await ApiPost(`admin/signup`, data)
        .then((res: any) => {
          console.log("logsignup", res);
          getAllUsers();
          setIsUser(false);
          // toast.success(res?.data?.message)
          toast.success("Benutzer erfolgreich erstellt");
          setLoadingBtn(false)

          setInputValue({});
        })
        .catch((err) => {
          console.log(err?.response);
          setLoadingBtn(false)
          toast.error("Etwas ist schief gelaufen.Bitte versuche es erneut");
        });
    }
  };

  const editRealEstate = async (e: any) => {
    if (validateforUserData()) {
      setLoadingBtn(true)
      console.log("clikeddddddddd")

      e.preventDefault();
      let data = {
        userName: inputValue.email,
        // password: inputValue?.password,
        name: inputValue?.name,
        phone: inputValue?.phone,
        pid: inputValue?.pid,
        // role: "user",
        // aid: userInfo.id
      };

      await ApiPut(`admin/updateAdmin/${idForEditRealEstate}`, data)
        .then((res: any) => {
          if (res?.status === 200) {
            toast.success("Benutzer erfolgreich aktualisiert");
            console.log("editres", res);
            getAllRealEstate();
            setIsRealstate(false);
            setInputValue({});
            setIsUser(false);
            setIsEditApi(false);
            setLoadingBtn(false)
            getAllUsers();
          } else {
            // toast.error(res?.data?.message)
            setLoadingBtn(false)
            toast.error("Etwas ist schief gelaufen.Bitte versuche es erneut");
          }
        })
        .catch((err) => {
          // toast.error(err?.response?.data?.message);
          setLoadingBtn(false)
          toast.error("Etwas ist schief gelaufen.Bitte versuche es erneut");
        });
    }
  };

  const handleAddClose = () => {
    setIsUser(false);
    setIsEditApi(false);
    setErrors({});
    setInputValue({});
  };

  const onHandleAddUser = (e: any) => {
    setIsUser(true);
    // getAllPid(e)
  };
  const handleSearch = (e: any) => {
    let val = e.target.value.replace(/[^\w\s]/gi, "");
    setSearch(val);
  };
  const debouncedSearchTerm = useDebounce(search, 500);

  function useDebounce(value: any, delay: any) {
    // State and setters for debounced value
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(
      () => {
        // Update debounced value after delay
        const handler = setTimeout(() => {
          setDebouncedValue(value);
        }, delay);
        // Cancel the timeout if value changes (also on delay change or unmount)
        // This is how we prevent debounced value from updating if value is changed ...
        // .. within the delay period. Timeout gets cleared and restarted.
        return () => {
          clearTimeout(handler);
        };
      },
      [value, delay] // Only re-call effect if value or delay changes
    );
    return debouncedValue;
  }
  useEffect(() => {
    if (debouncedSearchTerm) {
      setPage(1);
      setCount(0);
      setCountPerPage(countPerPage);
      getAllUsers();
    } else {
      setPage(1);
      setCount(0);
      setCountPerPage(countPerPage);
      getAllUsers();
    }
  }, [debouncedSearchTerm]);

  // approved or not
  const Switch = async (e: any, data: any) => {
    console.log("data", data);
    const datatrue = {
      isApproved: 1,
      aid: data._id,
    };
    const datafalse = {
      isApproved: 0,
      aid: data._id,
    };

    await ApiPut(`admin/approve`, data.isApproved === 1 ? datafalse : datatrue)
      .then((res: any) => {
        if (res?.status === 200) {
          toast.success("Benutzer erfolgreich aktualisiert");
          console.log("trueresss", res);
          getAllUsers();
        } else {
          toast.error("Etwas ist schief gelaufen.Bitte versuche es erneut");
        }
      })
      .catch((err) => {
        toast.error("Etwas ist schief gelaufen.Bitte versuche es erneut");
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

  const columns = [
    {
      name: "Seriennummer",
      // cell: (row: any, index: any) => index + 1,
      cell: (row: any, index: any) => (page - 1) * countPerPage + (index + 1),
      width: "5%"
    },
    {
      name: "Objekte",
      selector: (row: any) => row?.pid?.title,
      sortable: true,
    },

    {
      name: "name",
      selector: (row: any) => row?.name,
      sortable: true,
    },
    {
      name: "userName",
      selector: (row: any) => row?.userName,
      sortable: true,
    },

    {
      name: "Admin",
      selector: (row: any) => row?.aid?.name,
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
            <div className="d-flex justify-content-between">
              <div
                className="cursor-pointer pl-2"
                onClick={() => {
                  setIsUser(true);
                  console.log("rowsresss", row);
                  setIsEditApi(true);
                  setIdForEditRealEstate(row?._id);

                  setInputValue({
                    name: row?.name,
                    phone: row?.phone,
                    email: row?.userName,
                    pid: row?.pid?._id,
                    password: row?.password,
                  });
                }}
              >
                <Tooltip title="Edit Content" arrow>
                  <CreateIcon />
                </Tooltip>
              </div>

              <div className="ml-2">
                {/* <Button className="btn btn-success"

                  onClick={(e: any) =>
                    Switch(e, row)}
                >

                </Button> */}
                {row.isApproved === 1 ? (
                  <Button
                    className="btn"
                    style={{ backgroundColor: "#144337", border: "#144337" }}
                    onClick={(e: any) => Switch(e, row)}
                  >
                    Aktiv
                  </Button>
                ) : (
                  <Button
                    className="btn"
                    style={{ backgroundColor: "brown", border: "brown" }}
                    onClick={(e: any) => Switch(e, row)}
                  >
                    Deaktiv
                  </Button>
                )}
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
              <h2 className="pl-3 pt-2">Benutzer</h2>
            </div>
            <div className="col">
              <div>
                <input
                  type="text"
                  className={`form-control form-control-lg form-control-solid `}
                  name="search"
                  value={search}
                  onChange={(e) => handleSearch(e)}
                  placeholder="Suchbenutzer"
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
              {/* <span className="sr-only">Loading...</span> */}
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={userData}
              customStyles={customStyles}

              // pagination
              highlightOnHover
              pagination
              paginationServer
              paginationTotalRows={count}
              paginationPerPage={countPerPage}
              paginationRowsPerPageOptions={[10, 20, 25, 50, 100]}
              paginationDefaultPage={page}
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
        <Dialog
          fullScreen
          open={isUser}
          onClose={handleAddClose}
        // TransitionComponent={Transition}
        >
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
                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Name eingeben
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="text"
                        className={`form-control form-control-lg form-control-solid `}
                        id="name"
                        name="name"
                        value={inputValue.name}
                        onChange={(e) => {
                          handleOnChange(e);
                        }}
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
                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Email eingeben
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="text"
                        className={`form-control form-control-lg form-control-solid `}
                        id="email"
                        name="email"
                        value={inputValue.email}
                        onChange={(e) => {
                          handleOnChange(e);
                        }}
                      />
                    </div>
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
                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Telefonnummer eingeben
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="text"
                        className={`form-control form-control-lg form-control-solid `}
                        id="phone"
                        name="phone"
                        value={inputValue.phone}
                        onChange={(e) => handleOnChange(e)}
                        pattern="[789][0-9]{9}"
                        onKeyPress={bindInput}
                        maxLength={10}
                      />
                    </div>
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

                {isEditApi ? "" :
                  <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">
                      Passwort eingeben
                    </label>
                    <div className="col-lg-9 col-xl-6">
                      <div>
                        <input
                          type="password"
                          className={`form-control form-control-lg form-control-solid `}
                          id="password"
                          name="password"
                          value={inputValue.password}
                          onChange={(e) => {
                            handleOnChange(e);
                          }}
                        />
                      </div>
                      <span
                        style={{
                          color: "red",
                          top: "5px",
                          fontSize: "12px",
                        }}
                      >
                        {errors["password"]}
                      </span>
                    </div>
                  </div>
                }
                {/* <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Enter Confirm Password
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="number"
                        className={`form-control form-control-lg form-control-solid `}
                        id="cpassword"
                        name="cpassword"
                        value={inputValue.cpassword}
                        onChange={(e) => {
                          handleOnChange(e);
                        }}
                      />
                    </div>
                    <span
                      style={{
                        color: "red",
                        top: "5px",
                        fontSize: "12px",
                      }} 
                    >
                      {errors["cpassword"]}
                    </span>
                  </div>
                </div> */}

                {/* {isEditApi === false ? */}
                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Wählen Sie Eigenschaft
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <select
                        name="pid"
                        id="pid"
                        defaultValue={inputValue?.pid}
                        className="form-control"
                        aria-label="Default select example"
                        onChange={(e) => {
                          handleOnChange(e);
                        }}
                      >
                        <option disabled selected>Wählen Sie Eigenschaft aus</option>

                        {riddata &&
                          riddata.map((data: any) => (
                            <option value={data._id}>{data.title}</option>
                          ))}
                      </select>

                      <span
                        style={{
                          color: "red",
                          top: "5px",
                          fontSize: "12px",
                        }}
                      >
                        {errors["pid"]}
                      </span>
                    </div>
                  </div>
                </div>
                {/* : ""} */}

                {/* <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Enter Role
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                       <select name="role" id="role"  onClick={(e) => {handleOnChange(e)}} className="form-control" aria-label="Default select example">                       
                       
                       {userrole.role =="superadmin" ? 
                       <>
                          <option value="admin">admin</option>
                          </>
                       : 
                       <option value="user">user</option>  
                       } 
                          
                       
                      </select>
                    </div>
                    <span
                      style={{
                        color: "red",
                        top: "5px",
                        fontSize: "12px",
                      }}
                    >
                      {errors["role"]}
                    </span>
                  </div>
                </div> */}

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
    </>
  );
};

export default Users;
