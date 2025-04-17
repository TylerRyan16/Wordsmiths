import React from "react";
import './home.scss'
import LobbySelector from "../LobbySelector/LobbySelector";


const Home = () => {
    // DISPLAY
    return (
        <div className="page-container">
            {/* Lobby Selector */}
            <LobbySelector />
        </div>
    );
};

export default Home;