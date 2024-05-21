import {MailData} from '../../../src/service/mailSender/EmailProvider';
import {MailgunEmailProvider} from '../../../src/service/mailSender/providers/mailgunProvider';
import {SendgridEmailProvider} from '../../../src/service/mailSender/providers/sendgridProvider';
import * as dotenv from 'dotenv';
dotenv.config({path: '.env.dev'});

const from = process.env.MAIL_FROM;
if (from === undefined) throw Error('define a sender in the .env.dev');

const to = process.env.TEST_MAIL;
if (to === undefined) throw Error('define TEST_MAIL in the .env.dev');

function generateMail(from: string, to: string[], provider: string) {
    return new MailData(
        from,
        to,
        `This is a test email from ${provider}`,
        'Hello'
    );
}

new SendgridEmailProvider()
    .sendEmail(generateMail(from, [to], 'sendgrid'))
    .then(result =>
        console.log(
            `sended ${from} to ${to} with sendgrid with result ${result.status}`
        )
    )
    .catch(e => console.log(e));

new MailgunEmailProvider()
    .sendEmail(generateMail(from, [to], 'mailgun'))
    .then(result =>
        console.log(
            `sended ${from} to ${to} with mailgun with result ${result.status}`
        )
    )
    .catch(e => console.log(e));
