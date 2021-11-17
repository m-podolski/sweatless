import React from "react";
import { render } from "@testing-library/react";

import LogStats from "../LogStats";
import { fieldsConfig } from "../../models.js";

const logs = [
  {
    date: { label: "Date", value: "2021-07-08" },
    duration: { label: "Duration", value: "1:06", valid: true },
    training: { label: "Training", value: "Easy Run" },
    notes: { label: "Notes", value: "", valid: true },
    distance: { label: "Distance", value: "", valid: true },
    key: { value: 1625741836422 },
  },
  {
    date: { label: "Date", value: "2021-07-02" },
    duration: { label: "Duration", value: "1:30", valid: true },
    training: { label: "Training", value: "Easy Run" },
    notes: { label: "Notes", value: "", valid: true },
    distance: { label: "Distance", value: "14.5", valid: true },
    key: { value: 1625247555799 },
  },
  {
    date: { label: "Date", value: "2021-06-30" },
    duration: { label: "Duration", value: "1:12", valid: true },
    training: { label: "Training", value: "High Intensity Run" },
    notes: { label: "Notes", value: "", valid: true },
    distance: { label: "Distance", value: "13", valid: true },
    intervals: { label: "Intervals", value: "2", valid: true },
    hillreps: { label: "Hill Repeats", value: "2", valid: true },
    strides: { label: "Strides", value: "3", valid: true },
    key: { value: 1625248019242 },
  },
];

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
    graph: { label: "Results Graph", show: true, scale: 12 },
  },
};

it("renders without crashing", () => {
  render(
    <LogStats fields={fieldsConfig} logs={logs} settings={initSettings} />,
  );
});
