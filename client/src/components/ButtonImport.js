import React, { useRef } from "react";

function ButtonImport({ importStatus, handleImport, label, className }) {
  const fileInputRef = useRef(null);

  function redirectClick() {
    fileInputRef.current.click();
  }

  switch (importStatus) {
    case "loading":
      return <div className={className + " button-loading"}>Loading...</div>;
    case "ready":
      return <div className={className + " button-loading"}>Done!</div>;
    default:
      return (
        <React.Fragment>
          <input
            ref={fileInputRef}
            onChange={handleImport}
            type="file"
            className="fileInput"
            accept="application/json"
            style={{ display: "none" }}
          ></input>
          <button type="button" className={className} onClick={redirectClick}>
            Import {label}
          </button>
        </React.Fragment>
      );
  }
}

export default ButtonImport;
