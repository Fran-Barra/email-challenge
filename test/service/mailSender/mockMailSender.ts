import {
    EmailProvider,
    EmailResponse,
    MailData,
} from '../../../src/service/mailSender/EmailProvider';

export class MockEmailProvider implements EmailProvider {
    private readonly res: EmailResponse;

    constructor(res: EmailResponse) {
        this.res = res;
    }

    async sendEmail(): Promise<EmailResponse> {
        return this.res;
    }
}
