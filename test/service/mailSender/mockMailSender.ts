import {
    EmailProbider,
    EmailResponse,
    MailData,
} from '../../../src/service/mailSender/EmailProbider';

export class MockEmailProvider implements EmailProbider {
    private readonly res: EmailResponse;

    constructor(res: EmailResponse) {
        this.res = res;
    }

    async sendEmail(mailData: MailData): Promise<EmailResponse> {
        return this.res;
    }
}
