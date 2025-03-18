import Lobby from "../game/lobby.js";

const lobbies = {}; // store active lobbies

const socketHandler = (io) => {
    // WebSocket events
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        // CREATE LOBBY
        socket.on("create-lobby", (playerName) => {
            console.log("received create-lobby event in backend");
            const lobbyCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            lobbies[lobbyCode] = new Lobby(lobbyCode);
            console.log("lobby code generated and sent into lobbies list: ", lobbyCode);

            // create host player 
            const hostPlayer = lobbies[lobbyCode].addPlayer(socket.id, playerName);
            hostPlayer.isHost = true;

            // send lobby code back to creator
            socket.emit("lobby-created", lobbyCode);
        });

        // JOIN LOBBY 
        socket.on("join-lobby", (lobbyId, playerName) => {
            // if invalid lobby, return
            if (!lobbies[lobbyId]) {
                socket.emit("error", "Lobby does not exist");
                return;
            }
    
            console.log("attempting to join lobby");
            const lobby = lobbies[lobbyId];

            // add new player, do not set host
            const newPlayer = lobby.addPlayer(socket.id, playerName);

            socket.join(lobbyId);

            console.log(`Lobby joined: ${lobbyId}`);
            console.log("players in lobby: ", lobby.players);

            // Notify everyone in the lobby
            io.to(lobbyId).emit("lobby-update", lobby.players);
        });

        socket.on("leave-lobby", (lobbyId) => {
            if (!lobbies[lobbyId]) return;

            // grab current lobby
            const lobby = lobbies[lobbyId];

            // remove player from lobby
            lobby.removePlayer(socket.id);

            // notify remaining players of disconnect
            io.to(lobbyId).emit("lobby-update", lobby.players);

            // if lobby is empty, delete it
            if (lobby.players.length === 0){
                delete lobbies[lobbyId];
            }

            // make next player host if host leaves
            if (lobby.players.length > 0 && !lobby.players.some(player => player.isHost)){
                lobby.players[0].isHost = true;
                io.to(lobbyId).emit("lobby-update", lobby.players);
            }
            
            socket.leave(lobbyId);
        });
    
    
    
    
        // START GAME 
        socket.on("start-game", (lobbyId) => {
            // INVALID LOBBY
            if (!lobbies[lobbyId]) {
                socket.emit("error", "Lobby does not exist");
                return;
            }
    
            try {    
                // store the game in the lobby
                lobbies[lobbyId].startGame();
                const lobbyState = lobbies[lobbyId].getLobbyState();
                console.log("lobby state: ", lobbyState);

                io.to(lobbyId).emit("start-game", lobbyState);
            } catch (error) {
                console.error("Failed to start game: ", error);
                socket.emit("error", "failed to start game");
            }
        });
    
    
        // DRAW CARD
        // somehow need to track current player of who requested card and store that.
    
        socket.on("draw-card", (lobbyId) => {
            if (!lobbies[lobbyId]) {
                console.error("No lobby found for lobbyId:", lobbyId);
                socket.emit("error", "Lobby does not exist. ");
                return;
            }
    
            const lobby = lobbies[lobbyId];
            const player = lobby.find((p) => p.id === socket.id);
    
            if (!player){
                console.error("player not found in lobby: ", lobbyId);
                socket.emit("error", "player not found in lobby");
                return;
            }
    
            if (!lobby || !lobby.game) {
                console.error("no game found in lobby for lobbyId: ", lobbyId);
                socket.emit("error", "Lobby does not exist.");
                return;
            }
    
            try {
                const card = lobby.game.draw_random_card();
                const cardJson = {
                    "kind": card.kind,
                    "color": card.color,
                    "number": card.number,
                    "name": card.name
                };
    
                if (cardJson) {
                    player.hand.push(cardJson);
    
                    // emit the card only to requesting player
                    socket.emit("card-drawn", cardJson);
                    
                    //io.to(lobbyId).emit("card-drawn", cardJson);
                } else {
                    socket.emit("error", "no more cards in the deck");
                }
            } catch (error) {
                console.error("error drawing card: ", error.message);
                socket.emit("error", "failed to draw card.");
            }
    
        });
    
    
        // DISCONNECT
        socket.on("disconnect", () => {
            // remove player from all lobbies
            for (const [lobbyId, lobby] of Object.entries(lobbies)) {
                const playerIndex = lobby.players.findIndex((p) => p.id === socket.id);
                if (playerIndex !== -1) {
                    lobby.removePlayer(socket.id);
                    io.to(lobbyId).emit("lobby-update", lobbies[lobbyId].players);

                    // delete lobby if empty
                    if (lobby.players.length === 0){
                        delete lobbies[lobbyId];
                        console.log(`Lobby ${lobbyId} deleted (empty)`);
                    }
                    break;
                }
            }
        });
    });
}

export default socketHandler;
