import { useState } from "react";
import ButtonExport from "./ButtonExport";
import "../sass/components/_Impex.scss";

export default function Impex({ logFields, logs }) {
  const [exportCSVStatus, setExportCSVStatus] = useState("idle");
  const [exportCSVData, setExportCSVData] = useState("");

  async function exportCSV() {
    setExportCSVStatus("loading");
    let dynamicFields = [];
    logFields[2].options.forEach((option) => {
      // Check for options with empty fields object
      if (option.fields.length) {
        option.fields.forEach((field) => dynamicFields.push(field.label));
      }
    });
    dynamicFields = [...new Set(dynamicFields)];
    const allFields = logFields
      .reduce((allFields, field) => {
        allFields.push(field.label);
        if (field.options.length) allFields.push(dynamicFields);
        return allFields;
      }, [])
      .flat();

    // Write rows from JSON
    let csv = "";
    allFields.forEach((field, i) => {
      csv += i === allFields.length - 1 ? `${field}` : `${field},`;
    });
    csv += "\n";

    logs.forEach((row) => {
      let csvRow = "";
      allFields.forEach((column, i) => {
        const logProp = row.data.find((field) => field.label === column);
        if (logProp) {
          csvRow += logProp.value.toString().includes(",")
            ? `"${logProp.value}",`
            : `${logProp.value},`;
        } else {
          csvRow += ",";
        }
        if (i === allFields.length - 1) {
          csvRow = csvRow.replace(/,$/, "");
        }
      });
      csvRow += "\n";
      csv += csvRow;
    });
    setExportCSVData({ type: "csv", data: `data:text/csv,${encodeURI(csv)}` });
    setExportCSVStatus("ready");
  }

  return (
    <section className="Impex">
      <div className="wrapper">
        <h2 className="ui-heading">Import/Export</h2>
        <p>
          Save your logs as a CSV file which can be used with all spread sheet
          software like Google Sheets or MS Excel.
        </p>
      </div>
      <div className="button-container">
        <ButtonExport
          exportStatus={exportCSVStatus}
          handleExport={exportCSV}
          file={exportCSVData}
          label={"CSV"}
          className={"button-tertiary"}
        />
      </div>
    </section>
  );
}
