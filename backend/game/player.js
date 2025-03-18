class Player {
    constructor(playerId, name){
        this.id = playerId;
        this.name = name;
        this.hand = [];
        this.points = 0;
        this.skipped = false;
        this.isHost = false;
    }
}

export default Player;