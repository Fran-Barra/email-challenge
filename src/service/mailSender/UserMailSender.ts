import {MailData} from './EmailProvider';
import {MailSender} from './MailSender';

export class UserMailSender {
    private readonly emailSender: MailSender;
    private readonly userAuthorizer: UserSendEmailAuthorization;

    constructor(
        userAuthorizer: UserSendEmailAuthorization,
        emailSender: MailSender
    ) {
        this.userAuthorizer = userAuthorizer;
        this.emailSender = emailSender;
    }

    public async userSendEmail(
        userId: string,
        emailData: MailData
    ): Promise<[success: boolean, err: string]> {
        const [success, authorized, err] =
            await this.userAuthorizer.isAuthorized(userId, emailData.to.length);
        if (!success) return [false, err];
        if (!authorized)
            return [false, 'the user is not authorized to send emails'];

        const sended = await this.emailSender.sendEmail(emailData);
        if (sended) return [true, ''];

        const [rbResult, rbErr] = await this.userAuthorizer.rollBack(
            userId,
            emailData.to.length
        );

        //TODO: manage error, try rollback later on,
        //for example if connection with db is down try to reconnect and try to execute rollback again,
        //try to save this issue in several ways, as las resource log the issue to a log so support can access it
        if (!rbResult)
            return [false, `error while executing rollback: ${rbErr}`];
        return [false, 'no service was available to send mails'];
    }
}

export interface UserSendEmailAuthorization {
    isAuthorized(
        userId: string,
        amountOfMailsToSend: number
    ): Promise<[success: boolean, yes: boolean, err: string]>;

    /**
     * If is authorized modifies data (for example mails sended), rollback should undo does changes.
     * Rollback is called when sending the emails fails.
     * @param userId the id of the user
     * @param amountOfMailsToRollBack the amount of mails that asked for authorization
     */
    rollBack(
        userId: string,
        amountOfMailsToRollBack: number
    ): Promise<[success: boolean, err: string]>;
}
