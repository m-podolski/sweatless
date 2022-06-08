import { Injectable } from "@nestjs/common";

import { User } from "../models/user.schema";
import { Log } from "src/users/models/user.log.schema";
import { Statistic } from "../models/user.statistic.schema";
import { Months } from "../models/log-statistics/months";
import { Proportions } from "../models/log-statistics/proportions";
import { Timeline } from "../models/log-statistics/timeline";
import { FormattedTotalsData, Totals } from "../models/log-statistics/totals";

export interface LogStatisticCalculator<T> {
  dataset: T;
  add:
    | ((log: Log) => void)
    | ((currentLogsCount: number, trainingType: string) => void);
  subtract:
    | ((log: Log) => void)
    | ((currentLogsCount: number, trainingType: string) => void);
  format?: () => FormattedTotalsData[];
}

export enum StatisticMethod {
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

interface LogStatisticsServiceReturn {
  totals: Statistic["totals"];
  totalsFormatted: FormattedTotalsData[];
  proportions: Statistic["proportions"];
  timeline: Statistic["timeline"];
  months: Statistic["months"];
}

@Injectable()
export class LogStatisticsService {
  update(
    user: User,
    logId: string | null,
    log: Log | null,
    method: StatisticMethod,
  ): LogStatisticsServiceReturn {
    const trainingOptions = user.settings.logs.fields[2].options;

    // Length-checks are necessary because incoming model always has empty fields
    const totals = new Totals(
      user.settings.logs.fields,
      user?.statistics?.totals,
    );
    const proportions = new Proportions(
      trainingOptions ? trainingOptions : [],
      user?.statistics?.proportions,
    );
    const timeline = new Timeline(user?.statistics?.timeline);
    const months = new Months(
      trainingOptions ? trainingOptions : [],
      user.settings.statistics.diagrams.months.plottedField,
      user?.statistics?.months,
    );

    let prevLog;
    if (logId !== null)
      prevLog = user.logs.find((log) => log._id?.toString() === logId);
    let prevLogsCount = user.logs.length;

    switch (method) {
      case StatisticMethod.DELETE:
        if (prevLog) {
          totals.subtract(prevLog);
          proportions.subtract(prevLogsCount, prevLog.training);
          timeline.subtract(prevLog);
          months.subtract(prevLog);
        }
        break;
      case StatisticMethod.PUT:
        if (prevLog) {
          totals.subtract(prevLog);
          proportions.subtract(prevLogsCount, prevLog.training);
          prevLogsCount += -1;
          timeline.subtract(prevLog);
          months.subtract(prevLog);
        }
      case StatisticMethod.POST:
        if (log) {
          totals.add(log);
          proportions.add(prevLogsCount, log.training);
          timeline.add(log);
          months.add(log);
        }
        break;
    }
    proportions.cumulate();

    return {
      totals: totals.dataset,
      totalsFormatted: totals.format(),
      proportions: proportions.dataset,
      timeline: timeline.dataset,
      months: months.dataset,
    };
  }

  recalculate(user: User): LogStatisticsServiceReturn {
    const trainingOptions = user.settings.logs.fields[2].options;

    const totals = new Totals(user.settings.logs.fields);
    const proportions = new Proportions(trainingOptions ? trainingOptions : []);
    const timeline = new Timeline();
    const months = new Months(
      trainingOptions ? trainingOptions : [],
      user.settings.statistics.diagrams.months.plottedField,
    );

    for (const log of user.logs) {
      totals.add(log);
      proportions.add(user.logs.length, log.training);
      timeline.add(log);
      months.add(log);
    }
    proportions.cumulate();

    return {
      totals: totals.dataset,
      totalsFormatted: totals.format(),
      proportions: proportions.dataset,
      timeline: timeline.dataset,
      months: months.dataset,
    };
  }
}
