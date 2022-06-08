import { Exercise } from "../models/user.exercise.schema";
import { Log } from "../models/user.log.schema";
import { Statistic } from "../models/user.statistic.schema";
import { Workout } from "../models/user.workout.schema";
import { FormattedTotalsData } from "../models/log-statistics/totals";

export type UserContentType = Log | Exercise | Workout;

export interface ExerciseRequest extends Exercise {
  captions: string[];
}

// This may contain formatted fields with differing types
export interface StatisticsResponse {
  totals: FormattedTotalsData[];
  proportions: Statistic["proportions"];
  timeline: Statistic["timeline"];
  months: Statistic["months"];
}

export interface ContentResponse {
  message: string;
  id: string;
  statistics: StatisticsResponse | string;
}
