use std::collections::HashSet;
use wasm_bindgen::prelude::*;
use serde::Serialize;

#[wasm_bindgen]
#[derive(Serialize)]
pub struct Dictionary {
    words: HashSet<String>,
}

#[wasm_bindgen]
impl Dictionary {
    // Constructor: Loads the dictionary and returns a new instance
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {

        let mut dictionary = Dictionary {
            words: HashSet::new(),
        };


        // Load words into the dictionary
        let dictionary_content = include_str!("../dictionary/dictionary.txt");
        for word in dictionary_content.lines() {
            dictionary.words.insert(word.to_lowercase());
        }

        dictionary
    }

    // Check if a word is valid
    #[wasm_bindgen]
    pub fn is_valid_word(&self, word: &str) -> bool {
        let is_valid = self.words.contains(&word.to_lowercase());
        is_valid
    }
}

#[cfg(test)]
mod tests{
    use super::*;

    #[test]
    fn test_is_valid_word(){
        let dictionary = Dictionary::new();

        assert!(dictionary.is_valid_word("hello"));
        assert!(dictionary.is_valid_word("world"));

        // Test case insensitivity
        assert!(dictionary.is_valid_word("Hello"));
        assert!(dictionary.is_valid_word("WORLD"));

        // Words not in the dictionary
        assert!(!dictionary.is_valid_word("nonexistentword"));
    }
}