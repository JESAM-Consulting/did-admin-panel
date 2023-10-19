/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import { checkIsActive } from "../../../../_helpers";
import { getUserInfo } from "../../../../../utils/user.util";

export function AsideMenuList({ layoutProps }: any) {
  const location = useLocation();
  let userInfo = getUserInfo();
  const getMenuItemActive = (url: any, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${
          !hasSubmenu && "menu-item-active"
        } menu-item-open menu-item-not-hightlighted`
      : "";
  };

  return (
    <>
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        <>
          {userInfo?.role?.roleName === "admin" && (
            <>
              <li
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/property-management",
                  false
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink className="menu-link" to="/property-management">
                  <span className="svg-icon menu-icon">
                    <i
                      className="fa-solid fa-user"
                      style={{ fontSize: "13px", color: "#383839" }}
                    ></i>
                  </span>
                  <span className="menu-text">Immobilienverwaltung</span>
                </NavLink>
              </li>

              <li
                className={`menu-item ${getMenuItemActive(
                  "/contact-us",
                  false
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/contact-us">
                  <span className="svg-icon menu-icon">
                    <i
                      className="fa fa-phone"
                      style={{
                        fontSize: "13px",
                        color: "#383839",
                        rotate: "-270deg",
                      }}
                    ></i>
                  </span>
                  <span className="menu-text">Kontaktanfrage</span>
                </NavLink>
              </li>

              {userInfo?.role?.roleName === "admin" && (
                <li
                  className={`menu-item ${getMenuItemActive(
                    "/companies",
                    false
                  )}`}
                  aria-haspopup="true"
                >
                  <NavLink className="menu-link" to="/companies">
                    <span className="svg-icon menu-icon">
                      <i
                        className="fa-sharp fa-solid fa-building"
                        style={{ fontSize: "13px", color: "#383839" }}
                      ></i>
                    </span>
                    <span className="menu-text">Mitarbeiter</span>
                  </NavLink>
                </li>
              )}
              <li
                className={`menu-item ${getMenuItemActive(
                  "/subscribe",
                  false
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/subscribe">
                  <span className="svg-icon menu-icon">
                    <i
                      className="fa-solid fa-crown"
                      style={{ fontSize: "13px", color: "#383839" }}
                    ></i>
                  </span>
                  <span className="menu-text">Newsletter</span>
                </NavLink>
              </li>
              <li
                className={`menu-item ${getMenuItemActive("/content", false)}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/content">
                  <span className="svg-icon menu-icon">
                    <i
                      className="fa-solid fa-crown"
                      style={{ fontSize: "13px", color: "#383839" }}
                    ></i>
                  </span>
                  <span className="menu-text">Inhalt</span>
                </NavLink>
              </li>
            </>
          )}

          <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "",
              true
            )}`}
            aria-haspopup="true"
            data-menu-toggle="hover"
          >
            <NavLink className="menu-link menu-toggle" to="">
              <span className="svg-icon menu-icon">
                <i
                  className="fa-solid fa-user"
                  style={{ fontSize: "13px", color: "#383839" }}
                ></i>
              </span>
              <span className="menu-text">Support-Anfragen</span>
              <i className="menu-arrow" />
            </NavLink>
            <div className="menu-submenu ">
              <i className="menu-arrow" />
              <ul className="menu-subnav">
                {/* <li
                    className={`menu-item menu-item-submenu ${getMenuItemActive(
                      "/manage-property",
                      false
                    )}`}
                    aria-haspopup="true"
                    data-menu-toggle="hover"
                  >
                    <NavLink className="menu-link" to="/manage-property">
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Manage Property</span>
                    </NavLink>
                  </li> */}

                {userInfo?.role?.roleName == "admin" ||
                userInfo?.role?.roleName == "user" ? (
                  <>
                    {/* <li
                      className={`menu-item ${getMenuItemActive(
                        "/manage-property",
                        false
                      )}`}
                      aria-haspopup="true"
                    >
                      <NavLink className="menu-link" to="/manage-property">
                        <span className="svg-icon menu-icon">
                          <i
                            className="fa fa-home"
                            style={{ fontSize: "13px", color: "#383839" }}
                          ></i>
                        </span>
                        <span className="menu-text">Property Management</span>
                      </NavLink>
                    </li> */}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/apraisal",
                        false
                      )}`}
                      aria-haspopup="true"
                    >
                      <NavLink className="menu-link" to="/apraisal">
                        <span className="svg-icon menu-icon">
                          <i
                            className="fa fa-bookmark"
                            style={{ fontSize: "13px", color: "#383839" }}
                          ></i>
                        </span>
                        <span className="menu-text">Immobilienbewertung</span>
                      </NavLink>
                    </li>
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/search-query",
                        false
                      )}`}
                      aria-haspopup="true"
                    >
                      <NavLink className="menu-link" to="/search-query">
                        <span className="svg-icon menu-icon">
                          <i
                            className="fa fa-search"
                            style={{ fontSize: "13px", color: "#383839" }}
                          ></i>
                        </span>
                        <span className="menu-text">Suchanfrage</span>
                      </NavLink>
                    </li>
                    {/* <li
                      className={`menu-item ${getMenuItemActive(
                        "/license-partner",
                        false
                      )}`}
                      aria-haspopup="true"
                    >
                      <NavLink className="menu-link" to="/license-partner">
                        <span className="svg-icon menu-icon">
                          <i
                            className="fa fa-id-card"
                            style={{ fontSize: "13px", color: "#383839" }}
                          ></i>
                        </span>
                        <span className="menu-text">Lizenzpartner</span>
                      </NavLink>
                    </li> */}
                  </>
                ) : (
                  ""
                )}
              </ul>
            </div>
          </li>
        </>
      </ul>
    </>
  );
}
