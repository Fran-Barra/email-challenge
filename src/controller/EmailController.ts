import {Request, Response, NextFunction, Router} from 'express';
import {Controller} from './controller';
import {UserMailSender} from '../service/mailSender/UserMailSender';
import {SendEmailDTO} from '../dto/sendEmailDTO';
import {MailData} from '../service/mailSender/EmailProvider';
import {HttpStatus} from '../httpStatus';
import {HttpError} from '../errors/HttpError';
import {UserSecurity} from '../security/UserSecurity';
import {JwtPayload} from 'jsonwebtoken';

export class EmailController implements Controller {
    readonly path: string = '/email';
    readonly router: Router = Router();
    readonly senderMail: string;

    readonly userMailSender: UserMailSender;

    constructor(sender: UserMailSender) {
        this.userMailSender = sender;
        const sen = process.env.MAIL_FROM;
        if (sen === undefined) throw Error('The env MAIL_FROM was not set');
        this.senderMail = sen;

        this.router.route(`${this.path}`);

        this.router
            .route(`${this.path}/send-email`)
            .post(UserSecurity.authorize, this.userSendEmail.bind(this));
    }

    private async userSendEmail(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        //TODO: change to get id of user from auth
        try {
            if (req.body.to === undefined)
                throw new HttpError(400, 'expected to in body');

            const emailReq: SendEmailDTO = req.body;
            const sessionInfo: JwtPayload = req.body
                .user_session_data as JwtPayload;

            const result = await this.userMailSender.userSendEmail(
                sessionInfo.id,
                new MailData(
                    this.senderMail,
                    emailReq.to,
                    emailReq.subject,
                    emailReq.content
                )
            );
            if (result[0]) res.status(HttpStatus.OK).send();
            else res.status(HttpStatus.InternalServerError).send(result[1]);
            //TODO: IS THIS REALLY AN INTERNAL SERVER ERROR, IT CAN BE CAUSED BY THE OTHER SERVICES
        } catch (err) {
            next(err);
        }
    }
}
