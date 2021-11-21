export const initialLogFields = [
  { label: "Date", type: "date" },
  {
    label: "Duration",
    type: "text",
    pattern: "[\\d: \\.,]{1,7}",
    unit: "hours",
    errorMsg:
      "Allowed characters: digits, space, comma, period and colon, max. length is 7 characters",
    footnote:
      "Duration can be entered in these formats: **H:MM** or **H.HH** or **H,HH** or **MMM**.",
  },
  {
    label: "Training",
    type: "select",
    options: [
      { label: "Strength" },
      {
        label: "Easy Run",
        fields: [
          {
            label: "Distance",
            type: "number",
            unit: "km",
            errorMsg:
              "Allowed characters: digits, period and comma, max. length is 6 characters",
          },
        ],
      },
      {
        label: "Distance Run",
        fields: [
          {
            label: "Distance",
            type: "number",
            unit: "km",
            errorMsg:
              "Allowed characters: digits, period and comma, max. length is 6 characters",
          },
        ],
      },
      {
        label: "Fartlek Run",
        fields: [
          {
            label: "Distance",
            type: "number",
            unit: "km",
            errorMsg:
              "Allowed characters: digits, period and comma, max. length is 6 characters",
          },
          {
            label: "Fast Intervals",
            type: "text",
            pattern: ".{1,100}",
            errorMsg: "Max. length is 100 characters",
          },
        ],
      },
      {
        label: "High Intensity Run",
        fields: [
          {
            label: "Distance",
            type: "number",
            unit: "km",
            errorMsg:
              "Allowed characters: digits, period and comma, max. length is 6 characters",
          },
          {
            label: "Intervals",
            type: "text",
            pattern: ".{1,100}",
            errorMsg: "Max. length is 100 characters",
          },
          {
            label: "Hill Repeats",
            type: "number",
            errorMsg: "Allowed characters: digits, max. length is 2 characters",
          },
          {
            label: "Strides",
            type: "text",
            pattern: ".{1,100}",
            errorMsg: "Max. length is 100 characters",
          },
        ],
      },
    ],
  },
  {
    label: "Notes",
    type: "text",
    pattern: ".{0,250}",
    errorMsg: "Max. length is 250 characters",
  },
];
