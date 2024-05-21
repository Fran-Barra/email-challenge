export interface SendEmailDTO {
    readonly to: string[];
    readonly subject: string;
    readonly content: string;
}
