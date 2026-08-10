import { Response } from "express";
import { CustomError } from "../utils/custom-error";
import ResponseEntity from "../utils/response";
import logger, { serviceExitingLog } from "../utils/logger";

export function handleError(res: Response, error: any, className: string, methodName: string) {

  logger.error(`Exception in ${methodName}: ${error.message}`);
  logger.info(serviceExitingLog(className, methodName));

  if (error instanceof CustomError) {
    return ResponseEntity.error(res, error.statusCode, error.message);
  }

  return ResponseEntity.error(res, 500, error.message || "Internal server error");
}
