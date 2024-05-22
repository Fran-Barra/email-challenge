import {UserRepository} from '../../repository/user/UserRepository';
import {UserSendEmailAuthorization} from './UserSendEmailAuthorization';

/**
 * Given a limit equal for all the users it will check if it is able to send more emails in the day.
 * This works more like a proxy between the repository since the repository has the validation logic
 */
export class UserSendEmailAuthorizationWithLimit
    implements UserSendEmailAuthorization
{
    readonly limit: number;
    readonly userRepository: UserRepository;

    constructor(limit: number, userRepository: UserRepository) {
        this.limit = limit;
        this.userRepository = userRepository;
    }

    async isAuthorized(
        userId: number,
        amountOfMailsToSend: number
    ): Promise<[success: boolean, yes: boolean, err: string]> {
        try {
            const result =
                await this.userRepository.increaseMailingInformationOrNot(
                    userId,
                    amountOfMailsToSend,
                    this.limit,
                    new Date()
                );
            return [true, result, ''];
        } catch (e) {
            if (e instanceof Error) {
                return [false, false, e.message];
            }
            console.log(e);
            return [false, false, 'unexpected error'];
        }
    }

    async rollBack(
        userId: number,
        amountOfMailsToRollBack: number
    ): Promise<[success: boolean, err: string]> {
        try {
            await this.userRepository.decreaseMailsSended(
                userId,
                amountOfMailsToRollBack
            );
            return [true, ''];
        } catch (e) {
            if (e instanceof Error) {
                return [false, e.message];
            }
            console.log(e);
            return [false, 'unexpected error'];
        }
    }
}
