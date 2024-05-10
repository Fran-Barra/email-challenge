import * as sng from '@sendgrid/mail';
import {EmailProvider, EmailResponse, MailData} from '../EmailProvider';

export class SendgridEmailProvider implements EmailProvider {
    constructor() {
        const key = process.env.SENDGRID_API_KEY;
        if (key !== undefined) sng.setApiKey(key);
    }

    async sendEmail(mailData: MailData): Promise<EmailResponse> {
        const sngResponse: [sng.ClientResponse, {}] = await sng.sendMultiple({
            to: mailData.to,
            from: mailData.from,
            subject: mailData.subject,
            text: mailData.content,
        });
        return {status: sngResponse[0].statusCode};
    }
}
