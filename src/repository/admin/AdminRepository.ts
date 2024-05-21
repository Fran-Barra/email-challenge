import {Admin, CreateAdmin} from '../../dto/adminDTO';

export interface AdminRepository {
    addAdmin(admin: CreateAdmin): Promise<Admin>;
}
