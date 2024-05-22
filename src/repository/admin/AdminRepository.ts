import {Admin, AdminCredentials} from '../../dto/adminDTO';

export interface AdminRepository {
    addAdmin(admin: AdminCredentials): Promise<Admin>;
}
