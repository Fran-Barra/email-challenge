export interface UserSendEmailAuthorization {
    isAuthorized(
        userId: string,
        amountOfMailsToSend: number
    ): Promise<[success: boolean, yes: boolean, err: string]>;

    /**
     * If is authorized modifies data (for example mails sended), rollback should undo does changes.
     * Rollback is called when sending the emails fails.
     * @param userId the id of the user
     * @param amountOfMailsToRollBack the amount of mails that asked for authorization
     */
    rollBack(
        userId: string,
        amountOfMailsToRollBack: number
    ): Promise<[success: boolean, err: string]>;
}
