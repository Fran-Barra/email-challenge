import {CreateAdmin} from '../dto/adminDTO';
import {hash} from 'bcrypt';

export class AdminSecurity {
    static async encryptPassword(adminInfo: CreateAdmin): Promise<CreateAdmin> {
        const encryptedPsw = await hash(adminInfo.psw, 15);
        return {
            mail: adminInfo.mail,
            psw: encryptedPsw,
        };
    }
}
