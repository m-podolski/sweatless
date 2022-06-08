import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from "@nestjs/common";

import { Response } from "express";
import { Error as MongooseBaseError, MongooseError } from "mongoose";

import { ErrorResponse } from "../dto/module.dto";

@Catch(MongooseBaseError)
export class MongooseErrorFilter implements ExceptionFilter {
  private makeResponse(exception: MongooseError): {
    status: HttpStatus;
    json: ErrorResponse;
  } {
    let status;
    let json;
    status = HttpStatus.BAD_REQUEST;
    json = {
      statusCode: status,
      message: "Unhandled exception",
    };

    if (exception instanceof MongooseBaseError.ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      json = {
        statusCode: status,
        message: "Validation failed",
        errors: exception.errors,
      };
    } else {
      throw new Error("Unhandled MongooseError", {
        cause: exception,
      });
    }

    return { status, json: { source: "mongoose", ...json } };
  }

  catch(exception: MongooseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const { status, json } = this.makeResponse(exception);
    response.status(status).json(json);
  }
}
