import chalk from "chalk";

type Level = "INFO" | "WARN" | "ERROR";

const getTime = () => `[${new Date().toISOString()}]`;

const colors: Record<Level, (msg: string) => string> = {
  INFO: chalk.blue.bold,
  WARN: chalk.yellow.bold,
  ERROR: chalk.red.bold,
};

const log = (level: Level, message: any, ...rest: any[]) => {
  const time = chalk.gray(getTime());
  const levelTag = colors[level](`[${level}]`);

  console.log(time, levelTag, message, ...rest);
};

const logger = {
  info: (msg: any, ...rest: any[]) => log("INFO", msg, ...rest),
  warn: (msg: any, ...rest: any[]) => log("WARN", msg, ...rest),
  error: (msg: any, ...rest: any[]) => log("ERROR", msg, ...rest),
};

export const controllerExecutingLog =  (className:string, apiName:string):string => {
  return `Executing API ===> ClassName: ${className} ===> APIName: ${apiName}`;
}

export const serviceExecutingLog =  (className:string, methodName:string):string => {
  return `Executing method ===> ClassName: ${className}, MethodName: ${methodName}`;
}

export const serviceExitingLog =  (className:string, methodName:string):string => {
  return `===> Exiting method : ${className}, MethodName: ${methodName} with Exception`;
}

export default logger;
