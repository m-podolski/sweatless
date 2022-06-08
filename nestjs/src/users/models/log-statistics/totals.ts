import { UserModuleConfiguration } from "../../configuration";
import { Log } from "src/users/models/user.log.schema";
import { UserLogField } from "src/users/models/user.schema";
import {
  hoursFloatToTime,
  onlyFloatToPrecision2,
} from "../../services/utilities/date-time";
import { LogStatisticCalculator } from "../../services/log-statistics.service";

const config = new UserModuleConfiguration();

class OptionField {
  label: string;
  total: number;
  unit: string;
  constructor(label: string, total: number, unit: string) {
    this.label = label;
    this.total = total;
    this.unit = unit;
  }
}

class TotalsData extends OptionField {
  fields: OptionField[] = [];
  constructor(
    label: string,
    total: number,
    unit: string,
    fields?: OptionField[],
  ) {
    super(label, total, unit);
    if (fields) this.fields = fields;
  }
}

export interface FormattedTotalsData {
  label: string;
  total: number | string;
  unit: string;
  fields: OptionField[];
}

export class Totals implements LogStatisticCalculator<TotalsData[]> {
  private _dataset: TotalsData[];

  constructor(fieldsConfig: UserLogField[], totals?: TotalsData[]) {
    if (totals?.length) {
      this._dataset = totals;
    } else {
      let crossTotalFields: string[] = [];

      const totals = fieldsConfig.reduce((totals: TotalsData[], field) => {
        if (["Date", "Notes"].includes(field.label)) return totals;

        if (field?.options?.length) {
          field.options.forEach((option) => {
            if (option?.fields?.length) {
              const optionFields = option.fields.reduce(
                (optionFields: OptionField[], optionField) => {
                  if (optionField.type === "NUMBER") {
                    crossTotalFields.push(optionField.label);
                    optionFields.push(
                      new OptionField(
                        optionField.label,
                        0,
                        optionField.unit || "",
                      ),
                    );
                  }
                  return optionFields;
                },
                [],
              );
              totals.push(new TotalsData(option.label, 0, "", optionFields));
            }
          });
        } else {
          totals.push(
            new TotalsData(
              field.label,
              0,
              config.getlogInputType(field.type).unit || "",
            ),
          );
        }
        return totals;
      }, []);

      crossTotalFields = [
        ...new Set(
          crossTotalFields.filter((field, i, array) => {
            return array.indexOf(field) !== array.lastIndexOf(field);
          }),
        ),
      ];

      const crossTotals = totals.reduce((crossTotals: TotalsData[], field) => {
        if (field.fields.length) {
          field.fields.forEach((subField) => {
            if (crossTotalFields.includes(subField.label)) {
              crossTotals.push(
                new TotalsData(subField.label, 0, subField.unit),
              );
              crossTotalFields.splice(
                crossTotalFields.indexOf(subField.label),
                1,
              );
            }
          });
        }
        return crossTotals;
      }, []);

      this._dataset = [
        new TotalsData("Logs", 0, ""),
        ...totals,
        ...crossTotals,
      ];
    }
  }

  public get dataset() {
    return this._dataset;
  }

  public set dataset(value) {
    this._dataset = value;
  }

  add(log: Log) {
    this.calc("ADD", log);
  }

  subtract(log: Log) {
    this.calc("SUB", log);
  }

  private calc(mode: "ADD" | "SUB", log: Log) {
    this._dataset[0].total += mode === "ADD" ? 1 : -1;
    if (log.duration) {
      this._dataset[1].total += mode === "ADD" ? log.duration : -log.duration;
    }

    const totalField = this._dataset.find(
      (field) => field.label === log.training,
    );
    if (totalField) {
      totalField.total += mode === "ADD" ? 1 : -1;
      const logResults = JSON.parse(log.results);

      if (totalField?.fields?.length) {
        Object.keys(logResults).forEach((field) => {
          const logResultsFieldValue = Number(logResults[field].value);

          const totalSubField = totalField.fields?.find(
            (totalSubField) => totalSubField.label === field,
          );
          if (totalSubField) {
            totalSubField.total +=
              mode === "ADD" ? logResultsFieldValue : -logResultsFieldValue;
          }

          const crossTotalField = this._dataset.find(
            (totalField) => totalField.label === field,
          );
          if (crossTotalField) {
            crossTotalField.total +=
              mode === "ADD" ? logResultsFieldValue : -logResultsFieldValue;
          }
        });
      }
    }
  }

  format(): FormattedTotalsData[] {
    return this._dataset.map((field) => {
      let formattedField;
      if (field.unit === "hours") {
        formattedField = { ...field, total: hoursFloatToTime(field.total) };
      } else {
        formattedField = { ...field };
      }
      if (field.fields.length) {
        formattedField.fields = field.fields.map((subField) => {
          return { ...subField, total: onlyFloatToPrecision2(subField.total) };
        });
      }
      return formattedField;
    });
  }
}
