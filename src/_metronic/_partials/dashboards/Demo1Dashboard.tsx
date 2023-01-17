import React, { 
  // useState
 } from "react";
import {
  MixedWidget1,
  // StatsWidget11,
  // StatsWidget12
} from "../widgets";
// import TextField from "@material-ui/core/TextField";
// import { Button } from "react-bootstrap";
// import { ApiPost } from "../../../helpers/API/ApiData";
export function Demo1Dashboard() {

  return (
    <>
      <div className="row" >
        <div className="col-lg-12 col-xxl-12 p-0">
          <MixedWidget1 className="card-stretch gutter-b" />
        </div>
      </div>
      {/* <div className="mt-5">
        <h1> Add new genre</h1>
      </div> */}

      <div className="row align-items-center">
        <div className="col-lg-4 col-xxl-4 mt-6">
          {/* <StatsWidget11
            className="card-stretch card-stretch-half gutter-b"
            symbolShape="circle"
            baseColor="success"
          /> */}

          <div className="mb-4"></div>
        </div>
        <div className="col-lg-4 col-xxl-4">
          {/* <StatsWidget12 className="card-stretch card-stretch-half gutter-b" /> */}
        </div>
        <div className="col-lg-4 col-xxl-4">
          {/* <StatsWidget12 className="card-stretch card-stretch-half gutter-b" /> */}
        </div>
      </div>
    </>
  );
}
