import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

export const validationHandler = (
  schema: ObjectSchema,
  property: "body" | "query" | "params"
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[property];
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      next({name: "ValidationError", error: error.details});
    }
    next();
  };
};
