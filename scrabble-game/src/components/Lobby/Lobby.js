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
    const playerName = location.state?.playerName || "Anonymous";

    const [playerColors, setPlayerColors] = useState({});

    const setPlayerColor = (playerId, color) => {
        console.log(`Setting color for player ${playerId}: ${color}`);

        socket.emit("update-player-color", ({lobbyCode, playerId, color}))
    };

    // colors
    const playerColorOptions = [
        "#FF6961", // Pastel Red
        "#FFB347", // Pastel Orange
        "#FDFD96", // Pastel Yellow
        "#77DD77", // Pastel Green
        "#99C5C4", // Pastel Teal
        "#A7C7E7", // Pastel Blue
        "#C3B1E1", // Pastel Purple
        "#F4A7B9", // Pastel Pink
        "#FFDAB9", // Pastel Peach
        "#D8BFD8", // Pastel Lavender
        "#AAF0D1", // Pastel Mint
        "#B5EAEA", // Pastel Cyan
        "#F49AC2", // Pastel Magenta
        "#FF9E8F", // Pastel Coral
        "#D2B48C", // Pastel Brown
        "#C4B454", // Pastel Olive
        "#F8E58C", // Pastel Gold
        "#D6D6D6", // Pastel Silver
        "#D3D3D3", // Pastel Gray
        "#B0A4E3"  // Pastel Indigo
    ];


    // run on page load
    useEffect(() => {
        // join lobby
        socket.emit("join-lobby", lobbyCode, playerName);

        // LOBBY PLAYER UPDATE
        socket.on("lobby-update", (players) => {
            console.log("Updated lobby players: ", players);
            setPlayersInLobby(players);
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
    }, []);


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
                        {playersInLobby
                        .slice() // create copy to avoid mutating state
                        .sort((a,b) => (a.id === socket.id ? -1 : b.id === socket.id ? 1 : 0)) // move current player to the top
                        .map((player, index) => (
                            <div className="player-display" key={player.id}>
                                <li
                                    className={`player-name-text`}
                                    style={{ backgroundColor: player.playerColor}} // Use stored color or default
                                >
                                    {player.name} {index === 0 ? "← You" : ""}
                                </li>
                                {player.isHost && <img src="/assets/host-icon.png" alt="host icon" className="host-icon"></img>}
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
                <h3>Player Color</h3>
                <div className="player-colors-area">
                    {playerColorOptions.map((color, index) => (
                        <div
                            key={index}
                            style={{ backgroundColor: color }}
                            className="color-option"
                            onClick={() => setPlayerColor(socket.id, color)}>
                        </div>
                    ))}
                </div>
            </div>

        </div>

    );
};

export default Lobby;