import Game from './game.js';
import Player from'./player.js';

class Lobby{
    constructor(lobbyId){
        this.lobbyId = lobbyId;
        this.players = [];
        this.game = new Game();
    }

    addPlayer(playerId, playerName){
        // avoid duplicates
        if (this.players.some(player => player.id === playerId)) return;

        // create new player object
        const player = new Player(playerId, playerName);
    
        // push into players array
        this.players.push(player);
        return player;
    }

    removePlayer(playerId){
        this.players = this.players.filter(player => player.id !== playerId);
    }

    startGame(){
        if (this.players.length < 2){
            throw new Error("Not enough players to start a game.");
        }
        
        // create game and initialize players
        this.game = new Game();
        this.game.players = [...this.players]; // copy players into game instance
    }
    
    getPlayersInLobby() {
        return this.game.players;
        
    }
    getLobbyState() {
        return {
            lobbyId: this.lobbyId,
            players: this.players.map(p => ({id: p.id, name: p.name, hand: p.hand, points: p.points, skipped: p.skipped, isHost: p.isHost})),
            gameStarted: this.game !== null
        };
    }
}

export default Lobby;
