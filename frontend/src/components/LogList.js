import { Fragment, useEffect, useCallback } from "react";
import { useFetch } from "../hooks/useFetch";
import LogListButtons from "./LogListButtons";
import "../sass/components/_LogList.scss";

export default function LogList({ logs, setLogs, setLogStats, editLog }) {
  const [doFetch] = useFetch();

  function sortLogs(logs) {
    return logs.sort((a, b) => {
      let first = a.data[1].value.split("-").join("");
      let second = b.data[1].value.split("-").join("");
      return second - first;
    });
  }

  function restoreLog(logId) {
    const restoredLog = logs.find((log) => log.data[0].value === logId);
    restoredLog.deleted = false;
    const restoredLogs = logs.map((log) =>
      log.data[0].value === logId ? restoredLog : log,
    );
    setLogs(restoredLogs);
  }

  const removeDeletedLogs = useCallback(async () => {
    const logPrevDeleted = logs.find((log) => log.deleted === true);
    if (logPrevDeleted) {
      const { statistics } = await doFetch(
        "DELETE",
        `logs/${logPrevDeleted.data[0].value}`,
      );
      setLogStats(statistics);
    }
  }, [doFetch, logs, setLogStats]);

  function deleteLog(logId) {
    removeDeletedLogs();
    const clearedLogs = logs.filter((log) => log.deleted === false);
    const markedLogs = clearedLogs.map((log) =>
      log.data[0].value === logId ? { ...log, deleted: true } : log,
    );
    setLogs(markedLogs);
  }

  useEffect(() => {
    window.addEventListener("beforeunload", removeDeletedLogs);
    return () => window.removeEventListener("beforeunload", removeDeletedLogs);
  }, [removeDeletedLogs]);

  if (logs.length > 0) {
    return (
      <section className="LogList">
        <h3 className="sr-only">Log List</h3>
        <ul>
          {sortLogs(logs).map((log) => (
            <li
              key={log.data[0].value}
              className={`row ${log.deleted ? "log-deleted" : ""}`}
            >
              <dl>
                {log.data.map((field) =>
                  field.label === "id" ? null : (
                    <Fragment key={field.label}>
                      <dt>{field.label}</dt>
                      <dd>{field.value}</dd>
                    </Fragment>
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
