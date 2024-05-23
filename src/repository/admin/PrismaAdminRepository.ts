import {PrismaClient} from '@prisma/client';
import {Admin, AdminCredentials, AdminWithPsw} from '../../dto/adminDTO';
import {AdminRepository} from './AdminRepository';

export class PrismaAdminRepository implements AdminRepository {
    readonly prisma: PrismaClient;
    constructor(client: PrismaClient) {
        this.prisma = client;
    }

    async addAdmin(admin: AdminCredentials): Promise<Admin> {
        return await this.prisma.administrator.create({
            data: admin,
            select: {id: true, mail: true},
        });
    }

    async findAdmin(adminMail: string): Promise<AdminWithPsw | null> {
        return await this.prisma.administrator.findUnique({
            where: {mail: adminMail},
            select: {id: true, mail: true, psw: true},
        });
    }
}
