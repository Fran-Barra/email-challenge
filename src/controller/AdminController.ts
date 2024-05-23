import {NextFunction, Router, Request, Response} from 'express';
import {Controller} from './controller';
import {AdminAMB} from '../service/admin/AdminAMB';
import {HttpError} from '../errors/HttpError';
import {HttpStatus} from '../httpStatus';
import {AdminCredentials} from '../dto/adminDTO';
import {AdminSecurity} from '../security/AdminSecurity';
import {AdminRepository} from '../repository/admin/AdminRepository';

export class AdminController implements Controller {
    readonly path: string = '/admin';
    readonly router: Router = Router();

    readonly adminAMB: AdminAMB;
    readonly adminRepository: AdminRepository;

    constructor(adminAMB: AdminAMB, adminRepository: AdminRepository) {
        this.adminAMB = adminAMB;
        this.adminRepository = adminRepository;

        this.router.route(`${this.path}`).post(this.postAdmin.bind(this));
        this.router.route(`${this.path}/logIn`).post(this.logIn.bind(this));
    }
    async postAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const adminData = AdminController.getCredentials(req);
            const admin = await this.adminAMB.createAdmin(adminData);
            res.status(HttpStatus.Created).json(admin);
        } catch (e) {
            next(e);
        }
    }

    async logIn(req: Request, res: Response, next: NextFunction) {
        try {
            const adminData = AdminController.getCredentials(req);
            const result = await AdminSecurity.logInAdmin(
                adminData,
                this.adminRepository
            );
            if (result instanceof HttpError) next(result);
            else res.status(HttpStatus.OK).send({jwt: result});
        } catch (err) {
            next(err);
        }
    }

    private static getCredentials(req: Request): AdminCredentials {
        if (req.body.mail === undefined)
            throw new HttpError(HttpStatus.BadRequest, 'requires mail in body');
        if (req.body.psw === undefined)
            throw new HttpError(HttpStatus.BadRequest, 'requires psw in body');

        return req.body;
    }
}
