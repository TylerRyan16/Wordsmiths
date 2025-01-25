import React, { useState, useEffect } from "react";
import { useParams, useLocation } from 'react-router-dom';
import socket from "../Socket/socket";
import './play.scss';

const Play = () => {
    const { id: lobbyCode } = useParams();

    const location = useLocation();
    const [playersInGame, setPlayersInGame] = useState(location.state?.players || []);
    const [playerHand, setPlayerHand] = useState([]);
    const [playerLetters, setPlayerLetters] = useState([]);
    

    useEffect(() => {
        console.log("starting game in play component with code: ", lobbyCode);
        console.log("starting game in play component with players: ", playersInGame);

        // DRAW CARD
        socket.on("card-drawn", (card) => {
            setPlayerHand((prevHand) => [...prevHand, card]);
        });

        return () => {
            socket.off("start-game");
            socket.off("card-drawn");
        };

    }, [lobbyCode, playersInGame]);

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
            <div className="player-two-area">
                <p>PlayerTwo</p>
            </div>

            {/* Player Three */}
            <div className="player-three-area">
                <p className="ingame-name left">PlayerThree</p>
            </div>


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
            <div className="player-four-area">
                <p className="ingame-name right">PlayerFour</p>
            </div>


            {/* MAIN PLAYER AREA */}
            <div className="player-one-area">
                {/* Player Cards */}
                {playerHand.length > 0 ? (
                    <div className="player-cards" style={{ gap: `${calculateCardGap(playerHand.length)}px` }}>
                        {playerHand.map((card, index) => (
                            <div key={index}>
                                {displayCard(card)}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Your hand is empty.</p>
                )}

                {/* Player Letters */}
                {playerLetters.length > 0 ? (
                    <div>
                        {playerLetters.map((letter, index) => (
                            <div key={index}>
                                {displayLetter(letter)}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No letters.</p>
                )}
            </div>
        </div>
    );
};

export default Play;