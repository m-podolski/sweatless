import { Log } from "src/users/models/user.log.schema";
import { LogStatisticCalculator } from "../../services/log-statistics.service";
import { dateTime } from "../../services/utilities/date-time";

class TimelineData {
  name: string;
  date: string;
  constructor(name = "", date = "") {
    this.name = name;
    this.date = date;
  }
}

export class Timeline implements LogStatisticCalculator<TimelineData[]> {
  private _dataset: TimelineData[] = [];
  scale = 30;

  constructor(timeline?: TimelineData[]) {
    if (timeline?.length) {
      this._dataset = timeline;
    } else {
      for (let i = 0; i < this.scale; i++) {
        this._dataset[i] = new TimelineData();
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
    const diff = new Date().getTime() - logDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const index = this._dataset.length - 1 - days;

    if (days < this.scale) {
      if (mode === "ADD") {
        this._dataset[index] = new TimelineData(
          log.training,
          dateTime({ mode: "DATE", date: logDate }),
        );
      } else {
        this._dataset[index] = new TimelineData();
      }
    }
  }
}
