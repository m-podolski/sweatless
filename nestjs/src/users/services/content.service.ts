import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Model } from "mongoose";

import { ExerciseRequest, UserContentType } from "../dto/content.dto";
import { Exercise } from "../models/user.exercise.schema";
import { Log } from "../models/user.log.schema";
import {
  name as userSchemaName,
  User,
  UserContentField,
  UserDocContentFields,
} from "../models/user.schema";
import {
  LogStatisticsService,
  StatisticMethod,
} from "./log-statistics.service";

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(userSchemaName) private userModel: Model<User>,
    private logStatsService: LogStatisticsService,
  ) {}

  private captionFiles(
    body: ExerciseRequest,
    files: Array<Express.Multer.File>,
  ): Exercise {
    if (files) {
      const captionedFiles = files.map((file, i) => {
        const fileData = {
          path: file.path,
          displayName: file.originalname,
          caption: "",
        };
        fileData.caption = body.captions[i];
        return fileData;
      });
      body.files = captionedFiles;
    }
    return body;
  }

  async create(
    field: UserContentField,
    userId: string,
    body: UserContentType,
    files?: Array<Express.Multer.File>,
    statisticMethod?: StatisticMethod,
  ) {
    const user = await this.userModel.findById(userId);

    // Statistics are calculated BEFORE modifying the logs list to be consistent with "delete" where doing the statistics-update after the fact would be less readable. The statistics service depends on the order.
    if (user !== null) {
      let newStatistics;
      if (
        field === UserContentField.LOG &&
        statisticMethod === StatisticMethod.POST
      ) {
        newStatistics = this.logStatsService.update(
          user.toObject(),
          null,
          body as Log,
          statisticMethod,
        );
        user.statistics = {
          totals: newStatistics.totals,
          proportions: newStatistics.proportions,
          timeline: newStatistics.timeline,
          months: newStatistics.months,
        };
      }

      if (field === UserContentField.EXERCISE && files) {
        body = this.captionFiles(body as ExerciseRequest, files);
      }

      const userField: UserDocContentFields = user[field];
      userField.push(body);
      const subDoc = userField[userField.length - 1];

      await user.save();
      return {
        itemId: subDoc._id ? subDoc._id.toString() : "",
        statistics: newStatistics
          ? {
              totals: newStatistics.totalsFormatted,
              proportions: newStatistics.proportions,
              timeline: newStatistics.timeline,
              months: newStatistics.months,
            }
          : "not available",
      };
    }
    return null;
  }

  async update(
    field: UserContentField,
    userId: string,
    itemId: string,
    body: UserContentType,
    files?: Array<Express.Multer.File>,
    statisticMethod?: StatisticMethod,
  ) {
    const user = await this.userModel.findById(userId);

    if (user !== null) {
      let newStatistics;
      if (
        field === UserContentField.LOG &&
        statisticMethod === StatisticMethod.PUT
      ) {
        newStatistics = this.logStatsService.update(
          user,
          itemId,
          body as Log,
          statisticMethod,
        );
        user.statistics = {
          totals: newStatistics.totals,
          proportions: newStatistics.proportions,
          timeline: newStatistics.timeline,
          months: newStatistics.months,
        };
      }

      if (field === UserContentField.EXERCISE && files) {
        body = this.captionFiles(body as ExerciseRequest, files);
      }

      const userField = user[field];
      const item = userField.id(itemId);

      Object.keys(body).forEach((field) => {
        item?.set(`${field}`, body[field as keyof UserContentType]);
      });

      await user.save();
      return {
        statistics: newStatistics
          ? {
              totals: newStatistics.totalsFormatted,
              proportions: newStatistics.proportions,
              timeline: newStatistics.timeline,
              months: newStatistics.months,
            }
          : "not available",
      };
    }
    return null;
  }

  async delete(
    field: UserContentField,
    userId: string,
    itemId: string,
    statisticMethod?: StatisticMethod,
  ) {
    const user = await this.userModel.findById(userId);

    if (user !== null) {
      const userField = user[field];
      const item = userField.id(itemId);
      let newStatistics;

      if (item !== null) {
        if (
          field === UserContentField.LOG &&
          statisticMethod === StatisticMethod.DELETE
        ) {
          newStatistics = this.logStatsService.update(
            user,
            itemId,
            null,
            statisticMethod,
          );
          user.statistics = {
            totals: newStatistics.totals,
            proportions: newStatistics.proportions,
            timeline: newStatistics.timeline,
            months: newStatistics.months,
          };
        }
        item.remove();
      }

      await user.save();
      return {
        statistics: newStatistics
          ? {
              totals: newStatistics.totalsFormatted,
              proportions: newStatistics.proportions,
              timeline: newStatistics.timeline,
              months: newStatistics.months,
            }
          : "not available",
      };
    }
    return null;
  }
}
