import {Request, Response, NextFunction} from 'express';
import {HttpError} from './HttpError';
import {HttpStatus} from '../httpStatus';

export function errorMiddleware(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const InternalServerErrorMessage: String = 'something went wrong';
    console.log(err);
    if (err instanceof HttpError) {
        const status = err.status || HttpStatus.InternalServerError;
        const message = err.message || InternalServerErrorMessage;

        res.status(status).send({status: status, message: message});
    } else {
        res.status(HttpStatus.InternalServerError).send({
            status: HttpStatus.InternalServerError,
            message: InternalServerErrorMessage,
        });
    }
}
