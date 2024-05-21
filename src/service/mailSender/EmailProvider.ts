export interface EmailProvider {
    sendEmail(mailData: MailData): Promise<EmailResponse>;
}

export class MailData {
    readonly from: string;
    readonly to: string[];
    readonly subject: string;
    readonly content: string;

    constructor(from: string, to: string[], subject: string, content: string) {
        this.from = from;
        this.to = to;
        this.subject = subject;
        this.content = content;
    }
}

export interface EmailResponse {
    readonly status: number;
}
