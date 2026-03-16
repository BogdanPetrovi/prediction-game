import { Request, Response, NextFunction } from "express";
import { DatabaseError } from "pg";
import { ErrorReply } from "redis";
import AppError from "./customErrorHandlers/appError.js";
import CloudflareError from "./customErrorHandlers/cloudflareError.js";

export default function globalErrorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
){
  if(err instanceof DatabaseError){
    console.error(err.message)
    return res.status(503).send(err.message)
  }
  if(err instanceof ErrorReply){
    console.error(err.message)
    return res.status(503).send(err.message)
  }
  if(err instanceof TypeError){
    console.error(err.message)
    return res.status(500).send(err.message)
  }
  if(err instanceof CloudflareError){
    console.log(err.timestamp + ' ' + err.message)
    return res.status(429).send(err.message)
  }
  if(err instanceof AppError){
    console.error(err.message)
    return res.status(err.statusCode).send(err.message)
  }
  if(err instanceof Error){
    console.error(err.message)
    return res.status(500).send(err.message)
  }

  return res.status(500).send('Unknown error\n' + err)
}