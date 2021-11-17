import db from "../database";
import React, { useState } from "react";
import LogInput from "./LogInput";
import LogList from "./LogList";
import {
  findTrainingField,
  makeInputModelFromFields,
  makeDbModelFromInput,
} from "../models";
import "../sass/components/_Logs.scss";

function Logs({ fields, logs, setLogs, settings }) {
  const initTraining = fields.training.options.easyrun;
  const [trainingOption, setTrainingOption] = useState(initTraining.name);

  const [input, setInput] = useState(
    makeInputModelFromFields(
      fields,
      fields.training.options[trainingOption].fields,
    ),
  );
  const [logMode, setLogMode] = useState("Log");

  function handleInput({ target: { id, value } }) {
    switch (id) {
      case "training":
        // remove the conditional fields from the previous selection but keep the other data
        const clearedInput = Object.keys(input).reduce((acc, property) => {
          if (Object.keys(fields).includes(property)) {
            acc[property] = input[property];
          }
          return acc;
        }, {});

        const chosenOption = findTrainingField(fields, value);
        const optionInput = makeInputModelFromFields(
          fields.training.options[chosenOption].fields,
        );
        setTrainingOption(chosenOption);

        setInput({
          ...clearedInput,
          [id]: { ...clearedInput[id], value: value },
          ...optionInput,
        });
        break;
      default:
        setInput({
          ...input,
          [id]: { ...input[id], value: value },
        });
    }
  }

  function saveLog(e) {
    e.preventDefault();
    const clearedLogs = logs.filter(
      (log) => log.hasOwnProperty("deleted") === false,
    );
    switch (logMode) {
      case "Save":
        const updatedLogs = clearedLogs.map((log) =>
          log.key === input.key ? input : log,
        );
        setLogs(updatedLogs);
        setLogMode("Log");

        (async function updateRecord(log) {
          await db.logs.put(log);
        })(makeDbModelFromInput(input));
        break;
      default:
        const defaultInput = {
          ...input,
          key: { value: Date.now() },
        };
        setLogs([...clearedLogs, defaultInput]);

        (async function makeRecord(log) {
          await db.logs.put(log);
        })(makeDbModelFromInput(defaultInput));
    }
    setInput(makeInputModelFromFields(fields, initTraining.fields));
    setTrainingOption(initTraining.name);
  }

  function editLog(logKey) {
    const logToEdit = logs.find((log) => log.key === logKey);
    const chosenOption = findTrainingField(fields, logToEdit.training.value);
    setTrainingOption(chosenOption);
    setInput(logToEdit);
    setLogMode("Save");
  }

  return (
    <section className="Logs">
      <h2 className="sr-only">Logs</h2>
      {settings.logs.input.show ? (
        <LogInput
          fields={fields}
          input={input}
          setInput={setInput}
          handleInput={handleInput}
          trainingOption={trainingOption}
          saveLog={saveLog}
          logMode={logMode}
        />
      ) : null}

      {settings.logs.list.show ? (
        <LogList logs={logs} setLogs={setLogs} editLog={editLog} />
      ) : null}
    </section>
  );
}

export default Logs;
