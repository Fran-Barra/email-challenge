import {MailData} from '../../../src/service/mailSender/EmailProvider';
import {SendgridEmailProvider} from '../../../src/service/mailSender/providers/sendgridProvider';
import * as dotenv from 'dotenv';
dotenv.config({path: '.env.dev'});

const from = process.env.MAIL_FROM;
if (from === undefined) throw Error('define a sender in the .env.dev');

const to = process.env.TEST_MAIL;
if (to === undefined) throw Error('define TEST_MAIL in the .env.dev');

const mailData = new MailData(from, [to], 'This is a test email', 'Hello');

new SendgridEmailProvider()
    .sendEmail(mailData)
    .then(() => console.log(`sended ${from} to ${to}`))
    .catch(e => console.log(e));
