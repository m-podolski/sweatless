import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FilesInterceptor } from "@nestjs/platform-express";

import { ContentService } from "../services/content.service";
import { ContentResponse, UserContentType } from "../dto/content.dto";
import { MongoDbErrorFilter } from "../middleware/mongo-error.filter";
import { MongooseErrorFilter } from "../middleware/mongooose-error.filter";
import { Exercise } from "../models/user.exercise.schema";
import { Log } from "../models/user.log.schema";
import { UserContentField } from "../models/user.schema";
import { Workout } from "../models/user.workout.schema";
import { StatisticMethod } from "../services/log-statistics.service";

@Controller("content")
@UseGuards(AuthGuard("jwt"))
@UseFilters(MongooseErrorFilter, MongoDbErrorFilter)
export class ContentController {
  constructor(private contentService: ContentService) {}

  private async create({
    field,
    userId,
    body,
    files,
    statisticMethod,
  }: {
    field: UserContentField;
    userId: string;
    body: UserContentType;
    files?: Array<Express.Multer.File>;
    statisticMethod?: StatisticMethod;
  }): Promise<ContentResponse> {
    const item = await this.contentService.create(
      field,
      userId,
      body,
      files,
      statisticMethod,
    );

    if (item === null) {
      throw new HttpException(
        `User content item of collection '${field}' could not be created`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      message: `User content item of collection '${field}' saved`,
      id: item.itemId,
      statistics: item.statistics,
    };
  }

  private async update({
    field,
    userId,
    itemId,
    body,
    files,
    statisticMethod,
  }: {
    field: UserContentField;
    userId: string;
    itemId: string;
    body: UserContentType;
    files?: Array<Express.Multer.File>;
    statisticMethod?: StatisticMethod;
  }): Promise<ContentResponse> {
    const item = await this.contentService.update(
      field,
      userId,
      itemId,
      body,
      files,
      statisticMethod,
    );

    if (item === null) {
      throw new HttpException(
        `User content item of collection '${field}' could not be updated`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      message: `User content item of collection '${field}' updated`,
      id: itemId,
      statistics: item.statistics,
    };
  }

  private async delete({
    field,
    userId,
    itemId,
    statisticMethod,
  }: {
    field: UserContentField;
    userId: string;
    itemId: string;
    statisticMethod?: StatisticMethod;
  }): Promise<ContentResponse> {
    const item = await this.contentService.delete(
      field,
      userId,
      itemId,
      statisticMethod,
    );

    if (item === null) {
      throw new HttpException(
        `User content item of collection '${field}' could not be deleted`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      message: `User content item of collection '${field}' deleted`,
      id: itemId,
      statistics: item.statistics,
    };
  }

  @Post(":userId/logs")
  async createLog(
    @Param("userId") userId: string,
    @Body() body: Log,
  ): Promise<ContentResponse> {
    return this.create({
      field: UserContentField.LOG,
      statisticMethod: StatisticMethod.POST,
      userId,
      body,
    });
  }

  @Post(":userId/exercises")
  @UseInterceptors(FilesInterceptor("files"))
  async createExercise(
    @Param("userId") userId: string,
    @Body() body: Exercise,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<ContentResponse> {
    return this.create({
      field: UserContentField.EXERCISE,
      userId,
      body,
      files,
    });
  }

  @Post(":userId/workouts")
  async createWorkout(
    @Param("userId") userId: string,
    @Body() body: Workout,
  ): Promise<ContentResponse> {
    return this.create({ field: UserContentField.WORKOUT, userId, body });
  }

  @Put(":userId/logs/:itemId")
  async updateLog(
    @Param("userId") userId: string,
    @Param("itemId") itemId: string,
    @Body() body: Log,
  ): Promise<ContentResponse> {
    return this.update({
      field: UserContentField.LOG,
      statisticMethod: StatisticMethod.PUT,
      userId,
      itemId,
      body,
    });
  }

  @Put(":userId/exercises/:itemId")
  @UseInterceptors(FilesInterceptor("files"))
  async updateExercise(
    @Param("userId") userId: string,
    @Param("itemId") itemId: string,
    @Body() body: Exercise,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<ContentResponse> {
    return this.update({
      field: UserContentField.EXERCISE,
      userId,
      itemId,
      body,
      files,
    });
  }

  @Put(":userId/workouts/:itemId")
  async updateWorkout(
    @Param("userId") userId: string,
    @Param("itemId") itemId: string,
    @Body() body: Workout,
  ): Promise<ContentResponse> {
    return this.update({
      field: UserContentField.WORKOUT,
      userId,
      itemId,
      body,
    });
  }

  @Delete(":userId/logs/:itemId")
  async deleteLog(
    @Param("userId") userId: string,
    @Param("itemId") itemId: string,
  ): Promise<ContentResponse> {
    return this.delete({
      field: UserContentField.LOG,
      statisticMethod: StatisticMethod.DELETE,
      userId,
      itemId,
    });
  }

  @Delete(":userId/exercises/:itemId")
  async deleteExercise(
    @Param("userId") userId: string,
    @Param("itemId") itemId: string,
  ): Promise<ContentResponse> {
    return this.delete({ field: UserContentField.EXERCISE, userId, itemId });
  }

  @Delete(":userId/workouts/:itemId")
  async deleteWorkout(
    @Param("userId") userId: string,
    @Param("itemId") itemId: string,
  ): Promise<ContentResponse> {
    return this.delete({ field: UserContentField.WORKOUT, userId, itemId });
  }
}
