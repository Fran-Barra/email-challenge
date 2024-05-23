import {Admin, AdminCredentials, AdminWithPsw} from '../../dto/adminDTO';

export interface AdminRepository {
    addAdmin(admin: AdminCredentials): Promise<Admin>;
    findAdmin(adminMail: string): Promise<AdminWithPsw | null>;
}
