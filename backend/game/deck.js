import Card from './card.js';

class Deck {
    constructor(){
        this.cards = [];
        const colors = ["Pink", "Purple", "Blue", "Green", "Red", "Orange"];
        const ranks = ['1', '2', '3', '4', '5', '6', '7'];
        const specialties = ["Skip", "Reverse", "+4", "Swap", "Block", "Steal", "Lock", "Flood"];

        // populate deck with colored numbered cards (42)
        colors.forEach(color => {
            ranks.forEach(rank => {
                this.cards.push(new Card(color, rank, ""));
            });
        });

        // add specialty cards to deck
        specialties.forEach(specialty => {
            this.cards.push(new Card("", "", specialty));
        })

        // shuffle the deck
        this.shuffle();
    }

    shuffle(){
        this.cards.sort(() => Math.random() - 0.5);
    }

    drawCard(){
        return this.cards.pop();
    }
}

export default Deck;