import {NextFunction, Router, Request, Response} from 'express';
import {Controller} from './controller';
import {AdminAMB} from '../service/admin/AdminAMB';
import {HttpError} from '../errors/HttpError';
import {HttpStatus} from '../httpStatus';
import {AdminCredentials} from '../dto/adminDTO';

export class AdminController implements Controller {
    readonly path: string = '/admin';
    readonly router: Router = Router();
    readonly adminAMB: AdminAMB;

    constructor(adminAMB: AdminAMB) {
        this.adminAMB = adminAMB;

        this.router.route(`${this.path}`).post(this.postAdmin.bind(this));
    }
    async postAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.body.mail === undefined)
                throw new HttpError(
                    HttpStatus.BadRequest,
                    'requires mail in body'
                );
            if (req.body.psw === undefined)
                throw new HttpError(
                    HttpStatus.BadRequest,
                    'requires psw in body'
                );

            const adminData: AdminCredentials = req.body;
            const admin = await this.adminAMB.createAdmin(adminData);
            res.status(HttpStatus.Created).json(admin);
        } catch (e) {
            next(e);
        }
    }
}
