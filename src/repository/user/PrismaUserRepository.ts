import {CreateUser, User, UserStats, UserWithPassword} from '../../dto/userDTO';
import {UserRepository} from './UserRepository';
import {PrismaClient} from '@prisma/client';

export class PrismaUserRepository implements UserRepository {
    readonly prisma: PrismaClient;

    constructor(client: PrismaClient) {
        this.prisma = client;
    }

    async addUser(user: CreateUser): Promise<User> {
        const response = await this.prisma.user.create({
            data: {
                mail: user.mail,
                psw: user.psw,
            },
        });
        return this.createUserFromPrimaUser(response);
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

    //TODO: remove this and use select in query
    private createUserFromPrimaUser(user: UserWithPassword): User {
        return {
            id: user.id,
            mail: user.mail,
            mailsSendLastTime: user.mailsSendedInDay,
            lastDayOfMailsSended: user.lastDayOfMailsSended,
        };
    }
}
