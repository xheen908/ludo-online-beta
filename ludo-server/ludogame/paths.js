// server/ludogame/paths.js

// Der Hauptpfad als Positionen (Index-basiert, keine 3D-Koordinaten nötig)
const MAIN_PATH = Array.from({ length: 40 }, (_, i) => i + 1);

// Startpositionen für alle Farben (Index der MAIN_PATH)
const START_POSITIONS = {
    red: [1, 2, 3, 4],
    green: [11, 12, 13, 14],
    blue: [21, 22, 23, 24],
    yellow: [31, 32, 33, 34]
};

// Definierte Pfade für jeden Spieler (logisch, nicht visuell)
const PATHS = {
    red: [...Array.from({ length: 40 }, (_, i) => i + 1), 41, 42, 43, 44],
    green: [
        ...Array.from({ length: 10 }, (_, i) => 11 + i),
        ...Array.from({ length: 30 }, (_, i) => (21 + i) % 40 || 40),
        45, 46, 47, 48
    ],
    blue: [
        ...Array.from({ length: 20 }, (_, i) => 21 + i),
        ...Array.from({ length: 20 }, (_, i) => (1 + i) % 40 || 40),
        49, 50, 51, 52
    ],
    yellow: [
        ...Array.from({ length: 30 }, (_, i) => 31 + i),
        ...Array.from({ length: 10 }, (_, i) => (1 + i) % 40 || 40),
        53, 54, 55, 56
    ]
};

// Endfelder für jede Farbe
const END_SLOTS = {
    red: [41, 42, 43, 44],
    green: [45, 46, 47, 48],
    blue: [49, 50, 51, 52],
    yellow: [53, 54, 55, 56]
};

module.exports = {
    MAIN_PATH,
    START_POSITIONS,
    PATHS,
    END_SLOTS
};
