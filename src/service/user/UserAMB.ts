import {User, UserCredentials} from '../../dto/userDTO';
import {UserRepository} from '../../repository/user/UserRepository';
import {UserSecurity} from '../../security/UserSecurity';

export class UserAMB {
    private readonly repository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.repository = userRepository;
    }

    async createUser(userInfo: UserCredentials): Promise<User> {
        const encryptedInfo = await UserSecurity.encryptPassword(userInfo);
        return this.repository.addUser(encryptedInfo);
    }
}
