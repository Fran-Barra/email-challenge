import {AdminCredentials} from '../dto/adminDTO';
import {hash} from 'bcrypt';

export class AdminSecurity {
    static async encryptPassword(
        adminInfo: AdminCredentials
    ): Promise<AdminCredentials> {
        const encryptedPsw = await hash(adminInfo.psw, 15);
        return {
            mail: adminInfo.mail,
            psw: encryptedPsw,
        };
    }
}
