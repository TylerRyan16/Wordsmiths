import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import socket from "../Socket/socket";
import "./lobby.scss";


const Lobby = () => {
    // navigation
    const navigate = useNavigate();
    const location = useLocation();

    // player list
    const [playersInLobby, setPlayersInLobby] = useState([]);

    // lobby code & player Name
    const { id: lobbyCode } = useParams();
    const currentPlayer = playersInLobby?.find(player => player.id === socket.id);
    const playerName = location.state?.playerName || "Anonymous";

    // run on page load
    useEffect(() => {
        // join lobby
        socket.emit("join-lobby", lobbyCode, playerName);

        // LOBBY PLAYER UPDATE
        socket.on("lobby-update", (players) => {
            setPlayersInLobby(Array.isArray(players) ? players : []);
        });

        // START GAME
        socket.on("start-game", (lobbyData) => {
            navigate(`/play/${lobbyData.lobbyId}`, { state: { code: lobbyData.lobbyId, players: lobbyData.players } });
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
    };

    const leaveLobby = () => {
        socket.emit('leave-lobby', lobbyCode);
        navigate("/");
    }

    const copyLobbyCodeToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(lobbyCode);
        } catch (error) {
            console.error("failed to copy text: ", error);
        }
    };

    // DISPLAY
    return (
        <div className="lobby-container">
            <div className="game-settings-area">
                <h1>Game Settings</h1>
            </div>


            <div className="lobby-page-area">
                <div id="leave-code-area">
                    <button className="leave-lobby-button" onClick={leaveLobby}>Leave Lobby</button>
                    <div id="code-copy-area">
                        <h1>Lobby Code: {lobbyCode}</h1>
                        <img src="/assets/copy-icon.png" alt="copy lobby code" onClick={copyLobbyCodeToClipboard} className="copy-code-button"></img>
                    </div>

                </div>

                <div className="list-area">
                    <h1>Players in Lobby</h1>
                    <ul className="player-list">
                        {playersInLobby.map((player) => (
                            <div className="player-display">
                                {player.isHost && <img src="/assets/host-icon.png" alt="host icon" className="host-icon"></img>}
                                <li key={player.id} className={`player-name-text ? ${playerName === player.name ? "current-player" : ""}`} >{player.name}</li>
                            </div>

                        ))}
                    </ul>
                </div>

                {/* Start Game Button */}
                <button onClick={handleStartGame} className='start-game-button'>Start Game</button>
            </div>


            {/* AESTHETIC SETTINGS */}
            <div className="visual-settings-area">
                <h1>Visual Settings</h1>
            </div>

        </div>

    );
};

export default Lobby;