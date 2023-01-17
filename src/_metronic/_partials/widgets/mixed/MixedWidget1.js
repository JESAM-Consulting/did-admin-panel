import React, { useEffect, useState } from "react";
import Logo from "../../../layout/components/Logos/Recurso.svg";

export function MixedWidget1({ className }) {
  const [
    countDataAll,
    // , setCountDataAll
  ] = useState("");

  console.log("countDataAll", countDataAll);

  useEffect(() => {
    document.title = "DID | Admin";
  }, []);

  return (
    <div>
      <div>
        <div className="honda-logo-center-alignment-page">
          <img alt="" src={Logo} style={{ width: "15%" }} />
          <div></div>
        </div>
      </div>
    </div>
  );
}
