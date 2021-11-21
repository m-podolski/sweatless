import Logs from "../components/Logs";
import LogStatsTotals from "../components/LogStatsTotals";
import LogStatsProportions from "../components/LogStatsProportions";
import LogStatsTimeline from "../components/LogStatsTimeline";
import LogStatsGraph from "../components/LogStatsGraph";
import "../sass/components/_LogStats.scss";

export default function Dashboard({
  settings,
  logs,
  setLogs,
  logStats,
  setLogStats,
}) {
  if (logs && settings) {
    return (
      <main aria-live="polite" id="main">
        <h1 className="sr-only">Dashboard</h1>
        <section className="LogStats">
          <h2 className="sr-only">Log Statistics</h2>
          {settings.stats.diagrams.show ? (
            <div className="diagram-grid">
              {/* <LogStatsGraph
            dataset={stats.trainingGraph.dataset}
            datasetKeys={stats.trainingGraph.datasetKeys}
            heading={`Results Graph (12 Months)`}
          />
          <LogStatsTimeline
            fields={settings.logs.fields}
            dataset={stats.trainingTimeline.dataset}
            heading={`Log Timeline (60 Days)`}
          />*/}
              <LogStatsProportions
                dataset={logStats.proportions}
                heading="Training Proportions (%)"
              />
            </div>
          ) : null}
          {settings.stats.totals.show ? (
            <LogStatsTotals dataset={logStats.totals} heading="Log Totals" />
          ) : null}
        </section>
        <Logs
          settings={settings}
          logs={logs}
          setLogs={setLogs}
          setLogStats={setLogStats}
        />
      </main>
    );
  } else {
    return null;
  }
}
