import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout.js";
import Home from "./components/Home/Home.js"
import Play from "./components/Play/Play.js";
import Lobby from "./components/Lobby/Lobby.js";

import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/lobby/:id" element = {<Lobby />}></Route>
          <Route path="/play/:id" element={<Play />}></Route>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
