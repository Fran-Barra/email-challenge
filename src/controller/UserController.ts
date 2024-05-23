import {NextFunction, Router, Request, Response} from 'express';
import {UserAMB} from '../service/user/UserAMB';
import {Controller} from './controller';
import {UserCredentials} from '../dto/userDTO';
import {HttpStatus} from '../httpStatus';
import {HttpError} from '../errors/HttpError';
import {UserSecurity} from '../security/UserSecurity';
import {UserRepository} from '../repository/user/UserRepository';

export class UserController implements Controller {
    readonly path = '/user';
    readonly router = Router();

    private readonly userAMB: UserAMB;
    private readonly userRepository: UserRepository;

    constructor(userAMB: UserAMB, userRepository: UserRepository) {
        this.userAMB = userAMB;
        this.userRepository = userRepository;

        this.router
            .route(`${this.path}`)
            .post(this.createUser.bind(this), this.logIn.bind(this));
        this.router.route(`${this.path}/logIn`).post(this.logIn.bind(this));
    }

    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userCredentials = UserController.getCredentials(req);
            await this.userAMB.createUser(userCredentials);
            next();
        } catch (err) {
            next(err);
        }
    }

    async logIn(req: Request, res: Response, next: NextFunction) {
        try {
            const userData = UserController.getCredentials(req);
            const result = await UserSecurity.logInUser(
                userData,
                this.userRepository
            );
            if (result instanceof HttpError) next(result);
            else res.status(HttpStatus.OK).send({jwt: result});
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
