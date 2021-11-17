import React from "react";

function LogListButtons({ log, editLog, deleteLog, restoreLog }) {
  if (log.deleted === true) {
    return (
      <div className="button-container">
        <button
          type="button"
          className="button-primary button-row button-restore"
          onClick={() => {
            restoreLog(log.key);
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
            editLog(log.key);
          }}
        >
          Edit
        </button>
        <button
          type="button"
          className="button-secondary button-row button-delete"
          onClick={() => {
            deleteLog(log.key);
          }}
        >
          Delete
        </button>
      </div>
    );
  }
}

export default LogListButtons;
