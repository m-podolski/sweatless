import "../sass/components/_Errors.scss";

export default function Errors({ error }) {
  if (error) {
    if (Array.isArray(error)) {
      return (
        <div className="Errors">
          {error.map((field) => (
            <p key={field.label} id={`error-msg-${field.label}`}>
              <span className="error-fieldname">
                {field.label}
                :&nbsp;
              </span>
              {field.errorMsg}
            </p>
          ))}
        </div>
      );
    } else {
      return (
        <div className="Errors">
          <p>
            <span className="error-fieldname">
              {error.message}
              :&nbsp;
            </span>
            {error.errors}
          </p>
        </div>
      );
    }
  } else {
    return null;
  }
}
