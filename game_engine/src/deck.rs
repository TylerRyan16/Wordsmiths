use wasm_bindgen::prelude::*;
use crate::card::Card;
use rand::Rng;
use serde::Serialize;

#[wasm_bindgen]
#[derive(Serialize)]
pub struct Deck {
    cards: Vec<Card>,
}

#[wasm_bindgen]
impl Deck {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        let mut cards = Vec::new();

        // Add number cards
        let colors = vec!["blue", "green", "orange", "pink", "purple", "red"];
        let numbers = 1..=7;

        for color in &colors {
            for number in numbers.clone() {
                cards.push(Card::new(
                    "NumberCard".to_string(),
                    Some(color.to_string()),
                    Some(number),
                    None,
                ));
            }
        }

        // Add specialty cards
        let specialty_cards = vec![
            ("Skip", 4),
            ("Reverse", 4),
            ("+4", 4),
            ("Swap", 1),
            ("Block", 3),
            ("Steal", 2),
            ("Lock", 2),
            ("Flood", 2),
        ];

        for (name, count) in specialty_cards {
            for _ in 0..count {
                cards.push(Card::new(
                    "SpecialtyCard".to_string(),
                    None,
                    None,
                    Some(name.to_string()),
                ));
            }
        }

        Deck { cards }
    }


    #[wasm_bindgen]
    pub fn draw_card(&mut self) -> Option<Card> {
        if self.cards.is_empty(){
            None
        } else {
            self.cards.pop()
        }
    }

    #[wasm_bindgen]
    pub fn draw_random_card_from_deck(&mut self) -> Option<Card> {
        if self.cards.is_empty(){
            None
        } else {
            let mut rng = rand::thread_rng();
            let random_index = rng.gen_range(0, self.remaining_cards());
            Some(self.cards.remove(random_index))
        }
    }

    #[wasm_bindgen]
    pub fn remaining_cards(&self) -> usize {
        self.cards.len()
    }
}