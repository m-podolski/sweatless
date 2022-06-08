import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from "@nestjs/common";

import { Response } from "express";
import { MongoError, MongoServerError } from "mongodb";

import { ErrorResponse } from "../dto/module.dto";

@Catch(MongoError)
export class MongoDbErrorFilter implements ExceptionFilter {
  private makeResponse(exception: MongoError): {
    status: HttpStatus;
    json: ErrorResponse;
  } {
    let status;
    let json;
    status = HttpStatus.INTERNAL_SERVER_ERROR;
    json = {
      statusCode: status,
      message: "Mongodb threw an unknown exception",
    };

    if (exception instanceof MongoServerError) {
      switch (exception.code) {
        case 2:
          status = HttpStatus.BAD_REQUEST;
          json = {
            statusCode: status,
            message: `Bad value in query (${exception.code}: ${exception.codeName})`,
          };
          break;
        case 11000:
          status = HttpStatus.BAD_REQUEST;
          json = {
            statusCode: status,
            message: `Value already exists (${exception.code}: ${exception.codeName})`,
            errors: exception.keyValue,
          };
          break;
        default:
          throw new Error("Unhandled MongoServerError", { cause: exception });
      }
    }

    return { status, json: { source: "mongodb", ...json } };
  }

  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const { status, json } = this.makeResponse(exception);
    response.status(status).json(json);
  }
}
