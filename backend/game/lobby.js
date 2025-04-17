import Player from "./player.js";
class Lobby {
    constructor(lobbyId, players = [], gameStarted = false) {
        this.lobbyId = lobbyId;
        this.players = players; // array of Player instances
        this.gameStarted = gameStarted;
    }

    addPlayer(player) {
        this.players.push(player);
    }

    removePlayer(playerId) {
        this.players = this.players.filter(p => p.id !== playerId);
    }

    toJSON() {
        return {
            lobbyId: this.lobbyId,
            players: this.players.map(p => p.toJSON()),
            gameStarted: this.gameStarted
        };
    }

    static fromJSON(json) {
        const players = json.players.map(p => Object.assign(new Player(), p));
        return new Lobby(json.lobbyId, players, json.gameStarted);
    }
}
export default Lobby;