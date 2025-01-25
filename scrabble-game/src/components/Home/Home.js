import React from "react";
import './home.scss'
import LobbySelector from "../LobbySelector/LobbySelector";


const Home = () => {
    // DISPLAY
    return (
        <div className = "container">
            <p>This is the home page.</p>

            {/* Lobby Selector */}
            <LobbySelector />
        </div>
    );
};

export default Home;