import {
    User,
    UserCredentials,
    UserStats,
    UserWithPassword,
} from '../../dto/userDTO';
import {UserRepository} from './UserRepository';
import {PrismaClient} from '@prisma/client';

export class PrismaUserRepository implements UserRepository {
    readonly prisma: PrismaClient;

    constructor(client: PrismaClient) {
        this.prisma = client;
    }

    async addUser(user: UserCredentials): Promise<User> {
        return await this.prisma.user.create({
            data: {
                mail: user.mail,
                psw: user.psw,
            },
            select: {
                id: true,
                mail: true,
                mailsSendedInDay: true,
                lastDayOfMailsSended: true,
            },
        });
    }

    async increaseMailingInformationOrNot(
        id: number,
        increase: number,
        limit: number,
        today: Date
    ): Promise<boolean> {
        if (increase > limit) return false;

        const increased = await this.prisma.$transaction(async prisma => {
            const userData = await prisma.user.findUnique({
                where: {id: id},
                select: {mailsSendedInDay: true, lastDayOfMailsSended: true},
            });
            if (userData === null) throw Error(`not found user with id: ${id}`);

            if (userData.lastDayOfMailsSended !== today) {
                await prisma.user.update({
                    where: {id: id},
                    data: {
                        mailsSendedInDay: increase,
                        lastDayOfMailsSended: today,
                    },
                });
                return true;
            }

            if (userData.mailsSendedInDay + increase > limit) return false;
            await prisma.user.update({
                where: {id: id},
                data: {mailsSendedInDay: {increment: increase}},
            });
            return true;
        });
        return increased;
    }

    async decreaseMailsSended(id: number, decrease: number): Promise<any> {
        await this.prisma.user.update({
            where: {id: id},
            data: {mailsSendedInDay: {decrement: decrease}},
        });
    }

    async getUsersStatsOfTheDay(): Promise<UserStats[]> {
        return await this.prisma.user.findMany({
            where: {
                lastDayOfMailsSended: new Date(),
                mailsSendedInDay: {gt: 0},
            },
            select: {id: true, mail: true, mailsSendedInDay: true},
        });
    }

    async findUser(userMail: string): Promise<UserWithPassword | null> {
        return this.prisma.user.findUnique({
            where: {mail: userMail},
            select: {
                id: true,
                mail: true,
                psw: true,
            },
        });
    }
}
