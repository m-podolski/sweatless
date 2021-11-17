import React from "react";
import Header from "../components/Header";
import Logs from "../components/Logs";
import LogStats from "../components/LogStats";

function Dashboard({ fields, logs, setLogs, settings }) {
  return (
    <React.Fragment>
      {logs.length > 0 ? null : <Header />}
      <main aria-live="polite" id="main" className="main">
        <h1 className="sr-only">Dashboard</h1>
        <LogStats fields={fields} logs={logs} settings={settings} />
        <Logs
          fields={fields}
          logs={logs}
          setLogs={setLogs}
          settings={settings}
        />
      </main>
    </React.Fragment>
  );
}

export default Dashboard;
