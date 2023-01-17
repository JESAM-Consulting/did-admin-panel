import React, { useState } from "react"; //
import { useHistory } from "react-router-dom";
import { ApiPost } from "../../../../helpers/API/ApiData";
import * as authUtil from "../../../../utils/auth.util";
import * as userUtil from "../../../../utils/user.util";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../../_metronic/_assets/sass/layout/_basic.scss";

export default function Login() {

  const [errors, setErrors] = useState<any>({});
  const history = useHistory<any>();
  const [forgotModal, setForgotModal] = useState<any>(true)
  const [verifyModal, setVerifyModal] = useState<any>(false)
  const [afterForgotPassword, setAfterForgotPassword] = useState<any>(false)
  const [inputvalue, setInputvalue] = useState<any>()

  const handleChange = (e:any) => {
    setInputvalue({ ...inputvalue, [e.target.name]: e.target.value });
  };
 console.log("inputvalue",inputvalue);
  const handleSubmit = async (e:any) => {
    await ApiPost("admin/send-email", inputvalue)
        .then((res:any)=>{
          if (res?.status === 200) {
            console.log("resss",res);
            setForgotModal(false)
            setVerifyModal(true)
          }
        })
  }

  const handleVerify = async (e:any) => {
    const data:any = {
      email : inputvalue.email,
      code : inputvalue.otp,
    }
    await ApiPost("admin/verify-code", data)
        .then((res:any)=>{
          if (res?.status === 200) {
            console.log("resss",res);
            setVerifyModal(false)
            setAfterForgotPassword(true)
          }
        })
  }

  const handleForgotPass = (e: any) => {
    console.log("forgot");
    history.push("/auth/login");
  }

  const handleAfterForgotPass = async (e:any) => {
    const data:any = {
      email : inputvalue.email,
      password : inputvalue.password,
    }
    await ApiPost("admin/after-forget", data)
        .then((res:any)=>{
          if (res?.status === 200) {
            console.log("resss",res);
            history.push("/")
          }
        })
  }
  return (
    <>
      {/* Forgot Password */}
      {forgotModal && 
      <div className="login-form login-signin" id="kt_login_signin_form">
        <div className="text-center mb-10 mb-lg-20">
          <h3 className="font-size-h1">Passwort vergessen ?</h3>
          <p className="text-muted font-weight-bold">
           Geben Sie bitte Ihre Email-Adresse ein.Wir senden Ihnen eine E -Mail an Reset
            Ihr Passwort.
          </p>
          {/* <span className="text-danger h6">{errors.user}</span> */}
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
            className={`form-control form-control-solid h-auto py-5 px-6  `}
            placeholder="email"
            type="email"
            name="email"
            value={inputvalue?.email}
            onChange={(e) => {
              handleChange(e);
            }}
          />
        </div>

        <div className="form-group d-flex flex-wrap justify-content-center align-items-center">
          <button
            id="kt_login_signin_submit"
            type="submit"
            className={`btn btncolor align-items-center d-flex  font-weight-bold px-9 py-4 my-3`}
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            <span className="pr-2">Einreichen</span>
            {/* {loader && (
              <div class="spinner-grow text-light" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            )} */}
          </button>


        </div>
        <div onClick={(e) => handleForgotPass(e)} style={{ textAlign: "center" }}>Sie haben ein Konto?Anmelden</div>

      </div>
       }

      {/* Verify code */}
      { verifyModal &&
        <div className="login-form login-signin" id="kt_login_signin_form">
          <div className="text-center mb-10 mb-lg-20">
            <h3 className="font-size-h1">Passwort bestätigen ?</h3>
            <p className="text-muted font-weight-bold">
              Geben Sie bitte Ihre Email-Adresse ein.Wir senden Ihnen eine E -Mail an Reset
              Ihr Passwort.
            </p>
            {/* <span className="text-danger h6">{errors.user}</span> */}
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
              className={`form-control form-control-solid h-auto py-5 px-6  `}
              placeholder="Email"
              type="email"
              name="email"
              value={inputvalue?.email}
              // onChange={(e) => {
              //   handleChange(e);
              // }}
            />
          </div>
          <div className="form-group fv-plugins-icon-container">
            <input
              className={`form-control form-control-solid h-auto py-5 px-6  `}
              placeholder="otp"
              type="number"
              name="otp"
              value={inputvalue?.otp}
              onChange={(e) => {
                handleChange(e);
              }}
              min={0}
              max={6}
            />
          </div>


          <div className="form-group d-flex flex-wrap justify-content-center align-items-center">
            <button
              id="kt_login_signin_submit"
              type="submit"
              className={`align-items-center d-flex btn btn-primary font-weight-bold px-9 py-4 my-3`}
              onClick={(e) => {
                handleVerify(e);
              }}
            >
              <span className="pr-2">Einreichen</span>
              {/* {loader && (
                <div class="spinner-grow text-light" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              )} */}
            </button>
          </div>
        </div> 
      }

      {/* After forgot password */}
      { afterForgotPassword &&
        <div className="login-form login-signin" id="kt_login_signin_form">
          <div className="text-center mb-10 mb-lg-20">
            <h3 className="font-size-h1">Nach dem Passwort vergessen!</h3>
            <p className="text-muted font-weight-bold">
             Geben Sie bitte Ihre Email-Adresse ein.Wir senden Ihnen eine E -Mail an Reset
              Ihr Passwort.
            </p>
            {/* <span className="text-danger h6">{errors.user}</span> */}
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
              className={`form-control form-control-solid h-auto py-5 px-6  `}
              placeholder="Email"
              type="email"
              name="email"
              value={inputvalue?.email}
              // onChange={(e) => {
              //   handleChange(e);
              // }}
            />
          </div>
          <div className="form-group fv-plugins-icon-container">
            <input
              className={`form-control form-control-solid h-auto py-5 px-6  `}
              placeholder="password"
              type="text"
              name="password"
              value={inputvalue?.password}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>
          <div className="form-group d-flex flex-wrap justify-content-center align-items-center">
            <button
              id="kt_login_signin_submit"
              type="submit"
              className={`align-items-center d-flex btn btn-primary font-weight-bold px-9 py-4 my-3`}
              onClick={(e) => {
                handleAfterForgotPass(e);
              }}
            >
              <span className="pr-2">Einreichen</span>
              {/* {loader && (
                <div class="spinner-grow text-light" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              )} */}
            </button>
          </div>
        </div> 
      }
    </>
  );
}
