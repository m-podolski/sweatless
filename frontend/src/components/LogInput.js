import React, { useState, useEffect, useRef } from "react";
import InputField from "../components/InputField";
import Errors from "../components/Errors";
import { hoursDec2ToTime, minutesToTime } from "../util/dateAndTime";
import ReactMarkdown from "react-markdown";
import "../sass/components/_LogInput.scss";

export default function LogInput({
  fields,
  input,
  dispatchInput,
  handleInput,
  saveLog,
  saveLogError,
}) {
  const [errorFields, setErrorFields] = useState([]);

  let optionalFields = [];
  const footnotes = {
    footnoteIndex: 0,
    mark(field) {
      this.footnoteIndex++;
      field.footnoteIndex = this.footnoteIndex;
    },
  };
  const inputFields = fields.reduce((inputFields, field) => {
    if (field.footnote) footnotes.mark(field);
    inputFields.push(field);
    if (field.type === "select") {
      field.options[input.selectOption].fields.forEach((optionField) => {
        if (optionField.footnote) footnotes.mark(optionField);
        inputFields.push(optionField);
        optionalFields.push(optionField.label);
      });
    }
    return inputFields;
  }, []);

  function formatDuration({ target: { id, value } }, j) {
    if (id === "Duration") {
      let formattedValue = value.trim();
      const hoursPeriodHours = formattedValue.match(/^(\d)[.,](\d{1,2})$/);
      const minutes = formattedValue.match(/^\d{1,3}$/);
      if (hoursPeriodHours) {
        formattedValue = hoursDec2ToTime(hoursPeriodHours[0]);
      }
      if (minutes) {
        formattedValue = minutesToTime(minutes);
      }
      dispatchInput({
        type: "UPDATE_VALUE",
        index: j,
        payload: { value: formattedValue },
      });
    }
  }

  function validateField(
    {
      target: {
        type,
        id,
        value,
        validity: { valid },
      },
    },
    j,
  ) {
    if (["date", "select"].includes(type) === false) {
      if (valid === true) {
        dispatchInput({
          type: "UPDATE_VALUE",
          index: j,
          payload: { valid: true },
        });
        setErrorFields([...errorFields.filter((field) => field.label !== id)]);
      } else {
        dispatchInput({
          type: "UPDATE_VALUE",
          index: j,
          payload: { valid: false },
        });
        setErrorFields([
          ...errorFields.filter((field) => field.label !== id),
          { label: id, errorMsg: input.model.data[j].errorMsg },
        ]);
      }
    }
  }

  function clearErrorFields() {
    setErrorFields((prevErrorFields) => {
      const nonOptionalFields = fields.map((field) => field.label);
      return prevErrorFields.filter((errorField) =>
        nonOptionalFields.includes(errorField.label),
      );
    });
  }

  const entryRef = useRef([]);

  useEffect(() => {
    entryRef.current[1].focus();
    // if (["SAVE", "LOG"].includes(inputR.mode)) {
    // }
  }, [input.mode]);

  return (
    <section className="LogInput">
      <h3 className="sr-only">Log Input</h3>
      <form onSubmit={saveLog} noValidate>
        <Errors error={errorFields} />
        <div className="row input-fields-row">
          {inputFields.map((field, i) => (
            <InputField
              key={field.label}
              ref={entryRef}
              j={i + 1} // data[0] contains the id
              field={field}
              isOptionalField={optionalFields.includes(field.label)}
              input={input.model.data[i + 1]}
              handleInput={handleInput}
              formatField={formatDuration}
              validateField={validateField}
              clearErrorFields={clearErrorFields}
            />
          ))}
          <div className="button-container">
            <button
              type="submit"
              className="button-primary button-row button-input"
            >
              {`${input.mode.slice(0, 1)}${input.mode.slice(1).toLowerCase()}`}
            </button>
          </div>
        </div>
        <Errors error={saveLogError} />
      </form>
      {inputFields.find((field) => field.footnote?.length) ? (
        <div>
          <ol className="footnotes">
            {inputFields.map((field, i) => {
              if (field.footnote?.length) {
                return (
                  <li key={field.label} id={`fn-${field.label}-text`}>
                    <ReactMarkdown>{field.footnote}</ReactMarkdown>&nbsp;
                    <a
                      href={`#fn-${field.label}`}
                      className="footnote-back-link"
                      title="Jump back to footnote"
                    >
                      ↩
                    </a>
                  </li>
                );
              } else {
                return null;
              }
            })}
          </ol>
        </div>
      ) : null}
    </section>
  );
}
