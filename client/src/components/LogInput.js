import React, { useState, useRef, useEffect } from "react";
import { decPlaces2HoursToTime, minutesToTime } from "../library";
import "../sass/components/_LogInput.scss";

function LogInput({
  fields,
  input,
  setInput,
  handleInput,
  trainingOption,
  saveLog,
  logMode,
}) {
  let dynamicFields = fields.training.options[trainingOption].fields;
  const [errorFields, setErrorFields] = useState([]);

  function formatDuration({ target: { value } }) {
    let formattedValue = value.trim();
    const hoursPeriodHours = formattedValue.match(/^(\d)[.,](\d{1,2})$/);
    const minutes = formattedValue.match(/^\d{1,3}$/);

    if (hoursPeriodHours) {
      formattedValue = decPlaces2HoursToTime(hoursPeriodHours[0]);
    }
    if (minutes) {
      formattedValue = minutesToTime(minutes);
    }
    setInput({
      ...input,
      duration: { ...input.duration, value: formattedValue },
    });
  }

  function validateField({
    target: {
      id,
      validity: { valid },
    },
  }) {
    if (valid === true) {
      setInput((currentInput) => {
        return {
          ...currentInput,
          [id]: {
            ...currentInput[id],
            valid: true,
          },
        };
      });
      setErrorFields([...errorFields.filter((field) => field.name !== id)]);
    } else {
      setInput((currentInput) => {
        return {
          ...currentInput,
          [id]: {
            ...currentInput[id],
            valid: false,
          },
        };
      });
      const fieldErrorMsg = Object.keys(fields).includes(id)
        ? fields[id].errorMsg
        : fields.training.options[trainingOption].fields[id].errorMsg;
      setErrorFields([
        ...errorFields.filter((field) => field.name !== id),
        { name: id, label: input[id].label, errorMsg: fieldErrorMsg },
      ]);
    }
  }

  function clearErrorFields() {
    setErrorFields((prevErrorFields) => {
      return prevErrorFields.filter((field) => {
        return Object.keys(fields).includes(field.name);
      });
    });
  }

  useEffect(() => {
    if (logMode === ("Save" || "Log")) {
      entryRef.current.focus();
    }
  }, [logMode]);

  const entryRef = useRef(null);

  return (
    <section className="LogInput">
      <h3 className="sr-only">Log Input</h3>
      <form onSubmit={saveLog} noValidate>
        <div className="error-messages">
          {errorFields.map((field) => (
            <p key={field.name} id={`error-msg-${field.name}`}>
              <span className="error-fieldname">
                {field.label}
                :&nbsp;
              </span>
              {field.errorMsg}
            </p>
          ))}
        </div>
        <div className="row input-fields-row">
          <label className="field-large">
            <span>{fields.date.label}</span>
            <input
              type={fields.date.type}
              id={fields.date.name}
              value={input.date.value}
              onChange={handleInput}
              ref={entryRef}
            />
          </label>
          <label className="field-large">
            <span id="fn-duration">
              {fields.duration.label}
              &nbsp;
              <a href="#fn-duration-text" className="footnote-index">
                1
              </a>
            </span>
            <input
              type={fields.duration.type}
              id={fields.duration.name}
              pattern={fields.duration.pattern}
              placeholder={fields.duration.placeholder}
              value={input.duration.value}
              onChange={handleInput}
              onBlur={(e) => {
                formatDuration(e);
                validateField(e);
              }}
              className={input.duration.valid ? "" : "error"}
              aria-invalid={input.duration.valid}
              aria-errormessage={`error-msg-${fields.duration.name}`}
            />
          </label>
          <label className="field-x-large">
            <span>{fields.training.label}</span>
            <select
              id={fields.training.name}
              value={input.training.value}
              onChange={(e) => {
                clearErrorFields(e);
                handleInput(e);
              }}
            >
              {Object.keys(fields.training.options).map((option) => (
                <option key={fields.training.options[option].name}>
                  {fields.training.options[option].label}
                </option>
              ))}
            </select>
          </label>
          {Object.keys(dynamicFields).map((field) => (
            <label key={dynamicFields[field].name} className="field-small">
              <span>{dynamicFields[field].label}</span>
              <input
                type={dynamicFields[field].type}
                id={dynamicFields[field].name}
                pattern={dynamicFields[field].pattern}
                placeholder={dynamicFields[field].placeholder}
                value={input[field].value}
                onChange={handleInput}
                onBlur={validateField}
                className={input[field].valid ? "" : "error"}
                aria-invalid={input[field].valid}
                aria-errormessage={`error-msg-${dynamicFields[field].name}`}
              />
            </label>
          ))}
          <label className="field-large">
            <span>{fields.notes.label}</span>
            <input
              type={fields.notes.type}
              id={fields.notes.name}
              placeholder={fields.notes.placeholder}
              value={input.notes.value}
              onChange={handleInput}
              onBlur={validateField}
              className={input.notes.valid ? "" : "error"}
              aria-invalid={input.notes.valid}
              aria-errormessage={`error-msg-${fields.duration.name}`}
            />
          </label>
          <div className="button-container">
            <button
              type="submit"
              className="button-primary button-row button-input"
            >
              {logMode}
            </button>
          </div>
        </div>
      </form>
      <div>
        <ol className="footnotes">
          <li id="fn-duration-text">
            Duration can be entered in these formats: <strong>H:MM </strong>
            or <strong>H.HH </strong> or <strong>H,HH </strong>
            or <strong>MMM</strong>. &nbsp;
            <a
              href="#fn-duration"
              className="footnote-back-link"
              title="Jump back to footnote"
            >
              ↩
            </a>
          </li>
        </ol>
      </div>
    </section>
  );
}

export default LogInput;
