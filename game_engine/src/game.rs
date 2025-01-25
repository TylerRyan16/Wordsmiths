use wasm_bindgen::prelude::*;
use crate::dictionary::Dictionary;
use crate::deck::Deck;
use crate::card::Card;
use serde::Serialize;

#[wasm_bindgen]
#[derive(Serialize)]
pub struct Game {
    deck: Deck,
    dictionary: Dictionary,
}

#[wasm_bindgen]
impl Game {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Game {
            deck: Deck::new(),
            dictionary: Dictionary::new(),
        }
    }

    #[wasm_bindgen]
    pub fn draw_card(&mut self) -> Option<Card> {
        self.deck.draw_card()
    }

    #[wasm_bindgen]
    pub fn draw_random_card(&mut self) -> Option<Card> {
        self.deck.draw_random_card_from_deck()
    }

    #[wasm_bindgen]
    pub fn is_valid_word(&self, word: &str) -> bool {
        self.dictionary.is_valid_word(word)
    }

    #[wasm_bindgen]
    pub fn remaining_cards(&self) -> usize {
        self.deck.remaining_cards()
    }
}