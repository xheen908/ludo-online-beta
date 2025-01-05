// ludogame/gameLogic.js

const { PATHS, END_SLOTS } = require('./paths');

// Initial Game State
function initialGameState(mode) {
  return mode === 2
    ? {
        players: {
          red: { pieces: [0, 0, 0, 0], color: "#FF7043", socketId: null },
          blue: { pieces: [0, 0, 0, 0], color: "#5C6BC0", socketId: null },
        },
        currentPlayer: "red",
        dice: null,
        message: "Red starts the 2-player game!",
        gameOver: false,
      }
    : {
        players: {
          red: { pieces: [0, 0, 0, 0], color: "#FF7043", socketId: null },
          blue: { pieces: [0, 0, 0, 0], color: "#5C6BC0", socketId: null },
          green: { pieces: [0, 0, 0, 0], color: "#81C784", socketId: null },
          yellow: { pieces: [0, 0, 0, 0], color: "#FFEB3B", socketId: null },
        },
        currentPlayer: "red",
        dice: null,
        message: "Red starts the 4-player game!",
        gameOver: false,
      };
}

// Bestimmt die Farbe des Spielers basierend auf seiner socketId
function getPlayerColorBySocket(room, socketId) {
  for (const color in room.gameState.players) {
    if (room.gameState.players[color].socketId === socketId) {
      return color;
    }
  }
  return null;
}

// Ermittelt mögliche Bewegungen basierend auf dem Wurf
function getPossibleMoves(room, playerColor, roll) {
  const player = room.gameState.players[playerColor];
  const possibleMoves = [];

  player.pieces.forEach((position, index) => {
    if (position === 0 && roll === 6) {
      // Kann eine Figur aus der Basis bewegen
      possibleMoves.push(index);
    } else if (position > 0 && (position + roll) <= PATHS[playerColor].length) {
      // Kann eine Figur entlang des Pfades bewegen
      possibleMoves.push(index);
    }
  });

  return possibleMoves;
}

// Bewegt eine spezifische Figur und handhabt Kollisionen
function movePiece(room, gameState, playerColor, pieceIndex, roll) {
  const player = gameState.players[playerColor];
  let newPosition = player.pieces[pieceIndex] + roll;

  if (player.pieces[pieceIndex] === 0 && roll === 6) {
    newPosition = 1; // Figur aus der Basis bewegen
  }

  // Überprüfen, ob die neue Position gültig ist
  if (newPosition > PATHS[playerColor].length) {
    console.log(`Ungültiger Zug: newPosition (${newPosition}) > PATHS[playerColor].length (${PATHS[playerColor].length})`);
    return { success: false, message: "Ungültiger Zug: Position außerhalb des Pfades." };
  }

  // Überprüfen auf Kollisionen
  const targetCoords = PATHS[playerColor][newPosition - 1];
  for (const color in gameState.players) {
    if (color !== playerColor) {
      const opponent = gameState.players[color];
      opponent.pieces.forEach((opponentPos, idx) => {
        if (
          opponentPos > 0 &&
          JSON.stringify(PATHS[color][opponentPos - 1]) === JSON.stringify(targetCoords)
        ) {
          // Kollision! Gegnerische Figur zurück zur Basis
          gameState.players[color].pieces[idx] = 0;
          gameState.message += ` ${playerColor} hat ${color}'s Figur geschlagen!`;
          console.log(`Kollision: ${playerColor} hat ${color}'s Figur ${idx} geschlagen und zurück zur Basis gesetzt.`);
        }
      });
    }
  }

  // Aktualisiere die Position der eigenen Figur
  gameState.players[playerColor].pieces[pieceIndex] = newPosition;
  gameState.message += ` ${playerColor} bewegt Figur ${pieceIndex + 1} auf Position ${newPosition}.`;
  console.log(`${playerColor} bewegt Figur ${pieceIndex + 1} auf Position ${newPosition}.`);

  return { success: true };
}

// Wechselt zum nächsten Spieler
function switchPlayer(gameState, room) {
  const playerColors = Object.keys(room.gameState.players).filter(color => room.gameState.players[color].socketId);
  const currentIndex = playerColors.indexOf(gameState.currentPlayer);
  const nextIndex = (currentIndex + 1) % playerColors.length;
  gameState.currentPlayer = playerColors[nextIndex];
  gameState.message += ` Es ist jetzt ${gameState.currentPlayer}'s Zug.`;
  console.log(`Wechsel zu Spieler: ${gameState.currentPlayer}`);
}

// Überprüft, ob ein Spieler gewonnen hat
function checkWinner(room, playerColor) {
  const player = room.gameState.players[playerColor];
  return player.pieces.every(piece => {
    if (piece <= 0) return false;
    const coords = PATHS[playerColor][piece - 1];
    return END_SLOTS[playerColor].some(slot => JSON.stringify(slot) === JSON.stringify(coords));
  })
    ? playerColor
    : null;
}

// Verarbeitet einen Spielzug
function applyMove(gameState, moveData, roomId, socketId, rooms) {
  const newState = { ...gameState };
  const room = rooms[roomId];
  if (!room) return { ...newState, error: "Raum nicht gefunden." };

  const playerColor = getPlayerColorBySocket(room, socketId);
  if (!playerColor) return { ...newState, error: "Spieler nicht im Raum." };

  switch (moveData.type) {
    case "ROLL_DICE":
      if (newState.currentPlayer !== playerColor) {
        return { ...newState, error: "Es ist nicht dein Zug!" };
      }
      const roll = Math.floor(Math.random() * 6) + 1;
      newState.dice = roll;
      newState.message = `${newState.currentPlayer} hat eine ${roll} gewürfelt!`;
      console.log(`${newState.currentPlayer} hat eine ${roll} gewürfelt.`);

      // Bestimme mögliche Bewegungen basierend auf dem Würfelergebnis
      const possibleMoves = getPossibleMoves(room, playerColor, roll);
      newState.possibleMoves = possibleMoves;

      if (possibleMoves.length === 0) {
        // Kein gültiger Zug, wechsle den Spieler
        switchPlayer(newState, room);
      }

      break;

    case "MOVE_PIECE":
      if (newState.currentPlayer !== playerColor) {
        return { ...newState, error: "Es ist nicht dein Zug!" };
      }

      const { pieceIndex } = moveData;
      const moveResult = movePiece(room, newState, playerColor, pieceIndex, newState.dice);

      if (!moveResult.success) {
        return { ...newState, error: moveResult.message };
      }

      // Überprüfe auf Gewinn
      const winner = checkWinner(room, playerColor);
      if (winner) {
        newState.message = `${winner} hat das Spiel gewonnen!`;
        newState.gameOver = true;
        console.log(`${winner} hat das Spiel gewonnen!`);
      } else {
        // Wechsle den Spieler basierend auf dem Würfelwurf
        if (newState.dice !== 6) {
          switchPlayer(newState, room);
        } else {
          newState.message += ` ${newState.currentPlayer} darf erneut würfeln!`;
          newState.possibleMoves = [];
          console.log(`${newState.currentPlayer} darf erneut würfeln.`);
        }
      }

      break;

    default:
      newState.error = "Unbekannter Zugtyp.";
      console.log("Unbekannter Zugtyp:", moveData.type);
  }

  // Aktualisiere den Raum mit dem neuen Spielzustand
  rooms[roomId].gameState = newState;
  return newState;
}

module.exports = {
  initialGameState,
  applyMove,
  switchPlayer,
};
