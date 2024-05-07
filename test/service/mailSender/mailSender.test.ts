import {MailData} from '../../../src/service/mailSender/EmailProbider';
import {MailSender} from '../../../src/service/mailSender/MailSender';
import {MockEmailProvider} from './mockMailSender';

const mailData = new MailData(
    'testSender@gamil.com',
    ['testReciver@gmail.com'],
    'this is a subject',
    'this is the content'
);

test('test change service on fail', async () => {
    const mailSender = new MailSender([
        new MockEmailProvider({status: 500}),
        new MockEmailProvider({status: 200}),
    ]);
    expect(await mailSender.sendEmail(mailData)).toBe(true);
});

test('test all servicies fail', async () => {
    const mailSender = new MailSender([
        new MockEmailProvider({status: 500}),
        new MockEmailProvider({status: 400}),
    ]);
    expect(await mailSender.sendEmail(mailData)).toBe(false);
});
