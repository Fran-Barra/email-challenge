import {compare, hash} from 'bcrypt';
import {Request, Response, NextFunction} from 'express';
import {
    JsonWebTokenError,
    JwtPayload,
    TokenExpiredError,
    sign,
    verify,
} from 'jsonwebtoken';

import {HttpError} from '../errors/HttpError';
import {HttpStatus} from '../httpStatus';
import {UserCredentials, UserWithPassword} from '../dto/userDTO';
import {UserRepository} from '../repository/user/UserRepository';

export class UserSecurity {
    static async encryptPassword(
        userInfo: UserCredentials
    ): Promise<UserCredentials> {
        const encryptedPsw = await hash(userInfo.psw, 10);
        return {
            mail: userInfo.mail,
            psw: encryptedPsw,
        };
    }

    static async logInUser(
        userInfo: UserCredentials,
        repository: UserRepository
    ): Promise<string | HttpError> {
        const user: UserWithPassword | null = await repository.findUser(
            userInfo.mail
        );

        if (user === null)
            return new HttpError(
                HttpStatus.NotFound,
                `no user with mail ${userInfo.mail}`
            );

        if (!(await compare(userInfo.psw, user.psw)))
            return new HttpError(
                HttpStatus.Unauthorized,
                'mail or password is wrong'
            );

        const tokenPassword = process.env.USER_PWS;
        if (tokenPassword === undefined)
            throw new Error('token password for users not set on environment');

        const token = sign({id: user.id, mail: user.mail}, tokenPassword, {
            expiresIn: '1h',
        });
        return token;
    }

    static async authorize(req: Request, res: Response, next: NextFunction) {
        try {
            const tokenWithBearer = req.header('Authorization');
            if (!tokenWithBearer)
                throw new HttpError(
                    HttpStatus.Unauthorized,
                    'missing authorization'
                );

            const split = tokenWithBearer.split(' ');
            if (split.length !== 2) {
                throw new HttpError(
                    HttpStatus.BadRequest,
                    'Authorization requires: bearer <token>'
                );
            }
            const token = split[1];

            const tokenPassword = process.env.USER_PWS;
            if (tokenPassword === undefined) {
                throw new Error(
                    'token password for users not set on environment'
                );
            }

            req.body.user_session_data = verify(
                token,
                tokenPassword
            ) as JwtPayload;
            next();
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
