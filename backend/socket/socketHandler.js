import Lobby from "../game/lobby.js";
import Player from "../game/player.js";
import db from "../firebase.js";

// change players in lobby:
/* 
    1. Find lobby in db with db.
*/

const socketHandler = (io) => {
    // WebSocket events
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        // CREATE LOBBY
        socket.on("create-lobby", async (playerName, playerId) => {
            const lobbyCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            const hostPlayer = new Player(socket.id, playerId, playerName);
            hostPlayer.isHost = true;

            console.log("created lobby with code: ", lobbyCode);

            const lobby = new Lobby(lobbyCode, [hostPlayer], false);

            try {
                const lobbyRef = db.ref(`/lobbies/${lobbyCode}`);
                await lobbyRef.set(lobby.toJSON());

                // Join the room and emit lobby update for the host
                socket.join(lobbyCode);
                io.to(lobbyCode).emit("lobby-update", lobby.players);

                // Emit lobby code to the host
                socket.emit("lobby-created", lobbyCode);
            } catch (error) {
                console.error("Error writing lobby to firebase: ", error);
                socket.emit("error", "Failed to create lobby.");
            }
        });

        // JOIN LOBBY 
        socket.on("join-lobby", async (lobbyId, playerName, playerId) => {
            // if invalid lobby, return
            try {
                console.log("joining lobby with ID: ", lobbyId);
                const lobby = await GetLobbyData(socket, lobbyId);

                // check if player already in lobby
                let player = lobby.players.find(p => p.id === playerId);

                if (player) {
                    // here we need to update the DB with the players new socket id
                    console.log("Player already in lobby. Updating socket ID.");
                    player.socketId = socket.id;
                    await UpdatePlayersInDB(lobbyId, lobby);
                } else {
                    console.log("Adding new player to lobby.");
                    player = new Player(socket.id, playerId, playerName);
                    if (lobby.players.length === 0) player.isHost = true;
                    lobby.addPlayer(player);

                    await UpdatePlayersInDB(lobbyId, lobby);
                }

                socket.join(lobbyId);
                io.to(lobbyId).emit("lobby-update", lobby.players);

            } catch (error) {
                console.error("Error checking Firebase for lobby: ", error);
            }
        });

        // LEAVE LOBBY 
        socket.on("leave-lobby", async (lobbyId, playerId) => {
            try {
                const lobby = await GetLobbyData(socket, lobbyId);

                // remove this player
                lobby.players = lobby.players.filter(player => player.id !== playerId);
                console.log(`Player ${socket.id} left lobby ${lobbyId}`);

                if (lobby.players.length === 0) {
                    await db.ref(`/lobbies/${lobbyId}`).remove();
                } else {
                    if (!lobby.players.some(p => p.isHost)) {
                        lobby.players[0].isHost = true;
                    }

                    await UpdatePlayersInDB(lobbyId, lobby);
                    io.to(lobbyId).emit("lobby-update", lobby.players);
                }
            } catch (error) {
                console.error("Error checking Firebase for lobby: ", error);
            }
        });




        // START GAME 
        socket.on("start-game", (lobbyId) => {
            // INVALID LOBBY
            // if (!lobbies[lobbyId]) {
            //     socket.emit("error", "Lobby does not exist");
            //     return;
            // }

            // try {
            //     // store the game in the lobby
            //     lobbies[lobbyId].startGame();
            //     const lobbyState = lobbies[lobbyId].getLobbyState();
            //     console.log("lobby state: ", lobbyState);

            //     io.to(lobbyId).emit("start-game", lobbyState);
            // } catch (error) {
            //     console.error("Failed to start game: ", error);
            //     socket.emit("error", "failed to start game");
            // }
        });

        // CHANGE PLAYER COLOR
        socket.on("update-player-color", ({ lobbyCode, playerId, color }) => {
            // if (!lobbies[lobbyCode]) return;

            // console.log("heard update-player-color");

            // const lobby = lobbies[lobbyCode];
            // const player = lobby.players.find(p => p.id === playerId);

            // if (player) {
            //     player.playerColor = color;

            //     io.to(lobbyCode).emit("lobby-update", lobby.players);
            // }
        });


        // DRAW CARD
        // somehow need to track current player of who requested card and store that.

        socket.on("draw-card", (lobbyId) => {
            // if (!lobbies[lobbyId]) {
            //     console.error("No lobby found for lobbyId:", lobbyId);
            //     socket.emit("error", "Lobby does not exist. ");
            //     return;
            // }

            // const lobby = lobbies[lobbyId];
            // const player = lobby.find((p) => p.id === socket.id);

            // if (!player) {
            //     console.error("player not found in lobby: ", lobbyId);
            //     socket.emit("error", "player not found in lobby");
            //     return;
            // }

            // if (!lobby || !lobby.game) {
            //     console.error("no game found in lobby for lobbyId: ", lobbyId);
            //     socket.emit("error", "Lobby does not exist.");
            //     return;
            // }

            // try {
            //     const card = lobby.game.draw_random_card();
            //     const cardJson = {
            //         "kind": card.kind,
            //         "color": card.color,
            //         "number": card.number,
            //         "name": card.name
            //     };

            //     if (cardJson) {
            //         player.hand.push(cardJson);

            //         // emit the card only to requesting player
            //         socket.emit("card-drawn", cardJson);

            //         //io.to(lobbyId).emit("card-drawn", cardJson);
            //     } else {
            //         socket.emit("error", "no more cards in the deck");
            //     }
            // } catch (error) {
            //     console.error("error drawing card: ", error.message);
            //     socket.emit("error", "failed to draw card.");
            // }

        });


        // DISCONNECT
        socket.on("disconnect", () => {
            // // remove player from all lobbies
            // for (const [lobbyId, lobby] of Object.entries(lobbies)) {
            //     const playerIndex = lobby.players.findIndex((p) => p.id === socket.id);
            //     if (playerIndex !== -1) {
            //         lobby.removePlayer(socket.id);
            //         io.to(lobbyId).emit("lobby-update", lobbies[lobbyId].players);

            //         // delete lobby if empty
            //         if (lobby.players.length === 0) {
            //             delete lobbies[lobbyId];
            //             console.log(`Lobby ${lobbyId} deleted (empty)`);
            //         }
            //         break;
            //     }
            // }
        });
    });

    const UpdatePlayersInDB = async (lobbyId, lobby) => {
        try {
            const lobbyRef = db.ref(`/lobbies/${lobbyId}/players`);
            const updatedPlayers = lobby.players.map(p => p.toJSON());
            await lobbyRef.set(updatedPlayers);
        } catch (error) {
            console.error("Failed to update players in Firebase: ".error);
        }

    }

    const GetLobbyData = async (socket, lobbyId) => {
        const lobbyRef = db.ref(`/lobbies/${lobbyId}`);
        const snapshot = await lobbyRef.once("value");

        if (!snapshot.exists()) {
            socket.emit("error", "Lobby does not exist.");
            return;
        }

        // get lobby data and create Lobby object from Json
        const lobbyData = snapshot.val();
        return Lobby.fromJSON(lobbyData);
    }
}



export default socketHandler;
