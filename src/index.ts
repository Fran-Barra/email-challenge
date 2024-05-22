import {App} from './app';
import * as morgan from 'morgan';
import * as dotenv from 'dotenv';
import {EmailController} from './controller/EmailController';
import {UserMailSender} from './service/mailSender/UserMailSender';
import {AllowAll} from './service/authForSendingEmails/AllowAll';
import {MailSender} from './service/mailSender/MailSender';
import {SendgridEmailProvider} from './service/mailSender/providers/sendgridProvider';
import {MailgunEmailProvider} from './service/mailSender/providers/mailgunProvider';
import {UserSendEmailAuthorizationWithLimit} from './service/authForSendingEmails/UserSendEmailWithLimit';
import {PrismaUserRepository} from './repository/user/PrismaUserRepository';
import {PrismaClient} from '@prisma/client';

//TODO: change considering NODE_ENV
dotenv.config({path: '.env'});
const prismaClient: PrismaClient = new PrismaClient();
//TODO: change morgan to run as dev or as prod
const app = new App(Number(process.env.API_PORT), morgan('dev'), [
    new EmailController(
        new UserMailSender(
            new UserSendEmailAuthorizationWithLimit(
                Number(process.env.EMAILS_LIMIT),
                new PrismaUserRepository(prismaClient)
            ),
            new MailSender([
                new SendgridEmailProvider(),
                new MailgunEmailProvider(),
            ])
        )
    ),
]);
app.listen();
