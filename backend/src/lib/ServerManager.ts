export default class ServerManager {
    private connectedUsers: ConnectedUser[];
    private spritesList: PlayerMetadata[];
    public activeLobbies: Set<string>;

    constructor() {
        this.connectedUsers = [];
        this.spritesList = [];
        this.activeLobbies = new Set();
    }

    // ADD METHODS
    addConnectedUser(cu: ConnectedUser) {
        this.connectedUsers.push(cu);
    }

    addUserToSpritesList(user: PlayerMetadata) {
        this.spritesList.push(user);
    }

    // REMOVE METHODS
    removeConnectedUser(uid: UserID) {
        const index = this.connectedUsers.findIndex((user) => user.id === uid);
        if (index === -1) {
            console.log(
                `failed to find a user id:${uid} in the connectedUsers array`,
            );
            return undefined;
        }
        return this.connectedUsers.splice(index, 1)[0];
    }

    removeUserFromSpritesList(uid: UserID) {
        const index = this.spritesList.findIndex((user) =>
            user.user_id === uid
        );
        if (index === -1) {
            console.log(
                `failed to find a user id:${uid} in the spritesList array`,
            );
            return;
        }
        this.spritesList.splice(index, 1);
    }

    // GETTERS
    getConnectedUserIndexByID(uid: UserID) {
        return this.connectedUsers.findIndex((user) => user.id === uid);
    }

    getConnectedUserIndexBySocketID(socketID: string) {
        return this.connectedUsers.findIndex((user) =>
            user.socket.id === socketID
        );
    }

    getConnectedUserByID(uid: UserID) {
        return this.connectedUsers.find((user) => user.id === uid);
    }

    getConnectedUserBySocketID(socketID: string) {
        return this.connectedUsers.find((user) => user.socket.id === socketID);
    }

    getSpriteByUserID(uid: UserID) {
        return this.spritesList.find((spr) => spr.user_id === uid);
    }

    getSpriteIndexByUserID(uid: UserID) {
        return this.spritesList.findIndex((spr) => spr.user_id === uid);
    }

    // MISC / HELPERS

    /**
     * @param usr user type data to update
     */
    updateSpriteInList(usr: PlayerMetadata) {
        const index = this.spritesList.findIndex((e) =>
            e.user_id === usr.user_id
        );
        if (index === -1) return;
        // globalUsersList[index] = msg; TEST THIS
        this.spritesList[index].position.x = usr.position.x;
        this.spritesList[index].position.y = usr.position.y;
        this.spritesList[index].currentAnimation = usr.currentAnimation;
        this.spritesList[index].currentTexture = usr.currentTexture;
        this.spritesList[index].flipX = usr.flipX;
    }

    /**
     * Used to toggle user in game status, indicating whether or not the user is in the game and not just lobby.
     * Returns true upon successful update of player data else false
     * @param inGame boolean indicating whether or not user is in game
     * @param uid users id to search for
     */
    setUserInGame(inGame: boolean, uid: UserID): boolean {
        const sprIndex = this.getSpriteIndexByUserID(uid);
        if (sprIndex === -1) return false;
        this.spritesList[sprIndex].inGame = inGame;
        return true;
    }

    /**
     * @param msg type that holds a list of all users in the lobby and the users currently in the game
     * @param _user connected user type holding user id needed
     * @param lobbyName name of the lobby to query for users in
     */
    populateLobbyResponseEvent(
        msg: JoinLobbyResponseMessage,
        _user: ConnectedUser,
        lobbyName: string,
    ) {
        // get the ids of the users in the lobby
        const userIds = this.connectedUsers.filter((user) =>
            user.lobby === lobbyName && user.id !== _user.id
        ).map((user) => user.id);

        // go through all the connected players char data
        this.spritesList.forEach((spr) => {
            if (userIds.includes(spr.user_id)) { // find the ones in the lobby
                msg.allUsers.push(spr);
                if (spr.inGame) { // get users also in game by id
                    msg.usersInGame.push(spr.user_id);
                }
            }
        });
    }
}
