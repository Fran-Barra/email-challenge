import mail = require('@sendgrid/mail');

export interface CreateUser {
    mail: string;
    psw: string;
}

export interface User {
    id: number;
    mail: string;
    mailsSendLastTime: number;
    lastDayOfMailsSended: Date;
}

export interface UserStats {
    id: number;
    mail: string;
    mailsSendedInDay: number;
}

export interface UserWithPassword {
    id: number;
    mail: string;
    psw: string;
    mailsSendedInDay: number;
    lastDayOfMailsSended: Date;
}
