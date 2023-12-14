import { Request, Response, NextFunction } from 'express';
abstract class CustomError extends Error {
    abstract statusCode: number;
  
    constructor(message: string) {
      super(message);
  
      Object.setPrototypeOf(this, CustomError.prototype);
    }
  
    abstract serializeErrors(): { message: string; field?: string }[];
  }
  
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  res.status(500).send({
    errors: [{ message: 'Something went wrong', stack: err.stack }],
  });
};
