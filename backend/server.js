import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import init, { Game } from "./pkg/game_engine.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

let wasmInitialized = true;

(async () => {
    await init();
    wasmInitialized = true;
    console.log("initialized wasm module");
})


// store lobbies
const lobbies = [];

// middleware
app.use(cors());
app.use(express.json());

// CREATE LOBBY ROUTE
app.post("/create-lobby", (req, res) => {
    const lobbyCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    lobbies[lobbyCode] = [];
    res.json({ lobbyCode });
});

// WebSocket events
io.on("connection", (socket) => {
    // JOIN LOBBY 
    socket.on("join-lobby", (lobbyId, playerName) => {
        // INVALID LOBBY
        if (!lobbies[lobbyId]) {
            socket.emit("error", "Lobby does not exist");
            return;
        }

        // CHECK IF PLAYER ALREADY EXISTS
        const existingPlayer = lobbies[lobbyId].find((p) => p.id === socket.id);
        if (!existingPlayer) {
            const player = { 
                id: socket.id, 
                name: playerName || "Anonymous",
                hand: [],
                letters: [],
                points: 0,
                skipped: false 

            };
            lobbies[lobbyId].push(player);
            socket.join(lobbyId);
        }

        // Notify everyone in the lobby
        io.to(lobbyId).emit("lobby-update", lobbies[lobbyId]);
    });




    // START GAME 
    socket.on("start-game", (lobbyId) => {
        if (!wasmInitialized) {
            socket.emit("error", "WASM not initialized");
            return;
        }

        // INVALID LOBBY
        if (!lobbies[lobbyId]) {
            socket.emit("error", "Lobby does not exist");
            return;
        }

        try {
            const currentGame = new Game();

            // store the game in the lobby
            lobbies[lobbyId].game = currentGame;

            io.to(lobbyId).emit("start-game", { code: lobbyId, players: lobbies[lobbyId] });
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
        for (const [lobbyId, players] of Object.entries(lobbies)) {
            const index = players.findIndex((p) => p.id === socket.id);
            if (index !== -1) {
                players.splice(index, 1);
                io.to(lobbyId).emit("lobby-update", players);
                console.log(`Player disconnected from lobby ${lobbyId}`);
                break;
            }
        }
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
