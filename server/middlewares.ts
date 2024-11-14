import { NextFunction, Request, Response } from 'express';
import ErrorResponse from './interfaces/ErrorResponse';
import { prisma } from './libs/db';
import { StatusCodes } from 'http-status-codes';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
};

export const errorHandler = (err: Error, _: Request, res: Response<ErrorResponse>) =>{
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    errorMessage: err.message || 'Unknown Error',
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};


// Did not put user into req, since there is not auth. Ideally we set req.user on line 32.
export const checkUserExists = async  (req: Request, res:Response, next: NextFunction)=>{
  const user = await prisma.user.findFirst({
    where: {
      id: req.params.id,
    },
  });
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'User does not exists' });
  }

  next();
};