import { Error } from "mongoose";

interface MongooseErrorList {
  [path: string]: Error.ValidatorError | Error.CastError;
}

interface MongoErrorList {
  [key: string]: string;
}

export interface ErrorResponse {
  statusCode: number;
  source?: "mongodb" | "mongoose";
  message: string;
  errors?: MongooseErrorList | MongoErrorList;
}
