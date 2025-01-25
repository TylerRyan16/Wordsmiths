use wasm_bindgen::prelude::*;
use serde::Serialize;

#[wasm_bindgen]
#[derive(Clone, Serialize)]
pub struct Card {
    kind: String,
    color: Option<String>,
    number: Option<u8>,
    name: Option<String>,
}

#[wasm_bindgen]
impl Card {
    pub fn new(kind: String, color: Option<String>, number: Option<u8>, name: Option<String>) -> Self {
        Card { kind, color, number, name}
    }
    

    #[wasm_bindgen(getter)]
    pub fn kind(&self) -> String {
        self.kind.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn color(&self) -> Option<String> {
        self.color.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn number(&self) -> Option<u8> {
        self.number
    }

    #[wasm_bindgen(getter)]
    pub fn name(&self) -> Option<String> {
        self.name.clone()
    }
}