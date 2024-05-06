import { EmailProbider, EmailResponse, MailData } from "./EmailProbider";

export class MailSender {
    private readonly probiders: EmailProbider[];
    private actualProvider = 0;

    constructor(providers: EmailProbider[]) {
        this.probiders = providers;
    }

    /**
     * Try to send an email using other servicies if one fails.
     * @param mailData the data of the mail to send
     * @returns true if one of the mails was able to send, false if all the servicies are down
     */
    async sendEmail(mailData: MailData) : Promise<boolean> {
        const startingProvider = this.actualProvider;

        do {
            let res: EmailResponse = await this.probiders[this.actualProvider].sendEmail(mailData);
            if (res.status < 400) return true; 
            this.changeProvider();
        }
        while (startingProvider != this.actualProvider)
        
        return false;
    }

    private changeProvider() {
        this.actualProvider++;
        if (this.actualProvider == this.probiders.length) this.actualProvider = 0;
    }
}

