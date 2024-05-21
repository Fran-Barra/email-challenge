import {PrismaClient} from '@prisma/client';
import {Admin, CreateAdmin} from '../../dto/adminDTO';
import {AdminRepository} from './AdminRepository';

export class PrismaAdminRepository implements AdminRepository {
    readonly prisma: PrismaClient;
    constructor(client: PrismaClient) {
        this.prisma = client;
    }

    async addAdmin(admin: CreateAdmin): Promise<Admin> {
        return await this.prisma.administrator.create({
            data: admin,
            select: {id: true, mail: true},
        });
    }
}
