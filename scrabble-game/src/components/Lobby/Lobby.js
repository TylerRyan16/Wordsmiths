import React, {useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import socket, {connectSocket} from "../Socket/socket";
import "./lobby.scss";


const Lobby = () => {
    // navigation
    const navigate = useNavigate();
    const location = useLocation();

    // player list
    const [playersInLobby, setPlayersInLobby] = useState([]);

    // lobby code & player Name
    const {id: lobbyCode} = useParams();
    const playerName = location.state?.playerName || "Anonymous";
    
    useEffect(() => { 
        connectSocket();

        // join lobby
        socket.emit("join-lobby", lobbyCode, playerName);

       // LOBBY PLAYER UPDATE
        socket.on("lobby-update", (players) => {
            setPlayersInLobby(players);
        });

        // START GAME
        socket.on("start-game", (data) => {
            console.log("heard start game - should be navigating to lobby: ", data.code);

            console.log("initializing game with players: ", data.players);

            navigate(`/play/${data.code}`, { state: {code: data.code, players: data.players} });
        });

        
        //cleanup on unmount
        return () => {
            socket.off("lobby-update");
            socket.off("start-game");
        };
    }, [lobbyCode, navigate, playerName]);


    // START GAME
    const handleStartGame = () => {
        // printing to console as expected
        console.log("starting game on client with id: ", lobbyCode);


        socket.emit('start-game', lobbyCode);
    }

    // DISPLAY
    return (
        <div className="lobby-container">
            <h1>Lobby Code: {lobbyCode}</h1>
            <h2>Players in Lobby:</h2>
            <ul>
                {playersInLobby.map((player) => (
                    <li key={player.id}>{player.name}</li>
                ))}
            </ul>


            {/* Start Game Button */}
            <button onClick={handleStartGame} className='start-game-button'>Start Game</button>
        </div>

    );
};

export default Lobby;