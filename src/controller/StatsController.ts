import {NextFunction, Router, Request, Response} from 'express';
import {Controller} from './controller';
import {UserRepository} from '../repository/user/UserRepository';
import {HttpStatus} from '../httpStatus';
import {AdminSecurity} from '../security/AdminSecurity';

export class StatsController implements Controller {
    readonly path: string = '/stats';
    readonly router: Router = Router();

    readonly userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
        this.router
            .route(`${this.path}`)
            .get(AdminSecurity.authorize, this.getStats.bind(this));
    }

    private async getStats(req: Request, res: Response, next: NextFunction) {
        try {
            const stats = await this.userRepository.getUsersStatsOfTheDay();
            res.status(HttpStatus.OK).json(stats);
        } catch (e) {
            next(e);
        }
    }
}
