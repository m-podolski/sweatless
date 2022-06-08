import { UserTrainingOption } from "src/users/models/user.schema";
import { LogStatisticCalculator } from "../../services/log-statistics.service";

class ProportionsData {
  label: string;
  count = 0;
  percent = 0;
  cumulated = 0;
  constructor(label: string) {
    this.label = label;
  }
}

export class Proportions implements LogStatisticCalculator<ProportionsData[]> {
  private _dataset: ProportionsData[];

  constructor(
    fieldsConfig: UserTrainingOption[],
    proportions?: ProportionsData[],
  ) {
    if (proportions?.length) {
      this._dataset = proportions;
    } else {
      this._dataset = fieldsConfig.reduce(
        (proportions: ProportionsData[], field) => {
          proportions.push(new ProportionsData(field.label));
          return proportions;
        },
        [],
      );
    }
  }

  get dataset() {
    return this._dataset;
  }

  set dataset(value) {
    this._dataset = value;
  }

  add(currentLogsCount: number, trainingType: string) {
    this.calc("ADD", currentLogsCount, trainingType);
  }

  subtract(currentLogsCount: number, trainingType: string) {
    this.calc("SUB", currentLogsCount, trainingType);
  }

  private calc(
    mode: "ADD" | "SUB",
    currentLogsCount: number,
    trainingType: string,
  ) {
    const training = this._dataset.find(
      (field) => field.label === trainingType,
    );
    const logsCount =
      mode === "ADD" ? currentLogsCount + 1 : currentLogsCount - 1;
    if (training) training.count += mode === "ADD" ? 1 : -1;
    this._dataset.forEach((field) => {
      field.percent =
        field.count === 0 && logsCount === 0 // prevents division by zero / NaN
          ? 0
          : Math.round((field.count / logsCount) * 100);
    });
  }

  cumulate() {
    this._dataset.forEach((field, i, array) => {
      field.cumulated = i === 0 ? 0 : field.percent + array[i - 1].cumulated;
    });
  }
}
