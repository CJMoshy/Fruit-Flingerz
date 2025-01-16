import { Server } from "socket.io";
export default class ServerManager {
    //figure out these two later
    private connectedUsers: ConnectedUser[];
    private spritesList: User[];
    public activeLobbies: Set<string>;

    private activeProjectiles: Projectile[];

    constructor() {
        this.connectedUsers = [];
        this.spritesList = [];
        this.activeLobbies = new Set();
        this.activeProjectiles = [];
    }

    addConnectedUser(cu: ConnectedUser) {
        this.connectedUsers.push(cu);
    }

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

    checkConnectedUserExist(uID: UserID) {
        return this.connectedUsers.find((user) => user.id === uID);
    }

    getConnectedUserIndexByID(uID: UserID) {
        return this.connectedUsers.findIndex((user) => user.id === uID);
    }

    getConnectedUserIndexBySocketID(socketID: string) {
        return this.connectedUsers.findIndex((user) =>
            user.socket.id === socketID
        );
    }

    getConnectedUserByID(uID: UserID) {
        return this.connectedUsers.find((user) => user.id === uID);
    }

    getConnectedUserBySocketID(socketID: string) {
        return this.connectedUsers.find((user) => user.socket.id === socketID);
    }

    addUserToSpritesList(user: User) {
        this.spritesList.push(user);
    }

    updateSpriteInList(usr: User) {
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
    getSpriteByUserID(uID: UserID) {
        return this.spritesList.find((spr) => spr.user_id === uID);
    }
    getSpriteIndexByUserID(uID: UserID) {
        return this.spritesList.findIndex((spr) => spr.user_id === uID);
    }
    removeUserFromSpritesList(uID: UserID) {
        const index = this.spritesList.findIndex((user) =>
            user.user_id === uID
        );
        if (index === -1) {
            console.log(
                `failed to find a user id:${uID} in the spritesList array`,
            );
            return;
        }
        this.spritesList.splice(index, 1);
    }
    
    setUserInGame(inGame: boolean, uID: UserID): boolean{
        const sprIndex = this.getSpriteIndexByUserID(uID);
        if (sprIndex === -1) return false;
        this.spritesList[sprIndex].inGame = inGame;
        return true;
    }

    populateLobbyResponseEvent(
        msg: JoinLobbyResponseMessage,
        _user: ConnectedUser,
        lobbyName: string,
    ) {
        const usersInLobby = this.connectedUsers.filter((user) =>
            user.lobby === lobbyName && user.id !== _user.id
        );

        // Get only the ids of users in the lobby
        const userIds = usersInLobby.map((user) => user.id);

        // get all users in the lobby
        this.spritesList.forEach((spr) => {
            if (userIds.includes(spr.user_id)) {
                msg.allUsers.push(spr);
                if (spr.inGame) { // get users also in game but just the ids
                    msg.usersInGame.push(spr.user_id);
                }
            }
        });
    }

    addProjectile(p: Projectile) {
        this.activeProjectiles.push(p);
    }

    updateProjectiles(io: Server) { // io here is socket.io main emitter
        // phaser uses a pps (pixels per second) abstraction for velocity so move the x forward by velocity / 1000
        // this of course assumes this method will be called every 1ms
        this.activeProjectiles.forEach((p) => p.x += p.velocity / 1000);
        // io.to(p.lobby).emit('movingProjectileEvent', p)
        // client side we need to catch this and then iterate through the list of projectiles in the lobby, find the ID and update the x val
    }
}
