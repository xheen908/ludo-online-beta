// ludogame/paths.js

const MAIN_PATH = [
  [4, 0.35, 3], [4, 0.35, 2], [4, 0.35, 1], [4, 0.35, 0],
  [3, 0.35, 0], [2, 0.35, 0], [1, 0.35, 0], [0, 0.35, 0],
  [-1, 0.35, 0], [-2, 0.35, 0], [-3, 0.35, 0], [-4, 0.35, 0],
  [-4, 0.35, -1], [-4, 0.35, -2], [-4, 0.35, -3], [-4, 0.35, -4],
  [-3, 0.35, -4], [-2, 0.35, -4], [-1, 0.35, -4], [0, 0.35, -4],
  [0, 0.35, -3], [0, 0.35, -2], [0, 0.35, -1], [0, 0.35, 0],
  [1, 0.35, 0], [2, 0.35, 0], [3, 0.35, 0], [4, 0.35, 0],
  [4, 0.35, 1], [4, 0.35, 2], [4, 0.35, 3], [4, 0.35, 4],
  [3, 0.35, 4], [2, 0.35, 4], [1, 0.35, 4], [0, 0.35, 4],
  [-1, 0.35, 4], [-2, 0.35, 4], [-3, 0.35, 4], [-4, 0.35, 4],
];

const START_POSITIONS = {
  red: [
    [-5, 0.35, 5], // Figur 1
    [-4, 0.35, 5], // Figur 2
    [-5, 0.35, 4], // Figur 3
    [-4, 0.35, 4], // Figur 4
  ],
  green: [
    [-5, 0.35, -5], // Figur 1
    [-4, 0.35, -5], // Figur 2
    [-5, 0.35, -4], // Figur 3
    [-4, 0.35, -4], // Figur 4
  ],
  yellow: [
    [5, 0.35, 5], // Figur 1
    [4, 0.35, 5], // Figur 2
    [5, 0.35, 4], // Figur 3
    [4, 0.35, 4], // Figur 4
  ],
  blue: [
    [5, 0.35, -5], // Figur 1
    [4, 0.35, -5], // Figur 2
    [5, 0.35, -4], // Figur 3
    [4, 0.35, -4], // Figur 4
  ],
};

