import {Admin, AdminCredentials} from '../../dto/adminDTO';
import {AdminRepository} from '../../repository/admin/AdminRepository';
import {AdminSecurity} from '../../security/AdminSecurity';

export class AdminAMB {
    private readonly adminRepository: AdminRepository;
    constructor(adminRepository: AdminRepository) {
        this.adminRepository = adminRepository;
    }

    async createAdmin(adminData: AdminCredentials): Promise<Admin> {
        const encryptedAdmin = await AdminSecurity.encryptPassword(adminData);
        return this.adminRepository.addAdmin(encryptedAdmin);
    }
}
