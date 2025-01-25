import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./lobbySelector.scss";

const LobbySelector = () => {
    const [lobbyCode, setLobbyCode] = useState("");
    const [playerName, setPlayerName] = useState("");
    const navigate = useNavigate();

    const createLobby = async () => {
        if (!playerName.trim()) {
            alert("Please enter your name!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3001/create-lobby");
            const { lobbyCode } = response.data;
            setLobbyCode(lobbyCode);

            // navigate to lobby page with player name
            navigate(`/lobby/${lobbyCode}`, { state: { playerName } });
        } catch (error) {
            console.error("failed to create lobby: ", error);
        }
    }

    const joinLobby = () => {
        if (!playerName.trim()){
            alert("Please enter your name!");
            return;
        }

        if (!lobbyCode.trim()){
            alert("Please enter a valid lobby code!");
            return;
        }

        navigate(`/lobby/${lobbyCode}`, {state: {playerName}});
    };

    // Handle sharing the lobby code
    const handleShareLink = () => {
        if (!lobbyCode) {
            alert("Generate a code first!");
            return;
        }
        const shareableLink = `${window.location.origin}/lobby/${lobbyCode}`;
        navigator.clipboard.writeText(shareableLink);
        alert("Invite link copied to clipboard!");
    };

    // DISPLAY
    return (
        <div className="lobby-selector">
            {/* NAME */}
            <input
                type="text"
                className="player-name"
                name="player-name"
                placeholder="Enter name..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}>
            </input>
            
            {/* LOBBY CODE */}
            <input
                type="text"
                className="entered-lobby-code"
                name="entered-lobby-code"
                placeholder="Enter 6 letter code..."
                value={lobbyCode}
                onChange={(e) => setLobbyCode(e.target.value.toUpperCase())}>
            </input>

            {/* CREATE LOBBY */}
            <div className="horizontal-flex">
                <button onClick={createLobby} className="create-lobby-button">Create Lobby</button>
            </div>

            

            {/* JOIN LOBBY */}
            <div className="horizontal-flex">
                <button onClick={joinLobby} className = "join-lobby-button">Join Lobby</button>
            </div>
        </div>
    );
};

export default LobbySelector;