/* eslint-disable no-restricted-imports */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { DropdownTopbarItemToggler } from "../../../../_partials/dropdowns";
import Auth from "../../../../../helpers/Auth";
import { getUserInfo } from "../../../../../utils/user.util";
export function UserProfileDropdown() {
  let userInfo = getUserInfo();
  console.log();
  const Logout = async () => {
    await Auth.deauthenticateLocalUser();
    window.location.reload();
  };
  // const profilePage = (e) => {
  //   e.preventDefault();
  //   history.push("/userprofile");
  // };

  console.log("userinfoo", userInfo);

  return (
    <Dropdown drop="down" alignRight>
      <Dropdown.Toggle
        as={DropdownTopbarItemToggler}
        id="dropdown-toggle-user-profile"
      >
        <div
          className={
            "btn btn-icon w-auto btn-clean d-flex align-items-center btn-lg px-2 bg-light"
          }
          // style={{backgroundColor:"#58B37D" }}
        >
          {/* /text-muted */}
          <span
            className=" font-weight-bold font-size-base d-md-inline mr-1"
            style={{ color: "#0D9446" }}
          >
            Guten Tag, {userInfo?.userName},
          </span>{" "}
          {userInfo?.role?.roleName === "admin" ? (
            <>
              <span
                className="font-weight-bolder font-size-base d-md-inline mr-3"
                style={{ color: "#0D9446" }}
              >
                {userInfo?.name?.toUpperCase()}
              </span>
              <span className="symbol symbol-35 symbol-light-success">
                <span
                  className="symbol-label font-size-h5 font-weight-bold"
                  style={{ color: "white" }}
                >
                  {userInfo?.role?.roleName[0]?.toUpperCase()}
                </span>
              </span>
            </>
          ) : (
            <>
              <span
                className="font-weight-bolder font-size-base d-md-inline mr-3"
                style={{ color: "#0D9446" }}
              >
                {userInfo?.name?.toUpperCase()}
              </span>
              <span className="symbol symbol-35 symbol-light-success">
                <span
                  className="symbol-label font-size-h5 font-weight-bold"
                  style={{ color: "white" }}
                >
                  {userInfo?.userName[0]?.toUpperCase()}
                </span>
              </span>{" "}
            </>
          )}
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu className="p-0 m-0 dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-">
        <div className="navi navi-spacer-x-0 ">
          <div className="navi-footer px-8 py-3">
            <div
              onClick={Logout}
              className="btn font-weight-bold"
              style={{
                backgroundColor: "#144337",
                color: "#FFFFFF",
                whiteSpace: "nowrap",
              }}
            >
              Ausloggen
            </div>
          </div>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}
