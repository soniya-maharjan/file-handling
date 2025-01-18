import { NextFunction, Request, Response } from "express";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error: ", err);
  if (err.name === "ValidationError") {
    const errors = err?.error?.reduce((acc: any, error: any) => {
      const formattedMessage = error.replace(
        /"([^"]+)"/g,
        (_: any, word: any) => `${word[0].toUpperCase()} + ${word.slice(1)}`
      );
      if (error.context) {
        const key =
          typeof error.context.key === "number"
            ? error.context.label
            : error.context.key;
        acc[key] = formattedMessage;
      }
      return acc;
    }, {});
    res.status(400).json({
      success: false,
      err,
    });
    return;
  }
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message || "An unexpected error occured",
  });
  return;
};

export default errorHandler;
