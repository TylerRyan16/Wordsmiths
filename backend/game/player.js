class Player {
    constructor(socketId, playerId, name){
        this.socketId = socketId;
        this.id = playerId;   
        this.name = name;
        this.hand = [];
        this.points = 0;
        this.skipped = false;
        this.isHost = false;
        this.playerColor = "transparent";
    }

    toJSON() {
        return {
            socketId: this.socketId,
            id: this.id, 
            name: this.name,
            hand: this.hand,
            points: this.points,
            skipped: this.skipped,
            isHost: this.isHost,
            playerColor: this.playerColor
        };
    }

    static fromJSON(json) {
        const player = new Player(json.socketId, json.id, json.name);
        player.hand = json.hand;
        player.points = json.points;
        player.skipped = json.skipped;
        player.isHost = json.isHost;
        player.playerColor = json.playerColor;
        return player;
    }
}

export default Player;