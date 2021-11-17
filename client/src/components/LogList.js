import db from "../database";
import React, { useEffect } from "react";
import LogListButtons from "./LogListButtons";
import "../sass/components/_LogList.scss";

function LogList({ logs, setLogs, editLog }) {
  function sortLogs(logs) {
    return logs.sort((a, b) => {
      let first = a.date.value.split("-").join("");
      let second = b.date.value.split("-").join("");
      return second - first;
    });
  }

  // Dynamic fields are sorted into the others here only to avoid having the actual data in arrays
  function sortProperties(log) {
    const order = ["date", "duration", "training", null, "notes"];
    return order.flatMap((orderProp) => {
      if (orderProp === null) {
        return Object.keys(log).filter((property) => {
          return order.includes(property) === false;
        });
      } else {
        return orderProp;
      }
    });
  }

  function deleteLog(logKey) {
    removeDeletedRecords();
    const clearedLogs = logs.filter(
      (log) => log.hasOwnProperty("deleted") === false,
    );
    const markedLogs = clearedLogs.map((log) =>
      log.key === logKey ? { ...log, deleted: true } : log,
    );
    setLogs(markedLogs);
  }

  function restoreLog(logKey) {
    const { deleted, ...restoredLog } = logs.find((log) => log.key === logKey);
    const restoredLogs = logs.map((log) =>
      log.key === logKey ? restoredLog : log,
    );
    setLogs(restoredLogs);
  }

  function removeDeletedRecords() {
    const logPrevDeleted = logs.find((log) => log.hasOwnProperty("deleted"));
    if (logPrevDeleted) {
      (async function deleteRecord(log) {
        await db.logs.delete(log.key.value);
      })(logPrevDeleted);
    }
  }

  useEffect(() => {
    window.addEventListener("beforeunload", removeDeletedRecords);
    return () =>
      window.removeEventListener("beforeunload", removeDeletedRecords);
  });

  if (logs.length > 0) {
    return (
      <section className="LogList">
        <h3 className="sr-only">Log List</h3>
        <ul>
          {sortLogs(logs).map((log) => (
            <li
              key={log.key.value}
              className={`row ${log.deleted ? "log-deleted" : ""}`}
            >
              <dl>
                {sortProperties(log).map((property, i) =>
                  property === "key" ? null : (
                    <React.Fragment key={i}>
                      <dt>{log[property].label}</dt>
                      <dd>{log[property].value}</dd>
                    </React.Fragment>
                  ),
                )}
              </dl>
              <LogListButtons
                log={log}
                editLog={editLog}
                deleteLog={deleteLog}
                restoreLog={restoreLog}
              />
            </li>
          ))}
        </ul>
      </section>
    );
  } else {
    return null;
  }
}

export default LogList;
