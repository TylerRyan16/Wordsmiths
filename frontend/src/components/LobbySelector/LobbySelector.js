import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import "./lobbySelector.scss";
import socket, { connectSocket } from "../Socket/socket";
import { v4 as uuidv4 } from "uuid";

const LobbySelector = () => {
    const [lobbyCode, setLobbyCode] = useState("");
    const [playerName, setPlayerName] = useState("");
    const navigate = useNavigate();

    // page load
    useEffect(() => {
        // create and store persistent ID in session storage
        if (!sessionStorage.getItem("playerId")) {
            sessionStorage.setItem("playerId", uuidv4());
        }

        connectSocket();

        // once lobby created, navigate to correct route
        socket.on("lobby-created", (lobbyId) => {
            setLobbyCode(lobbyId);
            navigate(`/lobby/${lobbyId}`, {
                state: {
                    playerName,
                    playerId: sessionStorage.getItem("playerId"),
                }
            });
        });

        return () => {
            socket.off("lobby-created");
        };
    })

    // CREATE LOBBY
    const createLobby = async (name) => {
        if (!name.trim()) {
            alert("Please enter your name!");
            return;
        }

        console.log("emitting create lobby with name: ", name);

        // call create lobby and get lobby data 
        socket.emit("create-lobby", name, sessionStorage.getItem("playerId"));
    };

    const joinLobby = () => {
        if (!playerName.trim()) {
            alert("Please enter your name!");
            return;
        }
        if (!lobbyCode.trim()) {
            alert("Please enter a valid lobby code!");
            return;
        }

        navigate(`/lobby/${lobbyCode}`, {
            state: {
                playerName,
                playerId: sessionStorage.getItem("playerId"),
            }
        });
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

            {/* CREATE LOBBY */}
            <div className="horizontal-flex">
                <button onClick={() => createLobby(playerName)} className="create-lobby-button">Create Lobby</button>
            </div>

            <p>OR</p>

            {/* LOBBY CODE */}
            <input
                type="text"
                className="entered-lobby-code"
                name="entered-lobby-code"
                placeholder="Enter 6 letter code..."
                value={lobbyCode}
                onChange={(e) => setLobbyCode(e.target.value.toUpperCase())}>
            </input>

            {/* JOIN LOBBY */}
            <div className="horizontal-flex">
                <button onClick={joinLobby} className="join-lobby-button">Join Lobby</button>
            </div>



        </div>
    );
};

export default LobbySelector;