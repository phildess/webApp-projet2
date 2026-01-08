import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      status: 'error',
    });
  }

  // Erreur Prisma
  if (err.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      error: 'Erreur de base de données',
      status: 'error',
    });
  }

  // Erreur de validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: err.message,
      status: 'error',
    });
  }

  // Erreur inconnue
  return res.status(500).json({
    error: 'Une erreur interne est survenue',
    status: 'error',
  });
};
