import React, { forwardRef } from "react";

const InputField = forwardRef(function Input(
  {
    j,
    field,
    isOptionalField,
    input,
    handleInput,
    formatField,
    validateField,
    clearErrorFields,
  },
  ref,
) {
  const label = (field) =>
    field?.footnote?.length ? (
      <span id={`fn-${field.label}`}>
        {field.label}&nbsp;
        <a href={`#fn-${field.label}-text`} className="footnote-index">
          {field.footnoteIndex}
        </a>
      </span>
    ) : (
      <span>{field.label}</span>
    );

  if (field.type === "select") {
    return (
      <label className="field-x-large">
        {label(field)}
        <select
          ref={(el) => (ref.current[j] = el)}
          id={field.label}
          value={input.value}
          onChange={(e) => {
            clearErrorFields();
            handleInput(e);
          }}
        >
          {field.options.map((optionField) => (
            <option key={optionField.label}>{optionField.label}</option>
          ))}
        </select>
      </label>
    );
  } else {
    return (
      <label className={isOptionalField ? "field-small" : "field-large"}>
        {label(field)}
        <input
          ref={(el) => (ref.current[j] = el)}
          id={field.label}
          type={field.type}
          pattern={field.pattern}
          placeholder={field.type === "number" ? "#" : "..."}
          value={input.value}
          onChange={(e) => {
            handleInput(e, j);
          }}
          onBlur={(e) => {
            formatField(e, j);
            validateField(e, j);
          }}
          className={input.valid ? "" : "error"}
          aria-invalid={input.valid === false}
          aria-errormessage={`error-msg-${field.label}`}
        />
      </label>
    );
  }
});

export default InputField;
