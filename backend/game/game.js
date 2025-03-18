import Deck from './deck.js';

class Game {
    constructor(){
        this.players = [];
        this.deck = new Deck();
    }

    addPlayer(playerID){
        this.players.push({ id: playerID, hand: []});
    }

    // each player starts with 6 cards
    dealCards(numCards){
        this.players.forEach(player => {
            for (let i = 0; i < numCards; i++){
                player.hand.push(this.deck.drawCard());
            }
        });
    }

    getGameState(){
        return {
            players: this.players,
            remainingCards: this.deck.cards.length,
        };
    }
}

export default Game;