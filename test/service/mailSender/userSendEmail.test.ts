import {UserSendEmailAuthorization} from '../../../src/service/authForSendingEmails/UserSendEmailAuthorization';
import {MailData} from '../../../src/service/mailSender/EmailProvider';
import {MailSender} from '../../../src/service/mailSender/MailSender';
import {UserMailSender} from '../../../src/service/mailSender/UserMailSender';
import {MockEmailProvider} from './mockMailSender';

const mailData = new MailData(
    'testSender@gamil.com',
    ['testReciver@gmail.com'],
    'this is a subject',
    'this is the content'
);

test('send email if authorized', async () => {
    const userMailSender = new UserMailSender(
        new MockUserMailSender([true, true, ''], [true, '']),
        new MailSender([new MockEmailProvider({status: 200})])
    );
    const expected = [true, ''];
    expect(await userMailSender.userSendEmail(1, mailData)).toEqual(expected);
});

test('send email, when no service available, then return false with error message', async () => {
    const userMailSender = new UserMailSender(
        new MockUserMailSender([true, true, ''], [true, '']),
        new MailSender([new MockEmailProvider({status: 500})])
    );
    const expected = [false, 'no service was available to send mails'];
    expect(await userMailSender.userSendEmail(1, mailData)).toEqual(expected);
});

test('send email and user is not authorized to send the email then return false', async () => {
    const authResult: [success: boolean, yes: boolean, err: string] = [
        true,
        false,
        '',
    ];
    const userMailSender = new UserMailSender(
        new MockUserMailSender(authResult, [true, '']),
        new MailSender([new MockEmailProvider({status: 500})])
    );
    const expected = [false, 'the user is not authorized to send emails'];
    expect(await userMailSender.userSendEmail(1, mailData)).toEqual(expected);
});

class MockUserMailSender implements UserSendEmailAuthorization {
    readonly isAuth: [success: boolean, yes: boolean, err: string];
    readonly rollB: [success: boolean, err: string];

    constructor(
        isAuthorizedResult: [success: boolean, yes: boolean, err: string],
        rollbackResult: [success: boolean, err: string]
    ) {
        this.isAuth = isAuthorizedResult;
        this.rollB = rollbackResult;
    }

    async isAuthorized(): Promise<
        [success: boolean, yes: boolean, err: string]
    > {
        return this.isAuth;
    }

    async rollBack(): Promise<[success: boolean, err: string]> {
        return this.rollB;
    }
}
