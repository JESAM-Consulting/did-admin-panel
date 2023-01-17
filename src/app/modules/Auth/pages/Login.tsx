import React, { useState } from "react"; //
import { useHistory } from "react-router-dom";
import { ApiPost } from "../../../../helpers/API/ApiData";
import * as authUtil from "../../../../utils/auth.util";
import * as userUtil from "../../../../utils/user.util";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../../_metronic/_assets/sass/layout/_basic.scss";


export default function Login() {
  // const [loading, setLoading] = useState(false);
  const history = useHistory<any>();
  const [loginData, setLoginData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState<any>(false);
  const [showPassword, setShowPasssword] = useState<any>(false)
  const [loader, setLoader] = useState<any>(false);
  const regexEmail =
    /^(([^<>()[\],;:\s@]+([^<>()[\],;:\s@]+)*)|(.+))@(([^<>()[\],;:\s@]+)+[^<>()[\],;:\s@]{2,})$/i;

  const handleChange = (e: any) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: any) => {
    setLoading(true)
    e.preventDefault();

    if (!loginData.email && !loginData.password) {
      setLoading(false)
      setErrors({
        email: "E-Mail ist erforderlich*",
        password: "Passwort wird benötigt*",
      });
    } else if (loginData.email === "" && loginData.password === "") {
      setErrors({ ...errors, email: "E-Mail ist erforderlich*" });
      setLoading(false)

    } else if (!loginData.email || loginData.email === "") {
      setErrors({ ...errors, email: "E-Mail ist erforderlich*" });
      setLoading(false)

    } else if (!loginData.email || regexEmail.test(loginData.email) === false) {
      setErrors({ ...errors, email: "Email ist ungültig*" });
      setLoading(false)

    } else if (!loginData.password || loginData.password === "") {
      setErrors({ ...errors, password: "Passwort wird benötigt*" });
      setLoading(false)


    } else {
      loginData.email = loginData.email.toLowerCase();

      await ApiPost("admin/login", loginData)

        .then((res: any) => {
          console.log("testlogin", res)
          setLoading(false)
          if (res.data.error === "Email existiert nicht") {
            setErrors({ user: "Benutzer existiert nicht !!" });
          } else if (res.data.error === "Falsches Passwort") {
            setErrors({
              user: "Login -Anmeldeinformationen sind falsch !!",
            });
          } else {
            // toast.success("Anmeldung erfolgreich");
            authUtil.setToken(res?.data?.payload?.accessToken);
            userUtil.setUserInfo(res?.data?.payload);
            // setTimeout(function () {
            // }, 60 );
            toast.success("Anmeldung erfolgreich", {
              autoClose: 5000
            })
            window.location.reload();

          }
        })
        .catch((err) => {
          console.log("err--------->", err.response);
          toast.error("Benutzer existiert nicht");
          setLoading(false)
        });
    }
    // setLoader(false);
  };

  const handleForgotPass = (e: any) => {
    console.log("forgot");
    history.push("/auth/forgot-password");
  }
  const showHidePassword = (e: any) => {
    setShowPasssword(!showPassword)
  }

  return (
    <div className="login-form login-signin" id="kt_login_signin_form">
      <div className="text-center mb-10 mb-lg-20">
        <h3 className="font-size-h1 text-white">Anmelden</h3>
        <p className="font-weight-bold px-16 text-white font-type-Montserrat">
          Geben Sie Ihre Anmeldeinformationen ein.
        </p>
        <span className="text-danger h6">{errors.user}</span>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
      />

      <div className="form-group fv-plugins-icon-container">
        <input
          placeholder="E-Mail"
          type="email"
          className={`form-control form-control-solid h-auto py-5 px-6  `}
          name="email"
          onKeyDown={(e) => e.key == "Enter" && handleSubmit(e)}
          onChange={(e) => {
            handleChange(e);
          }}
        />
        <span className="text-danger">{errors.email}</span>
      </div>
      <div className="form-group fv-plugins-icon-container   " style={{position:"relative"}}  >
        <input
          placeholder="Passwort"
          type={showPassword ? "text" : "password"}
          className={`form-control form-control-solid h-auto py-5 px-6 `}
          onKeyDown={(e) => e.key == "Enter" && handleSubmit(e)}
          name="password"
          onChange={(e) => {
            handleChange(e);
          }}
        />
       
          <div style={{ top: "20px", right: "15px",  position: "absolute" }}>
            {
              showPassword ?
                <i className="fa fa-eye" onClick={(e: any) => showHidePassword(e)} ></i>
                :
                <i className="fa fa-eye-slash" onClick={(e: any) => showHidePassword(e)}></i>
            }
        
        
        </div>

        <span className="text-danger">{errors.password}</span>
      </div>

      {/* <div onClick={(e) => handleForgotPass(e)} style={{ textAlign: "right" }}>Passwort vergessen?</div> */}

      <div className="form-group d-flex flex-wrap justify-content-center align-items-center">
        <button
          id="kt_login_signin_submit"
          type="submit"
          className={`align-items-center d-flex btn btncolor font-weight-bold px-9 py-4 my-3`}
          onClick={(e) => {
            handleSubmit(e);
          }}
        // style={{background:"#1BC5BD"}}
        >
          <span className="pr-2">Einloggen</span>

          {loading && (
            <span className="mx-3 spinner spinner-white"></span>
          )}
          {/* {loader && (
            <div class="spinner-grow text-light" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          )} */}
        </button>
      </div>
      {/* <div className="d-flex justify-content-center">
          <span className="font-weight-bold text-dark-50">
            Don't have an account yet?
          </span>
          <Link
            to="/auth/registration"
            className="font-weight-bold ml-2"
            id="kt_login_signup"
          >
            Sign Up!
          </Link>
        </div> */}
      {/* <div className="d-flex justify-content-center">
          <span className="font-weight-bold text-dark-50">
            Read our <Link>Onboarding Policy</Link> here.
          </span>
        </div> */}
      {/* </form> */}

      {/*end::Form*/}
    </div>
  );
}
