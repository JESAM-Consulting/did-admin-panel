/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { checkIsActive } from "../../../../_helpers";
// import { getUserInfo } from "../../../../utils/user.util";
import { getUserInfo } from "../../../../../utils/user.util";

console.log("weweweweewew",getUserInfo)
export function HeaderMenu({ layoutProps }:any) {
    let userInfo = getUserInfo();
    const location = useLocation();
    const getMenuItemActive = (url:any) => {
        return checkIsActive(location, url) ? "menu-item-active" : "";
    };

    return (
        <div
            id="kt_header_menu"
            className={`header-menu header-menu-mobile ${layoutProps.ktMenuClasses}`}
            {...layoutProps.headerMenuAttributes}
        >
            {/*begin::Header Nav*/}
            <ul className={`menu-nav ${layoutProps.ulClasses}`}>
                {/*begin::1 Level*/}
                <li
                    className={`menu-item menu-item-rel ${getMenuItemActive(
                        "/dashboard"
                    )}`}
                >
                    {/* <NavLink className="menu-link" to="/dashboard"> */}
                    <span className="menu-text">Block Creator | Admin  </span>
                    {layoutProps.rootArrowEnabled && (
                        <i className="menu-arrow" />
                    )}
                    {/* </NavLink> */}
                </li>
            </ul>
            {/*end::Header Nav*/}
        </div>
    );
}
