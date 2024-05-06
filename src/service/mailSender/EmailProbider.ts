
export interface EmailProbider {
    sendEmail(mailData: MailData) : Promise<Response>
}

export class MailData {
    readonly from: String;
    readonly too: String[];
    readonly subject: String;
    readonly content: String;

    constructor(from: String, too: String[], subject: String, content: String) {
        this.from = from;
        this.too = too;
        this.subject = subject;
        this.content = content;
    }
}