import {CreateUser, User} from '../../dto/userDTO';

export interface UserRepository {
    addUser(user: CreateUser): Promise<User>;

    /**
     * Tries to find the user with the id, throw an error if failed.
     * If founded then it will check if the user does not pass the limit.
     * If the limit is passed it will return false, otherwise true as it was successful
     * @param id the id of the user
     * @param increase the amount of mails sended increase
     * @param limit the limit of mails for the user
     * @param today the date
     */
    increaseMailingInformationOrNot(
        id: number,
        increase: number,
        limit: number,
        today: Date
    ): Promise<Boolean>;

    /**
     * decrease the emails sended in the day of the user
     * @param id the id of the user
     * @param decrease the amount to decrease the counter
     */
    decreaseMailsSended(id: number, decrease: number): Promise<any>;
}
