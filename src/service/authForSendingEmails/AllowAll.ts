import {UserSendEmailAuthorization} from './UserSendEmailAuthorization';

export class AllowAll implements UserSendEmailAuthorization {
    isAuthorized(): Promise<[success: boolean, yes: boolean, err: string]> {
        return Promise.resolve([true, true, '']);
    }
    rollBack(): Promise<[success: boolean, err: string]> {
        return Promise.resolve([true, '']);
    }
}
