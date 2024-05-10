import * as mailgun from 'mailgun-js';
import {EmailProvider, EmailResponse, MailData} from '../EmailProvider';

export class MailgunEmailProvider implements EmailProvider {
    private readonly mailgun;

    constructor() {
        const key = process.env.MAILGUN_API_KEY;
        if (key === undefined) return;
        const dom = process.env.MAILGUN_DOMAIN;
        if (dom === undefined) return;
        this.mailgun = mailgun({apiKey: key, domain: dom});
    }

    async sendEmail(mailData: MailData): Promise<EmailResponse> {
        if (this.mailgun === undefined) return {status: 500};
        try {
            await this.mailgun.messages().send({
                from: mailData.from,
                to: mailData.to.join(','),
                subject: mailData.subject,
                text: mailData.content,
            });
            return {status: 200};
        } catch (E) {
            //TODO: the status of the error is not know, it may be caused by the sender or the server
            //consider adding a log of error to report why was the reason of changing the email provider
            return {status: 500};
        }
    }
}
