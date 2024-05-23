import {NextFunction, Router, Request, Response} from 'express';
import {UserAMB} from '../service/user/UserAMB';
import {Controller} from './controller';
import {UserCredentials} from '../dto/userDTO';
import {HttpStatus} from '../httpStatus';
import {HttpError} from '../errors/HttpError';

export class UserController implements Controller {
    readonly path = '/user';
    readonly router = Router();
    private readonly userAMB: UserAMB;

    constructor(userAMB: UserAMB) {
        this.userAMB = userAMB;

        this.router.route(`${this.path}`).post(this.createUser.bind(this));
    }

    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userCredentials = UserController.getCredentials(req);
            await this.userAMB.createUser(userCredentials);
            res.status(HttpStatus.Created).send();
        } catch (err) {
            next(err);
        }
    }

    private static getCredentials(req: Request): UserCredentials {
        if (req.body.mail === undefined)
            throw new HttpError(HttpStatus.BadRequest, 'requires mail in body');
        if (req.body.psw === undefined)
            throw new HttpError(HttpStatus.BadRequest, 'requires psw in body');

        return req.body;
    }
}
