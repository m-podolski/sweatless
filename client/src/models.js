import { dateTime } from "./library";

export const fieldsConfig = {
  date: {
    name: "date",
    label: "Date",
    type: "date",
    value: dateTime("date"),
  },
  duration: {
    name: "duration",
    label: "Duration",
    type: "text",
    value: "",
    unit: false,
    placeholder: "H : MM",
    valid: true,
    // eslint-disable-next-line
    pattern: "[\\d: \\.,]{1,7}",
    // all regexes in pattern attributes must be escape two times because jsx removes escapes when rendering
    errorMsg:
      "Allowed characters: digits, space, comma, period and colon, max. length is 7 characters",
  },
  training: {
    name: "training",
    label: "Training",
    type: "select",
    value: "Easy Run",
    options: {
      strength: { name: "strength", label: "Strength", fields: false },
      easyrun: {
        name: "easyrun",
        label: "Easy Run",
        fields: {
          distance: {
            name: "distance",
            label: "Distance",
            type: "number",
            value: "",
            unit: "km",
            placeholder: "km",
            valid: true,
            // eslint-disable-next-line
            pattern: "[\\d\\.,]{1,6}",
            errorMsg:
              "Allowed characters: digits, period and comma, max. length is 6 characters",
            plotGraph: true,
          },
        },
      },
      distancerun: {
        name: "distancerun",
        label: "Distance Run",
        fields: {
          distance: {
            name: "distance",
            label: "Distance",
            type: "number",
            value: "",
            unit: "km",
            placeholder: "km",
            valid: true,
            // eslint-disable-next-line
            pattern: "[\\d\\.,]{1,6}",
            errorMsg:
              "Allowed characters: digits, period and comma, max. length is 6 characters",
            plotGraph: true,
          },
        },
      },
      fartlekrun: {
        name: "fartlekrun",
        label: "Fartlek Run",
        fields: {
          distance: {
            name: "distance",
            label: "Distance",
            type: "number",
            value: "",
            unit: "km",
            placeholder: "km",
            valid: true,
            // eslint-disable-next-line
            pattern: "[\\d\\.,]{1,6}",
            errorMsg:
              "Allowed characters: digits, period and comma, max. length is 6 characters",
            plotGraph: false,
          },
          fastintervals: {
            name: "fastintervals",
            label: "Fast Intervals",
            type: "text",
            value: "",
            unit: false,
            placeholder: "...",
            valid: true,
            // eslint-disable-next-line
            pattern: ".{1,100}",
            errorMsg: "Max. length is 100 characters",
            plotGraph: false,
          },
        },
      },
      highintensityrun: {
        name: "highintensityrun",
        label: "High Intensity Run",
        fields: {
          distance: {
            name: "distance",
            label: "Distance",
            type: "number",
            value: "",
            unit: "km",
            placeholder: "km",
            valid: true,
            // eslint-disable-next-line
            pattern: "[\\d\\.,]{1,6}",
            errorMsg:
              "Allowed characters: digits, period and comma, max. length is 6 characters",
            plotGraph: true,
          },
          intervals: {
            name: "intervals",
            label: "Intervals",
            type: "text",
            value: "",
            unit: false,
            placeholder: "...",
            valid: true,
            // eslint-disable-next-line
            pattern: ".{1,100}",
            errorMsg: "Max. length is 100 characters",
            plotGraph: false,
          },
          hillreps: {
            name: "hillreps",
            label: "Hill Repeats",
            type: "number",
            value: "",
            unit: false,
            placeholder: "#",
            valid: true,
            // eslint-disable-next-line
            pattern: "d{1,2}",
            errorMsg: "Allowed characters: digits, max. length is 2 characters",
            plotGraph: false,
          },
          strides: {
            name: "strides",
            label: "Strides",
            type: "text",
            value: "",
            unit: false,
            placeholder: "...",
            valid: true,
            // eslint-disable-next-line
            pattern: ".{1,100}",
            errorMsg: "Max. length is 100 characters",
            plotGraph: false,
          },
        },
      },
    },
  },
  notes: {
    name: "notes",
    label: "Notes",
    type: "text",
    value: "",
    unit: false,
    placeholder: "...",
    valid: true,
    // eslint-disable-next-line
    pattern: ".{1,500}",
    errorMsg: "Max. length is 500 characters",
  },
};

export function findTrainingField(fieldsConfig, label) {
  return Object.keys(fieldsConfig.training.options).find((option) => {
    return fieldsConfig.training.options[option].label === label;
  });
}

export function makeInputModelFromFields(...fieldsConfigs) {
  return fieldsConfigs.reduce((inputModel, fieldsConfig) => {
    inputModel = {
      ...inputModel,
      ...Object.keys(fieldsConfig).reduce((inputFields, field) => {
        inputFields[field] = {
          label: fieldsConfig[field].label,
          value: fieldsConfig[field].value,
        };
        if (fieldsConfig[field].hasOwnProperty("valid")) {
          inputFields[field] = {
            ...inputFields[field],
            valid: fieldsConfig[field].valid,
          };
        }
        return inputFields;
      }, {}),
    };
    return inputModel;
  }, {});
}

export function makeInputModelFromDB(fieldsConfig, dbModel) {
  const chosenOption = findTrainingField(fieldsConfig, dbModel.training);
  let inputModel = makeInputModelFromFields(
    fieldsConfig,
    fieldsConfig.training.options[chosenOption].fields,
  );
  Object.keys(dbModel).forEach((field) => {
    switch (field) {
      case "key":
        inputModel.key = { value: dbModel.key };
        break;
      default:
        inputModel[field].value = dbModel[field];
    }
  }, {});
  return inputModel;
}

export function makeDbModelFromInput(inputModel) {
  return {
    ...Object.keys(inputModel).reduce((DbModel, field) => {
      DbModel[field] = inputModel[field].value;
      return DbModel;
    }, {}),
  };
}
