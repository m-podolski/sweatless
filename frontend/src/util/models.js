import { hoursFloatToTime, timeToHoursFloat } from "./dateAndTime";

export function findOptionField(fieldsConfig, label) {
  return fieldsConfig.findIndex((option) => {
    return option.label === label;
  });
}

export function makeInputModelFromConfig(fieldsConfig, trainingOption) {
  const data = fieldsConfig.reduce((inputModel, field, i) => {
    let element = {
      label: fieldsConfig[i].label,
      value: "",
      valid: true,
      errorMsg: fieldsConfig[i].errorMsg || null,
    };

    switch (field.type) {
      case "date":
        const currentDate = new Date(Date.now()).toISOString();
        element.value = currentDate.slice(
          0,
          currentDate.length - "T00:00:00.000Z".length,
        );
        inputModel.push(element);
        break;
      case "select":
        element.value = fieldsConfig[i].options[trainingOption].label;
        inputModel.push(element);
        fieldsConfig[i].options[trainingOption].fields.forEach(
          ({ label, unit, errorMsg }) => {
            inputModel.push({
              label,
              value: "",
              unit: unit === "" ? null : unit,
              valid: true,
              errorMsg: errorMsg || null,
            });
          },
        );
        break;
      default:
        inputModel.push(element);
        break;
    }
    return inputModel;
  }, []);
  data.unshift({ label: "id", value: null });
  // input models also keep state of the list view
  return { data, deleted: false };
}

export function makeDbModelFromInput(fieldsConfig, inputModel) {
  const trainingOptions = fieldsConfig[2].options;
  const chosenOption = findOptionField(
    trainingOptions,
    inputModel.data.find((field) => field.label === "Training").value,
  );
  const optionFields = trainingOptions[chosenOption].fields;

  let DbModel = inputModel.data.reduce(
    (DbModel, field) => {
      if (
        optionFields.find((optionField) => optionField.label === field.label)
      ) {
        DbModel.Results[field.label] = { value: field.value, unit: field.unit };
      } else {
        if (field.label === "Duration") {
          DbModel[field.label] = timeToHoursFloat(field.value);
        } else {
          DbModel[field.label] = field.value;
        }
      }
      return DbModel;
    },
    { Results: {} },
  );
  // User configured fields are stored as JSON to keep the db schema flexible
  DbModel.Results = JSON.stringify(DbModel.Results);
  return DbModel;
}

export function makeInputModelFromDB(fieldsConfig, dbModel) {
  const trainingOptions = fieldsConfig[2].options;
  const chosenOption = findOptionField(trainingOptions, dbModel.Training);
  const inputModel = makeInputModelFromConfig(fieldsConfig, chosenOption);

  Object.keys(dbModel).forEach((field) => {
    if (field === "_id") field = "id";
    const inputField = inputModel.data.find((currentField) => {
      return currentField.label === field;
    });

    switch (field) {
      case "Date":
        inputField.value = dbModel.Date.slice(
          0,
          dbModel.Date.length - "T00:00:00.000Z".length,
        );
        break;
      case "Duration":
        inputField.value = hoursFloatToTime(dbModel.Duration);
        break;
      case "Results":
        const parsedResults = JSON.parse(dbModel.Results);
        Object.keys(parsedResults).forEach((resultsField) => {
          inputModel.data.find(
            (inputField) => inputField.label === resultsField,
          ).value = parsedResults[resultsField].value;
        });
        break;
      default:
        if (field === "id") field = "_id";
        inputField.value = dbModel[field];
    }
  });
  return inputModel;
}
