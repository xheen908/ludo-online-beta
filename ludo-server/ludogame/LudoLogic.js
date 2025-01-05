// server/ludogame/LudoLogic.js

const { PATHS, END_SLOTS } = require('./paths');

// Initialzustand der Spieler und deren Steine
const initialPlayers = {
  red: { pieces: [0, 0, 0, 0], color: '#FF7043' },
  blue: { pieces: [0, 0, 0, 0], color: '#5C6BC0' },
  green: { pieces: [0, 0, 0, 0], color: '#81C784' },
  yellow: { pieces: [0, 0, 0, 0], color: '#FFEB3B' }
};

// Erstelle den initialen Spielstatus
function createInitialGameState(mode) {
    const players = mode === 2
        ? { red: initialPlayers.red, blue: initialPlayers.blue }
        : { ...initialPlayers };

    return {
        players,
        currentPlayer: 'red',
        dice: null,
        message: `Red starts the ${mode}-player game!`
    };
}

// Würfeln
function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

// Überprüfen der möglichen Züge
function getPossibleMoves(gameState, playerColor, roll) {
    const player = gameState.players[playerColor];
    const possibleMoves = [];

    player.pieces.forEach((pos, index) => {
        if (pos === 0 && roll === 6) {
            possibleMoves.push(index);
        } else if (pos > 0 && pos + roll <= PATHS[playerColor].length) {
            possibleMoves.push(index);
        }
    });
    return possibleMoves;
}

// Bewege eine Figur
function movePiece(gameState, playerColor, pieceIndex, roll) {
    const player = gameState.players[playerColor];
    let newPosition = player.pieces[pieceIndex] + roll;

    if (player.pieces[pieceIndex] === 0 && roll === 6) {
        newPosition = 1;
    }

    if (newPosition > PATHS[playerColor].length) {
        return { success: false, message: 'Position außerhalb des Pfades.' };
    }

    const targetCoords = PATHS[playerColor][newPosition - 1];

    for (const color in gameState.players) {
        if (color !== playerColor) {
            const opponent = gameState.players[color];
            opponent.pieces.forEach((pos, idx) => {
                if (pos > 0 && JSON.stringify(PATHS[color][pos - 1]) === JSON.stringify(targetCoords)) {
                    opponent.pieces[idx] = 0;
                    gameState.message += `${playerColor} hat ${color}'s Figur geschlagen!`;
                }
            });
        }
    }

    player.pieces[pieceIndex] = newPosition;
    return { success: true };
}

// Spielerwechsel
function switchPlayer(gameState, mode) {
    const playerColors = mode === 2 ? ['red', 'blue'] : ['red', 'blue', 'green', 'yellow'];
    const currentIndex = playerColors.indexOf(gameState.currentPlayer);
    gameState.currentPlayer = playerColors[(currentIndex + 1) % playerColors.length];
}

// Überprüfen ob ein Spieler gewonnen hat
function checkWinner(gameState, playerColor) {
    const player = gameState.players[playerColor];
    return player.pieces.every(piece => piece > 0 && END_SLOTS[playerColor].includes(PATHS[playerColor][piece - 1]))
        ? playerColor
        : null;
}

module.exports = {
    createInitialGameState,
    rollDice,
    getPossibleMoves,
    movePiece,
    switchPlayer,
    checkWinner
};
