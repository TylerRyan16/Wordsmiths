pub struct Board {
    tiles: Vec<Vec<Option<char>>>,
}

impl Board {
    pub fn new(size: usize) -> Self {
        Self{
            tiles: vec![vec![None; size]; size],
        }
    }

    pub fn place_tile(&mut self, row: usize, col: usize, tile: char){
        if row < self.tiles.len() && col < self.tiles[row].len() {
            self.tiles[row][col] = Some(tile);
        }
    }

    
}