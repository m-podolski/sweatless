import React from "react";

export default function LogListButtons({
  log,
  editLog,
  deleteLog,
  restoreLog,
}) {
  if (log.deleted === true) {
    return (
      <div className="button-container">
        <button
          type="button"
          className="button-primary button-row button-restore"
          onClick={() => {
            restoreLog(log.data[0].value);
          }}
        >
          Restore
        </button>
      </div>
    );
  } else {
    return (
      <div className="button-container">
        <button
          type="button"
          className="button-tertiary button-row button-edit"
          onClick={() => {
            editLog(log.data[0].value);
          }}
        >
          Edit
        </button>
        <button
          type="button"
          className="button-secondary button-row button-delete"
          onClick={() => {
            deleteLog(log.data[0].value);
          }}
        >
          Delete
        </button>
      </div>
    );
  }
}
