import {EmailProvider, EmailResponse, MailData} from './EmailProvider';

export class MailSender {
    private readonly providers: EmailProvider[];
    private actualProvider = 0;

    constructor(providers: EmailProvider[]) {
        this.providers = providers;
    }

    /**
     * Try to send an email using other services if one fails.
     * @param mailData the data of the mail to send
     * @returns true if one of the mails was able to send, false if all the services are down
     */
    async sendEmail(mailData: MailData): Promise<boolean> {
        const startingProvider = this.actualProvider;

        do {
            const res: EmailResponse =
                await this.providers[this.actualProvider].sendEmail(mailData);
            if (res.status < 400) return true;
            this.changeProvider();
        } while (startingProvider !== this.actualProvider);

        return false;
    }

    private changeProvider() {
        this.actualProvider++;
        if (this.actualProvider === this.providers.length)
            this.actualProvider = 0;
    }
}
