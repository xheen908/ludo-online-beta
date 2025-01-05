// shared/paths.js

const PATHS = {
    red: [
      // Beispielpfad für rote Spieler
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
    ],
    blue: [
      // Beispielpfad für blaue Spieler
      31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
      41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
      51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
    ],
    green: [
      // Beispielpfad für grüne Spieler
      61, 62, 63, 64, 65, 66, 67, 68, 69, 70,
      71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
      81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
    ],
    yellow: [
      // Beispielpfad für gelbe Spieler
      91, 92, 93, 94, 95, 96, 97, 98, 99, 100,
      101, 102, 103, 104, 105, 106, 107, 108, 109, 110,
      111, 112, 113, 114, 115, 116, 117, 118, 119, 120,
    ],
  };
  
  const END_SLOTS = {
    red: [26, 27, 28, 29, 30],
    blue: [56, 57, 58, 59, 60],
    green: [86, 87, 88, 89, 90],
    yellow: [116, 117, 118, 119, 120],
  };
  
  const START_POSITIONS = {
    red: 0,    // Startposition für rote Spieler
    blue: 0,   // Startposition für blaue Spieler
    green: 0,  // Startposition für grüne Spieler
    yellow: 0, // Startposition für gelbe Spieler
  };
  
  module.exports = { PATHS, END_SLOTS, START_POSITIONS };
  