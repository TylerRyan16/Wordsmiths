import React, { useState, useEffect } from "react";
import { useParams, useLocation } from 'react-router-dom';
import socket from "../Socket/socket";
import './play.scss';

const Play = () => {
    const location = useLocation();
    const lobbyCode = location.state?.code;
    const players = location.state?.players;

    const totalPlayers = players.length;

    const currentPlayer = players?.find(player => player.id === socket.id);
    const otherPlayers = players?.filter(player => player.id !== socket.id);


    useEffect(() => {
        // DEAL CARDS TO EACH PLAYER
        socket.emit("deal-cards", totalPlayers);

        // DRAW CARD
        socket.on("card-drawn", (card) => {
            // notify all players of hand change
        });

        return () => {
            socket.off("start-game");
            socket.off("card-drawn");
        };

    }, [lobbyCode, players]);

    // DISPLAYING PLAYERS HANDS
    const displayPlayerHand = (playerID) => {
        const player = players.find(p => p.id === playerID);
        console.log("player: ", player);

        if (!player) return <p>Loading player hand...</p>;

        const isCurrentPlayer = player.id === currentPlayer?.id;

        return (
            <div className={`player-hand ${isCurrentPlayer ? "current" : ""}`}>
                {/* Player Cards */}
                {player.hand.length > 0 ? (
                    <div className="player-cards" style={{ gap: `${calculateCardGap(player.hand.length)}px` }}>
                        {player.hand.map((card, index) => (
                            <div key={index}>{displayCard(card)}</div>
                        ))}
                    </div>
                ) : (
                    <p>No cards.</p>
                )}

                {/* Player Letters */}
                {player.letters?.length > 0 ? (
                    <div className="player-letters">
                        {player.letters.map((letter, index) => (
                            <div key={index}>{displayLetter(letter)}</div>
                        ))}
                    </div>
                ) : (
                    <p>No letters.</p>
                )}
            </div>
        );
    };


    // DRAWING CARD
    const handleDrawCard = () => {
        console.log("emitting draw card with lobby code: ", lobbyCode);

        // need to somehow track which player clicked draw card and what cards they have.
        socket.emit("draw-card", lobbyCode);
    };

    const getCardLocation = (card) => {
        console.log("Card.color: ", card.color);
        if (!card || !card.color) {
            //console.error("invalid card object: ", card);
            return <img src="/assets/cards/red/red-1.png" alt="card" className="card-in-deck"></img>
        }

        const locColor = card.color.toLowerCase();
        const location = `/assets/cards/${locColor}/${locColor}-${card.number}.png`;

        console.log("card location: ", location);

        return (
            <img src={location} alt="card" className="card-in-deck"></img>
        );
    };

    const displayCard = (card) => {
        return (
            <div>
                {getCardLocation(card)}
            </div>
        );
    };


    // LETTERS
    const displayLetter = (letter) => {
        return (
            <div>
                {getLetterLocation(letter)}
            </div>
        );
    };

    const getLetterLocation = (letter) => {
        return (
            <p>Unimplemented method getLetterLocation</p>
        );
    };

    const calculateCardGap = (numCards) => {
        const maxGap = 90;
        const minGap = 45;
        const baseGap = 600 / numCards;
        const newGap = Math.max(minGap, Math.min(baseGap, maxGap));
        console.log("newGap: ", newGap);
        return newGap;
    };



    return (
        <div className="container">
            {/* Player Two */}
            {totalPlayers >= 2 && (
                <div className="player-two-area">
                    <h1 className="player-name-ingame">{otherPlayers[0]?.name || "Player 2"}</h1> 
                    {displayPlayerHand(otherPlayers[0]?.id)}
                </div>
            )}

            {/* Player Three */}
            {totalPlayers >= 3 && (
                <div className="player-three-area">
                    <h1 className="player-name-ingame">{otherPlayers[1]?.name || "Player 3"}</h1>
                    {displayPlayerHand(otherPlayers[1]?.id)}
                </div>
            )}


            {/* MIDDLE AREA */}
            <div className="center-area">
                <div className="deck-container" onClick={handleDrawCard}>
                    {[...Array(10)].map((_, index) => {
                        return (
                            <img
                                className="deck-card"
                                key={index}
                                src="/assets/cards/card-back.png"
                                alt="card-pile"
                                style={{ right: `${index * 4}px` }}
                            />
                        );
                    })}
                </div>
            </div>


            {/* Player Four */}
            {totalPlayers === 4 && (
                <div className="player-four-area">
                    <h1 className="player-name-ingame">{otherPlayers[2]?.name || "Player 4"}</h1>
                    {displayPlayerHand(otherPlayers[2]?.id)}
                </div>
            )}



            {/* MAIN PLAYER AREA */}
            <div className="player-one-area">
                {displayPlayerHand(currentPlayer?.id)}
                <h1 className="player-name-ingame">{currentPlayer?.name || "Unknown Player"}</h1>
            </div>
        </div>
    );
};

export default Play;