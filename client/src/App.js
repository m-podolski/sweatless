import db from "./database";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Nav from "./components/Nav";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Changelog from "./pages/Changelog";
import Footer from "./components/Footer";

import { fieldsConfig, makeInputModelFromDB } from "./models";
import "./sass/App.scss";

function App() {
  // eslint-disable-next-line
  const [fields, setFields] = useState(fieldsConfig);

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    (async function readRecords() {
      const databaseLogs = await db.logs.toArray();
      setLogs(
        databaseLogs.map((log) => {
          return makeInputModelFromDB(fields, log);
        }),
      );
    })();
    // eslint-disable-next-line
  }, []);

  const initSettings = {
    key: "settings",
    logs: {
      label: "Logs",
      input: { label: "Input", show: true },
      list: { label: "List", show: true },
    },
    stats: {
      label: "Log Statistics",
      totals: { label: "Log Totals", show: true },
      proportions: { label: "Training Proportions", show: true },
      timeline: { label: "Log Timeline", show: true, scale: 60 },
      graph: { label: "Results Graph", show: true },
    },
  };
  const [settings, setSettings] = useState(initSettings);

  useEffect(() => {
    (async function readSettings() {
      const databaseSettings = await db.settings.toArray();
      if (databaseSettings.length > 0) {
        setSettings(databaseSettings[0]);
      }
    })();
  }, []);

  useEffect(() => {
    try {
      (async function fetchData() {
        const response = await fetch("http://localhost:3001/logs/all-logs");
        console.log(response);
        const json = await response.json();
        console.log(json);
      })();
    } catch (error) {
      throw new Error(error);
    }
  }, []);

  return (
    <React.Fragment>
      <Router>
        <Nav />
        <Switch>
          <Route path="/sweatless/about">
            <About />
          </Route>
          <Route path="/sweatless/settings">
            <Settings
              fields={fields}
              settings={settings}
              setSettings={setSettings}
            />
          </Route>
          <Route path="/sweatless/changelog">
            <Changelog />
          </Route>
          <Route path="/sweatless/">
            <Dashboard
              fields={fields}
              logs={logs}
              setLogs={setLogs}
              settings={settings}
            />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </React.Fragment>
  );
}

export default App;
