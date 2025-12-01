import { NextFunction, Request, Response } from "express";

// logger middle ware
const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}\n`);
  next();
};

export default logger;