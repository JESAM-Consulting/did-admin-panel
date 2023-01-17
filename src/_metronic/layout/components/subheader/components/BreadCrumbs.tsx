/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Link } from "react-router-dom";

export default function BreadCrumbs({ items }:any) {
    if (!items || !items?.length) {
        return <></>;
    }

    return (
        <ul className="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold p-0 my-2">
            <li className="breadcrumb-item" style={{color:"#ffffff"}}>
                <Link to="/dashboard">
                    {/* <i className="flaticon2-shelter text-muted icon-1x" /> */}
                    <i className="flaticon2-shelter icon-1x"  style={{color:"#ffffff"}} />
                </Link>
            </li>
            {items.map((item:any, index:any) => (
                <li key={`bc${index}`} className="breadcrumb-item">
                    <Link
                        // className="text-muted"
                        style={{color:"#ffffff"}}
                        to={{ pathname: item.pathname }}
                    >
                        {item.title}
                    </Link>
                </li>
            ))}
        </ul>
    );
}