const PATHS = {
  red: [
    // Rot's Pfad
    [-1, 0.35, 5], // 1
    [-1, 0.35, 4], // 2
    [-1, 0.35, 3], // 3
    [-1, 0.35, 2], // 4
    [-1, 0.35, 1], // 5
    [-2, 0.35, 1], // 6
    [-3, 0.35, 1], // 7
    [-4, 0.35, 1], // 8
    [-5, 0.35, 1],  // 9
    [-5, 0.35, 0],  // 10
    [-5, 0.35, -1],  // 11
    [-4, 0.35, -1],  // 12
    [-3, 0.35, -1],  // 13
    [-2, 0.35, -1], // 14
    [-1, 0.35, -1], // 15
    [-1, 0.35, -2], // 16
    [-1, 0.35, -3], // 17
    [-1, 0.35, -4], // 18
    [-1, 0.35, -5], // 19
    [0, 0.35, -5], // 20
    [1, 0.35, -5], // 21
    [1, 0.35, -4], // 22
    [1, 0.35, -3], // 23
    [1, 0.35, -2], // 24
    [1, 0.35, -1],  // 25
    [2, 0.35, -1],  // 26
    [3, 0.35, -1],  // 27
    [4, 0.35, -1],  // 28
    [5, 0.35, -1],  // 29
    [5, 0.35, 0],  // 30
    [5, 0.35, 1],  // 31
    [4, 0.35, 1],  // 32
    [3, 0.35, 1],  // 33
    [2, 0.35, 1],  // 34
    [1, 0.35, 1],  // 35
    [1, 0.35, 2],  // 36  
    [1, 0.35, 3],  // 37
    [1, 0.35, 4], // 38
    [1, 0.35, 5], // 39
    [0, 0.35, 5], // 40

     // Endslots für Rot
    [0, 0.35, 4],
    [0, 0.35, 3],
    [0, 0.35, 2],
    [0, 0.35, 1],
  ],
  green: [
    // Grün's Pfad
    [-5, 0.35, -1],  // 1
    [-4, 0.35, -1],  // 2
    [-3, 0.35, -1],  // 3
    [-2, 0.35, -1],  // 4
    [-1, 0.35, -1],  // 5
    [-1, 0.35, -2],  // 6
    [-1, 0.35, -3],  // 7
    [-1, 0.35, -4],  // 8
    [-1, 0.35, -5],  // 9
    [0, 0.35, -5],   // 10
    [1, 0.35, -5],   // 11
    [1, 0.35, -4],   // 12
    [1, 0.35, -3],   // 13
    [1, 0.35, -2],   // 14
    [1, 0.35, -1],  // 15
    [2, 0.35, -1],  // 16
    [3, 0.35, -1],  // 17
    [4, 0.35, -1],  // 18
    [5, 0.35, -1], // 19
    [5, 0.35, 0], // 20
    [5, 0.35, 1], // 21
    [4, 0.35, 1], // 22
    [3, 0.35, 1], // 23
    [2, 0.35, 1], // 24
    [1, 0.35, 1], // 25
    [1, 0.35, 2],  // 26
    [1, 0.35, 3],  // 27
    [1, 0.35, 4],  // 28
    [1, 0.35, 5],  // 29
    [0, 0.35, 5],   // 30
    [-1, 0.35, 5],   // 31
    [-1, 0.35, 4],   // 32
    [-1, 0.35, 3],   // 33
    [-1, 0.35, 2],   // 34
    [-1, 0.35, 1],   // 35
    [-2, 0.35, 1],   // 36
    [-3, 0.35, 1],   // 37
    [-4, 0.35, 1],   // 38
    [-5, 0.35, 1],   // 39
    [-5, 0.35, 0],   // 40

    [-4, 0.35, 0],
    [-3, 0.35, 0], 
    [-2, 0.35, 0], 
    [-1, 0.35, 0],
  ],
  blue: [
    // Blau's Pfad
    [1, 0.35, -5], // 1
    [1, 0.35, -4],  // 2
    [1, 0.35, -3],  // 3
    [1, 0.35, -2],  // 4
    [1, 0.35, -1],  // 5
    [2, 0.35, -1],  // 6
    [3, 0.35, -1],  // 7
    [4, 0.35, -1],  // 8
    [5, 0.35, -1],  // 9
    [5, 0.35, 0],  // 10
    [5, 0.35, 1],  // 11
    [4, 0.35, 1],  // 12
    [3, 0.35, 1], // 13
    [2, 0.35, 1], // 14
    [1, 0.35, 1], // 15
    [1, 0.35, 2], // 16
    [1, 0.35, 3], // 17
    [1, 0.35, 4], // 18
    [1, 0.35, 5], // 19
    [0, 0.35, 5], // 20
    [-1, 0.35, 5], // 21
    [-1, 0.35, 4], // 22
    [-1, 0.35, 3], // 23
    [-1, 0.35, 2], // 24
    [-1, 0.35, 1], // 25
    [-2, 0.35, 1], // 26
    [-3, 0.35, 1], // 27
    [-4, 0.35, 1],  // 28
    [-5, 0.35, 1],  // 29
    [-5, 0.35, 0],  // 30
    [-5, 0.35, -1],  // 31
    [-4, 0.35, -1],  // 32
    [-3, 0.35, -1],  // 33
    [-2, 0.35, -1],  // 34
    [-1, 0.35, -1],  // 35
    [-1, 0.35, -2],  // 36
    [-1, 0.35, -3],  // 37
    [-1, 0.35, -4],  // 38
    [-1, 0.35, -5],  // 39
    [0, 0.35, -5],  // 40

    [0, 0.35, -4], 
    [0, 0.35, -3], 
    [0, 0.35, -2], 
    [0, 0.35, -1],
  ],
  yellow: [
    // Gelb's Pfad
    [5, 0.35, 1], // 1
    [4, 0.35, 1], // 2
    [3, 0.35, 1], // 3
    [2, 0.35, 1], // 4
    [1, 0.35, 1], // 5
    [1, 0.35, 2], // 6
    [1, 0.35, 3], // 7
    [1, 0.35, 4], // 8
    [1, 0.35, 5], // 9
    [0, 0.35, 5], // 10
    [-1, 0.35, 5], // 11
    [-1, 0.35, 4], // 12
    [-1, 0.35, 3], // 13
    [-1, 0.35, 2], // 14
    [-1, 0.35, 1], // 15
    [-2, 0.35, 1], // 16
    [-3, 0.35, 1], // 17
    [-4, 0.35, 1], // 18
    [-5, 0.35, 1], // 19
    [-5, 0.35, 0], // 20
    [-5, 0.35, -1], // 21
    [-4, 0.35, -1], // 22
    [-3, 0.35, -1], // 23
    [-2, 0.35, -1], // 24
    [-1, 0.35, -1], // 25
    [-1, 0.35, -2], // 26
    [-1, 0.35, -3], // 27
    [-1, 0.35, -4], // 28
    [-1, 0.35, -5], // 29
    [0, 0.35, -5], // 30
    [1, 0.35, -5], // 31
    [1, 0.35, -4], // 32
    [1, 0.35, -3], // 33
    [1, 0.35, -2], // 34
    [1, 0.35, -1], // 35
    [2, 0.35, -1], // 36
    [3, 0.35, -1], // 37
    [4, 0.35, -1], // 38
    [5, 0.35, -1], // 39
    [5, 0.35, 0], // 40

    [4, 0.35, 0], // Endslot 1
    [3, 0.35, 0], // Endslot 2
    [2, 0.35, 0], // Endslot 3
    [1, 0.35, 0], // Endslot 4
  ],
};

const END_SLOTS = {
  red: [
    [0, 0.35, 4],
    [0, 0.35, 3],
    [0, 0.35, 2],
    [0, 0.35, 1],
  ],
  green: [
    [-4, 0.35, 0],
    [-3, 0.35, 0],
    [-2, 0.35, 0],
    [-1, 0.35, 0],
  ],
  blue: [
    [0, 0.35, -4],
    [0, 0.35, -3],
    [0, 0.35, -2],
    [0, 0.35, -1],
  ],
  yellow: [
    [4, 0.35, 0],
    [3, 0.35, 0],
    [2, 0.35, 0],
    [1, 0.35, 0],
  ],
};

module.exports = {
  MAIN_PATH,
  START_POSITIONS,
  PATHS,
  END_SLOTS,
};
