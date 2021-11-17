import db from "../database";
import { exportDB, importInto } from "dexie-export-import";
import { useState } from "react";
import ButtonExport from "./ButtonExport";
import ButtonImport from "./ButtonImport";
import "../sass/components/_Impex.scss";

function Impex({ fields }) {
  const [exportDbStatus, setExportDbStatus] = useState("idle");
  const [exportDbData, setExportDbData] = useState("");

  async function exportDb() {
    setExportDbStatus("loading");
    const blob = await exportDB(db);
    const json = await blob.text();
    setExportDbData({
      type: "json",
      data: `data:application/json,${encodeURI(json)}`,
    });
    setExportDbStatus("ready");
  }

  const [importDbStatus, setImportDbStatus] = useState("idle");

  async function importDb({ target: { files } }) {
    setImportDbStatus("loading");
    const blob = files[0];
    await importInto(db, blob);
    setImportDbStatus("ready");
  }

  const [exportCSVStatus, setExportCSVStatus] = useState("idle");
  const [exportCSVData, setExportCSVData] = useState("");

  async function exportCSV() {
    setExportCSVStatus("loading");
    const blob = await exportDB(db);
    const json = await blob.text();

    // Gather all fields including dynamic ones
    const staticFields = ["key", "date", "duration", "training", null, "notes"];
    let dynamicFields = [];
    Object.keys(fields.training.options).forEach((option) => {
      // Check for options with empty fields object
      if (fields.training.options[option].fields === false) {
        return;
      } else {
        dynamicFields.push(Object.keys(fields.training.options[option].fields));
      }
    });
    dynamicFields = [...new Set(dynamicFields.flat())];
    const allFields = staticFields.flatMap((field) => {
      return field === null ? dynamicFields : field;
    });

    // Write rows from JSON
    let csv = "";
    allFields.forEach((field, i) => {
      csv += i === allFields.length - 1 ? `${field}` : `${field},`;
    });
    csv += "\n";

    JSON.parse(json).data.data[0].rows.forEach((row) => {
      // Row variable allows for modifications without iterating all csv
      let csvRow = "";
      allFields.forEach((field, i) => {
        const logValue = row[field];
        if (logValue) {
          csvRow += logValue.toString().includes(",")
            ? `"${logValue}",`
            : `${logValue},`;
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
          Because Sweatless stores your data in your browsers built-in database
          you may want to make a backup if:
        </p>
        <ol>
          <li>
            You want to clear your saved site-data (e.g. you would delete your
            logs otherwise)
          </li>
          <li>You want to deinstall your browser entirely</li>
          <li>You want to transfer your logs from one browser to another</li>
        </ol>
        <p>
          Additionally there is also the option to save your logs as a CSV file
          which can be used with all spread sheet software like Google Sheets or
          MS Excel.
        </p>
        <p>
          <strong>
            To save multiple backups or to see the newly imported data you have
            to refresh your browser!
          </strong>
        </p>
      </div>
      <div className="button-container">
        <ButtonExport
          exportStatus={exportDbStatus}
          handleExport={exportDb}
          file={exportDbData}
          label={"Backup"}
          className={"button-primary"}
        />
        <ButtonImport
          importStatus={importDbStatus}
          handleImport={importDb}
          label={"Backup"}
          className={"button-primary"}
        />
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

export default Impex;
