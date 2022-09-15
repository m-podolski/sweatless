import { Fragment, useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useFetch } from "./hooks/useFetch";
import Authentication from "./components/Authentication";
import Nav from "./components/Nav";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Changelog from "./pages/Changelog";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";
import Errors from "./components/Errors";
import { makeInputModelFromDB } from "./util/models";
import "./sass/App.scss";

import Test from "./ts-test";

export default function App() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(null);
  const [logs, setLogs] = useState([]);
  const [logStats, setLogStats] = useState({
    totals: [],
    proportions: [],
    timeline: [],
    graph: [],
  });

  const { auth } = useAuth();
  const [doFetch, fetchError] = useFetch({
    message: "Connection Error",
    errors: "User data could not be fetched",
  });

  useEffect(() => {
    (async () => {
      const response = await doFetch();
      if (response) {
        setSettings(response.user.settings);
        setLogs(
          response.user.logs.map((log) => {
            return makeInputModelFromDB(
              response.user.settings.logs.fields,
              log,
            );
          }),
        );
        setLogStats(response.user.statistics);
      }
    })();
    // eslint-disable-next-line
  }, [auth]);

  useEffect(() => {
    window.addEventListener("storage", (e) => {
      if (e.key === "sweatless-logout") {
        navigate("/signin");
      }
    });
  });

  return (
    <Fragment>
      <Test></Test>
      <Nav />
      <Errors error={fetchError} />
      <Routes>
        <Route
          path="/"
          element={
            <Authentication>
              <Dashboard
                settings={settings}
                logs={logs}
                setLogs={setLogs}
                logStats={logStats}
                setLogStats={setLogStats}
              />
            </Authentication>
          }
        />
        <Route
          path="/settings"
          element={
            <Authentication>
              <Settings
                settings={settings}
                setSettings={setSettings}
                logs={logs}
                setLogStats={setLogStats}
              />
            </Authentication>
          }
        />
        <Route path="/signin" element={<Signin />} />
        <Route path="/about" element={<About />} />
        <Route path="/changelog" element={<Changelog />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Fragment>
  );
}
