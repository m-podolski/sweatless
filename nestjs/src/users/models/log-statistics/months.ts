import { Log } from "src/users/models/user.log.schema";
import { UserTrainingOption } from "src/users/models/user.schema";
import { LogStatisticCalculator } from "../../services/log-statistics.service";
import {
  months as monthsList,
  parseFloatNaNSafe,
} from "../../services/utilities/date-time";

class MonthField {
  name: string;
  total: number;
  fields: number[];
  constructor(name: string, total: number, fields: number[]) {
    this.name = name;
    this.total = total;
    this.fields = fields;
  }
}

interface MonthsData {
  data: MonthField[];
  keys: string[];
  unit: string;
}

export class Months implements LogStatisticCalculator<MonthsData> {
  private _dataset: MonthsData = {
    data: [],
    keys: [],
    unit: "",
  };
  private plottedField = "";
  private endDate = new Date();
  private firstOfCurrentMonth = new Date(
    this.endDate.getFullYear(),
    this.endDate.getMonth(),
  );

  constructor(
    fieldsConfig: UserTrainingOption[],
    plottedField: string,
    months?: MonthsData,
  ) {
    this.plottedField = plottedField;
    if (months?.data.length) {
      this._dataset = months;
    } else {
      // labels match the fields list of MonthField by index
      const datasetKeys = fieldsConfig.reduce(
        (datasetKeys: string[], option) => {
          if (option?.fields?.length) {
            option.fields.forEach((field, i) => {
              if (field.label === plottedField) {
                datasetKeys.push(option.label);
              }
              if (i === 0) this._dataset.unit = field.unit || "";
            });
          }
          return datasetKeys;
        },
        [],
      );
      this._dataset.keys = datasetKeys;

      const monthsScale = monthsList
        .slice(this.endDate.getMonth() + 1)
        .concat(monthsList.slice(0, this.endDate.getMonth() + 1));

      for (let i = 0; i < 12; i++) {
        this._dataset.data[i] = new MonthField(
          monthsScale[i][1] as string,
          0,
          [],
        );
        this._dataset.keys.forEach((key, j) => {
          this._dataset.data[i].fields[j] = 0;
        });
      }
    }
  }

  get dataset() {
    return this._dataset;
  }

  set dataset(value) {
    this._dataset = value;
  }

  add(log: Log) {
    this.calc("ADD", log);
  }

  subtract(log: Log) {
    this.calc("SUB", log);
  }

  private calc(mode: "ADD" | "SUB", log: Log) {
    const logDate = new Date(log.date || Date.now());
    const logResults = JSON.parse(log.results);
    const logPlottedFieldKey = Object.keys(logResults).find(
      (key) => key === this.plottedField,
    );

    if (logPlottedFieldKey) {
      const logPlottedField = logResults[logPlottedFieldKey];
      const valueKey = this._dataset.keys.findIndex(
        (key) => key === log.training,
      );
      const monthsAgo =
        Math.floor(
          (this.firstOfCurrentMonth.getTime() - logDate.getTime()) /
            (1000 * 60 * 60 * 24 * 30),
        ) + 1;
      const monthIndex = 12 - 1 - monthsAgo;

      const currentDataField = this._dataset.data[monthIndex].fields[valueKey];
      const currentDataTotal = this._dataset.data[monthIndex].total;
      const parsedFieldValue = parseFloatNaNSafe(logPlottedField.value);
      const parsedValue = mode === "ADD" ? parsedFieldValue : -parsedFieldValue;

      this._dataset.data[monthIndex].fields[valueKey] =
        currentDataField === null
          ? parsedValue
          : currentDataField + parsedValue;

      this._dataset.data[monthIndex].total =
        currentDataTotal === null
          ? parsedValue
          : currentDataTotal + parsedValue;
    }
  }
}
