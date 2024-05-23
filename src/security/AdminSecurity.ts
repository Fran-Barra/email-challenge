import {compare, hash} from 'bcrypt';
import {Request, Response, NextFunction} from 'express';
import {JsonWebTokenError, TokenExpiredError, sign, verify} from 'jsonwebtoken';

import {AdminRepository} from '../repository/admin/AdminRepository';
import {HttpError} from '../errors/HttpError';
import {HttpStatus} from '../httpStatus';
import {AdminCredentials, AdminWithPsw} from '../dto/adminDTO';

export class AdminSecurity {
    private static readonly tokenPassword: string | undefined =
        process.env.ADMIN_PWS;

    static async encryptPassword(
        adminInfo: AdminCredentials
    ): Promise<AdminCredentials> {
        const encryptedPsw = await hash(adminInfo.psw, 15);
        return {
            mail: adminInfo.mail,
            psw: encryptedPsw,
        };
    }

    static async logInAdmin(
        adminInfo: AdminCredentials,
        repository: AdminRepository
    ): Promise<string | HttpError> {
        const admin: AdminWithPsw | null = await repository.findAdmin(
            adminInfo.mail
        );
        if (admin === null)
            return new HttpError(
                HttpStatus.NotFound,
                `no user with mail ${adminInfo.mail}`
            );

        if (!(await compare(adminInfo.psw, admin.psw)))
            return new HttpError(
                HttpStatus.Unauthorized,
                'mail or password is wrong'
            );

        if (this.tokenPassword === undefined)
            throw new Error('token password for admins not set on environment');

        const token = sign(
            {id: admin.id, mail: admin.mail},
            this.tokenPassword,
            {expiresIn: '1h'}
        );
        console.log(token);
        return token;
    }

    static async authorize(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.header('Authorization');
            if (!token)
                throw new HttpError(
                    HttpStatus.Unauthorized,
                    'missing authorization'
                );
            if (this.tokenPassword === undefined)
                throw new Error(
                    'token password for admins not set on environment'
                );

            verify(token, this.tokenPassword);
        } catch (err) {
            if (err instanceof TokenExpiredError)
                res.status(HttpStatus.Unauthorized).send({
                    message: 'token expired',
                    valid: false,
                });
            else if (err instanceof JsonWebTokenError)
                res.status(HttpStatus.Forbidden).send({
                    message: 'invalid token by authentication or shape',
                });
            next(err);
        }
    }
}
