import { useReducer } from "react";
import { useFetch } from "../hooks/useFetch";
import LogInput from "./LogInput";
import LogList from "./LogList";
import {
  findOptionField,
  makeInputModelFromConfig,
  makeDbModelFromInput,
} from "../util/models";
import "../sass/components/_Logs.scss";

function inputReducer(input, action) {
  let selectOptions;
  let chosenOption;
  switch (action.type) {
    case "UPDATE_VALUE":
      const updated = { ...input };
      updated.model.data[action.index] = {
        ...updated.model.data[action.index],
        ...action.payload,
      };
      return updated;
    case "UPDATE_FIELDS":
      selectOptions = action.fields[2].options;
      chosenOption = findOptionField(selectOptions, action.payload);
      // create empty input with new optional fields and fill other values in
      const model = makeInputModelFromConfig(action.fields, chosenOption);
      model.data.forEach((updatedField) => {
        if (
          action.fields.find((field) => field.label === updatedField.label) ||
          updatedField.label === "id"
        ) {
          const currentI = input.model.data.findIndex(
            (currentField) => updatedField.label === currentField.label,
          );
          updatedField.value = input.model.data[currentI].value;
        }
      });
      model.data[3] = { ...model.data[3], value: action.payload };
      return { ...input, selectOption: chosenOption, model };
    case "LOAD":
      selectOptions = action.fields[2].options;
      chosenOption = findOptionField(
        selectOptions,
        action.payload.data[3].value,
      );
      return {
        model: action.payload,
        selectOption: chosenOption,
        mode: "SAVE",
      };
    case "RESET":
      return initInput(action.fields);
    default:
      throw new Error("'inputReducer' must be called with valid 'action.type'");
  }
}

function initInput(fields) {
  return {
    model: makeInputModelFromConfig(fields, 0),
    selectOption: 0,
    mode: "LOG",
  };
}

export default function Logs({
  settings: {
    logs: { input: inputSettings, list: listSettings, fields },
  },
  logs,
  setLogs,
  setLogStats,
}) {
  const [input, dispatchInput] = useReducer(inputReducer, fields, initInput);
  const [doFetch, fetchError] = useFetch({
    message: "Connection Error",
    errors: "Data could not be submitted",
  });

  function handleInput({ target: { id, value } }, j) {
    switch (id) {
      case "Training":
        dispatchInput({ type: "UPDATE_FIELDS", fields, payload: value });
        break;
      default:
        dispatchInput({ type: "UPDATE_VALUE", index: j, payload: { value } });
    }
  }

  async function saveLog(e) {
    e.preventDefault();
    const clearedLogs = logs.filter((log) => log.deleted === false);
    switch (input.mode) {
      case "SAVE":
        const updatedLogs = clearedLogs.map((log) =>
          log.data[0].value === input.model.data[0].value ? input.model : log,
        );
        setLogs(updatedLogs);
        const { statistics: statsPUT } = await doFetch(
          "PUT",
          `logs/${input.model.data[0].value}`,
          makeDbModelFromInput(fields, input.model),
        );
        setLogStats(statsPUT);
        break;
      default:
        const { id: logId, statistics: statsPOST } = await doFetch(
          "POST",
          "logs",
          makeDbModelFromInput(fields, input.model),
        );
        setLogStats(statsPOST);
        const inputWithId = { ...input.model };
        inputWithId.data[0].value = logId;
        clearedLogs.push(inputWithId);
        setLogs(clearedLogs);
    }
    dispatchInput({ type: "RESET", fields });
  }

  function editLog(logId) {
    const logToEdit = logs.find((log) => log.data[0].value === logId);
    dispatchInput({ type: "LOAD", fields, payload: logToEdit });
  }

  return (
    <section className="Logs">
      <h2 className="sr-only">Logs</h2>
      {inputSettings.show ? (
        <LogInput
          fields={fields}
          input={input}
          dispatchInput={dispatchInput}
          handleInput={handleInput}
          saveLog={saveLog}
          saveLogError={fetchError}
        />
      ) : null}
      {listSettings.show ? (
        <LogList
          logs={logs}
          setLogs={setLogs}
          setLogStats={setLogStats}
          editLog={editLog}
        />
      ) : null}
    </section>
  );
}
