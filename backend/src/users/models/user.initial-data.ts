import { UserSettings } from "./user.schema";

export const initialSettings: UserSettings = {
  logs: {
    label: "Logs",
    input: { label: "Input", show: true },
    list: { label: "List", show: true },
    fields: [
      { label: "Date" as const, type: "DATE" as const },
      {
        label: "Duration" as const,
        type: "DURATION" as const,
      },
      {
        label: "Training" as const,
        type: "SELECT" as const,
        options: [
          { label: "Strength" },
          {
            label: "Easy Run",
            fields: [
              {
                label: "Distance",
                type: "NUMBER" as const,
                unit: "km",
              },
            ],
          },
          {
            label: "Distance Run",
            fields: [
              {
                label: "Distance",
                type: "NUMBER" as const,
                unit: "km",
              },
            ],
          },
          {
            label: "Fartlek Run",
            fields: [
              {
                label: "Distance",
                type: "NUMBER" as const,
                unit: "km",
              },
              {
                label: "Fast Intervals",
                type: "TEXT" as const,
              },
            ],
          },
          {
            label: "High Intensity Run",
            fields: [
              {
                label: "Distance",
                type: "NUMBER" as const,
                unit: "km",
              },
              {
                label: "Intervals",
                type: "TEXT" as const,
              },
              {
                label: "Hill Repeats",
                type: "NUMBER" as const,
              },
              {
                label: "Strides",
                type: "TEXT" as const,
              },
            ],
          },
        ],
      },
      {
        label: "Notes" as const,
        type: "LONG_TEXT" as const,
      },
    ],
  },
  statistics: {
    label: "Log Statistics",
    totals: {
      label: "Log Totals",
      show: true,
    },
    diagrams: {
      label: "Diagrams",
      show: true,
      months: { plottedField: "Distance" },
    },
  },
  workouts: {
    label: "Workouts",
    panel: {
      label: "Panel",
      show: true,
    },
  },
  exercises: {
    label: "Exercises",
    panel: {
      label: "Panel",
      show: true,
    },
  },
};
