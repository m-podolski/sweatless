import { dateTime } from "../library";

function ButtonExport({ exportStatus, handleExport, file, label, className }) {
  switch (exportStatus) {
    case "loading":
      return <div className="button-loading">Loading...</div>;
    case "ready":
      return (
        <a
          href={file.data}
          download={`sweatless-${label.toLowerCase()}-${dateTime(
            "dateTime",
            true,
          )}.${file.type}`}
          className="button-secondary"
        >
          Download {label}
        </a>
      );
    default:
      return (
        <button type="button" className={className} onClick={handleExport}>
          Export {label}
        </button>
      );
  }
}

export default ButtonExport;
