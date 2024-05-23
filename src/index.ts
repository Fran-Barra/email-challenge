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
import {AdminController} from './controller/AdminController';
import {AdminAMB} from './service/admin/AdminAMB';
import {PrismaAdminRepository} from './repository/admin/PrismaAdminRepository';
import {AdminRepository} from './repository/admin/AdminRepository';
import {StatsController} from './controller/StatsController';
import {UserRepository} from './repository/user/UserRepository';
import {UserController} from './controller/UserController';
import {UserAMB} from './service/user/UserAMB';

//TODO: change considering NODE_ENV
dotenv.config({path: '.env'});
const prismaClient: PrismaClient = new PrismaClient();
const adminRepo: AdminRepository = new PrismaAdminRepository(prismaClient);
const userRepository: UserRepository = new PrismaUserRepository(prismaClient);

//TODO: change morgan to run as dev or as prod
const app = new App(Number(process.env.API_PORT), morgan('dev'), [
    //TODO: strange this, should the controller know the repo?
    new AdminController(new AdminAMB(adminRepo), adminRepo),
    new UserController(new UserAMB(userRepository)),
    new StatsController(userRepository),
    new EmailController(
        new UserMailSender(
            new UserSendEmailAuthorizationWithLimit(
                Number(process.env.EMAILS_LIMIT),
                userRepository
            ),
            new MailSender([
                new SendgridEmailProvider(),
                new MailgunEmailProvider(),
            ])
        )
    ),
]);
app.listen();
