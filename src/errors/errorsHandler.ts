import {Request, Response, NextFunction} from 'express';

export function errorMiddleware(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    throw new Error('error middleware not implemented');
}
