// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

// ---------------------------------------
// Express + Socket.IO Setup
// ---------------------------------------
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In Produktion restriktiver einstellen
    methods: ["GET", "POST"],
  },
});

// EJS-Template-Engine aktivieren
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); 
// "views"-Ordner = server/views

// Statische Dateien ausliefern
app.use(express.static("public"));

// Beispiel-Endpoint: "Server läuft"
app.get("/", (req, res) => {
  res.send("Ludo-Server läuft!");
});

// ---------------------------------------
// Datenstrukturen
// ---------------------------------------
const waitingQueues = {
  2: [],
  4: [],
};

const rooms = {}; // { roomId: { players: { color: { pieces, color, socketId } }, gameState: {}, mode: 2|4 } }

// Farben nach Spielmodus
const colorsByMode = {
  2: ['red', 'blue'],
  4: ['red', 'blue', 'green', 'yellow']
};

// ---------------------------------------
// "Admin"-Seite / Debug-Ansicht
// ---------------------------------------
app.get("/admin", (req, res) => {
  // Render "admin.ejs", Übergib waitingQueues & rooms
  // EJS kann daraus eine kleine Tabelle machen.
  res.render("admin", {
    waitingQueues,
    rooms,
  });
});

// ---------------------------------------
// Ludo-Logik (Beispiel: initialGameState, applyMove, etc.)
// ---------------------------------------
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
      };
}

// server.js (Hilfsfunktionen)

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
    } else if (position > 0 && position + roll <= PATHS[playerColor].length) {
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
    return { success: false, message: "Ungültiger Zug: Position außerhalb des Pfades." };
  }

  // Überprüfen auf Kollisionen
  const targetCoords = PATHS[playerColor][newPosition - 1];
  for (const color in gameState.players) {
    if (color !== playerColor) {
      const opponent = gameState.players[color];
      opponent.pieces.forEach((opponentPos, idx) => {
        if (opponentPos > 0 && JSON.stringify(PATHS[color][opponentPos - 1]) === JSON.stringify(targetCoords)) {
          // Kollision! Gegnerische Figur zurück zur Basis
          gameState.players[color].pieces[idx] = 0;
          gameState.message += ` ${playerColor} hat ${color}'s Figur geschlagen!`;
        }
      });
    }
  }

  // Aktualisiere die Position der eigenen Figur
  gameState.players[playerColor].pieces[pieceIndex] = newPosition;
  gameState.message += ` ${playerColor} bewegt Figur ${pieceIndex + 1} auf Position ${newPosition}.`;

  return { success: true };
}

// Wechselt zum nächsten Spieler
function switchPlayer(gameState, room) {
  const playerColors = Object.keys(room.gameState.players).filter(color => room.gameState.players[color].socketId);
  const currentIndex = playerColors.indexOf(gameState.currentPlayer);
  const nextIndex = (currentIndex + 1) % playerColors.length;
  gameState.currentPlayer = playerColors[nextIndex];
  gameState.message += ` Es ist jetzt ${gameState.currentPlayer}'s Zug.`;
}

// Überprüft, ob ein Spieler gewonnen hat
function checkWinner(room, playerColor) {
  const player = room.gameState.players[playerColor];
  return player.pieces.every(piece => piece > 0 && END_SLOTS[playerColor].includes(PATHS[playerColor][piece - 1]))
    ? playerColor
    : null;
}


function applyMove(gameState, moveData, roomId, socketId) {
  const newState = { ...gameState };
  const room = rooms[roomId];
  if (!room) return newState;

  const playerColor = getPlayerColorBySocket(room, socketId);
  if (!playerColor) return { ...newState, error: "Spieler nicht im Raum." };

  switch(moveData.type) {
    case "ROLL_DICE":
      if (newState.currentPlayer !== playerColor) {
        return { ...newState, error: "Es ist nicht dein Zug!" };
      }
      const roll = Math.floor(Math.random() * 6) + 1;
      newState.dice = roll;
      newState.message = `${newState.currentPlayer} hat eine ${roll} gewürfelt!`;

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
      } else {
        // Wechsle den Spieler basierend auf dem Würfelwurf
        if (newState.dice !== 6) {
          switchPlayer(newState, room);
        } else {
          newState.message += ` ${newState.currentPlayer} darf erneut würfeln!`;
          newState.possibleMoves = [];
        }
      }

      break;

    default:
      newState.error = "Unbekannter Zugtyp.";
  }

  // Aktualisiere den Raum mit dem neuen Spielzustand
  rooms[roomId].gameState = newState;
  return newState;
}


// ---------------------------------------
// Hilfsfunktion: checkQueue
// ---------------------------------------
function checkQueue(mode) {
  const needed = parseInt(mode, 10);
  if (waitingQueues[mode].length >= needed) {
    const playersForThisRoom = waitingQueues[mode].splice(0, needed);
    const roomId = uuidv4();
    const gameState = initialGameState(needed);

    // Weisen Sie jedem Spieler eine Farbe und socketId zu
    const assignedPlayers = playersForThisRoom.map((socketId, idx) => ({
      socketId,
      color: colorsByMode[needed][idx]
    }));

    // Raum speichern
    rooms[roomId] = {
      players: {}, // { color: { pieces, color, socketId } }
      gameState,
      mode: needed,
    };

    // Spieler dem Raum zuweisen und Farbe sowie socketId speichern
    assignedPlayers.forEach((player) => {
      const socket = io.sockets.sockets.get(player.socketId);
      if (socket) {
        socket.join(roomId);
        // Update gameState with socketId
        rooms[roomId].gameState.players[player.color].socketId = player.socketId;

        socket.emit("roomAssigned", {
          roomId,
          color: player.color, // Farbe senden
          userId: player.socketId // socket.id als userId
        });
      }
    });

    // Spielstart-Broadcast
    io.to(roomId).emit("gameStarted", rooms[roomId].gameState);
    console.log(`Neuer Raum (Mode ${mode}) erstellt: ${roomId}`);
  }
}

// ---------------------------------------
// Socket.IO-Events
// ---------------------------------------
io.on("connection", (socket) => {
  console.log("Neuer Client verbunden:", socket.id);

  // Beitreten zur Warteschlange
  socket.on("joinQueue", (mode) => {
    const validMode = [2, 4].includes(mode) ? mode : 4;
    waitingQueues[validMode].push(socket.id);
    console.log(`Client ${socket.id} möchte ein ${validMode}-Spiel spielen.`);
    checkQueue(validMode);
  });

  // Spielerbewegung verarbeiten
  socket.on("playerMove", ({ roomId, moveData }) => {
    const room = rooms[roomId];
    if (!room) {
      socket.emit("invalidMove", { message: "Raum nicht gefunden." });
      return;
    }

    const gameState = room.gameState;
    const updatedState = applyMove(gameState, moveData, roomId, socket.id);

    if (updatedState.error) {
      socket.emit("invalidMove", { message: updatedState.error });
      return;
    }

    // Sende das aktualisierte Spiel an alle Spieler im Raum
    io.to(roomId).emit("gameStateUpdate", updatedState);
    console.log(`Spielzustand in Raum ${roomId} aktualisiert.`);
  });

  // Beim Disconnect:
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);

    // Entferne den Client aus den Warteschlangen
    for (const mode of [2, 4]) {
      const idx = waitingQueues[mode].indexOf(socket.id);
      if (idx !== -1) {
        waitingQueues[mode].splice(idx, 1);
        console.log(`Client ${socket.id} aus der Warteschlange für Mode ${mode} entfernt.`);
        break;
      }
    }

    // Entferne den Client aus einem Raum, falls vorhanden
    for (const roomId in rooms) {
      const room = rooms[roomId];
      let playerLeft = false;
      // Durchlaufe alle Spieler im SpielState
      for (const color in room.gameState.players) {
        if (room.gameState.players[color].socketId === socket.id) {
          // Entferne den Spieler
          delete room.gameState.players[color];
          playerLeft = true;
          io.to(roomId).emit("playerLeft", { socketId: socket.id, color });
          console.log(`Client ${socket.id} hat Raum ${roomId} als ${color} verlassen.`);
          break;
        }
      }

      if (playerLeft) {
        // Überprüfe, ob noch Spieler im Raum sind
        const remainingPlayers = Object.keys(room.gameState.players).filter(color => room.gameState.players[color].socketId);
        if (remainingPlayers.length === 0) {
          // Lösche den Raum, wenn keine Spieler mehr da sind
          delete rooms[roomId];
          console.log(`Raum ${roomId} wurde gelöscht, da keine Spieler mehr vorhanden sind.`);
        } else if (room.gameState.gameOver) {
          // Wenn das Spiel vorbei ist, lasse den Raum bestehen oder lösche ihn basierend auf Bedarf
          // Optional: Implementiere weitere Logik hier
        } else {
          // Optional: Wechsle den aktuellen Spieler, falls der verlassende Spieler der aktuelle war
          if (room.gameState.currentPlayer === color) {
            switchPlayer(room.gameState, room);
            io.to(roomId).emit("gameStateUpdate", room.gameState);
          }
        }
        break; // Annahme: Ein Spieler kann nur in einem Raum sein
      }
    }
  });
});

function getPlayerColorBySocket(room, socketId) {
  for (const color in room.gameState.players) {
    if (room.gameState.players[color].socketId === socketId) {
      return color;
    }
  }
  return null;
}

// Ermittelt mögliche Bewegungen basierend auf dem Würfelergebnis
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
    return { success: false, message: "Ungültiger Zug: Position außerhalb des Pfades." };
  }

  // Prüfen auf Kollisionen
  const targetCoords = PATHS[playerColor][newPosition - 1];
  for (const color in gameState.players) {
    if (color !== playerColor) {
      const opponent = gameState.players[color];
      opponent.pieces.forEach((opponentPos, idx) => {
        if (opponentPos > 0 && JSON.stringify(PATHS[color][opponentPos - 1]) === JSON.stringify(targetCoords)) {
          // Kollision! Gegnerische Figur zurück zur Basis
          gameState.players[color].pieces[idx] = 0;
          gameState.message += ` ${playerColor} hat ${color}'s Figur geschlagen!`;
        }
      });
    }
  }

  // Aktualisiere die Position der eigenen Figur
  gameState.players[playerColor].pieces[pieceIndex] = newPosition;
  gameState.message += ` ${playerColor} bewegt Figur ${pieceIndex + 1} auf Position ${newPosition}.`;

  return { success: true };
}

// Wechselt zum nächsten Spieler
function switchPlayer(gameState, room) {
  const playerColors = Object.keys(room.gameState.players).filter(color => room.gameState.players[color].socketId);
  const currentIndex = playerColors.indexOf(gameState.currentPlayer);
  const nextIndex = (currentIndex + 1) % playerColors.length;
  gameState.currentPlayer = playerColors[nextIndex];
  gameState.message += ` Es ist jetzt ${gameState.currentPlayer}'s Zug.`;
}

// Überprüft, ob ein Spieler gewonnen hat
function checkWinner(room, playerColor) {
  const player = room.gameState.players[playerColor];
  const playerEndSlots = END_SLOTS[playerColor];

  if (player.pieces.every(pieceIndex => pieceIndex > 0 && playerEndSlots.includes(PATHS[playerColor][pieceIndex - 1]))) {
    return playerColor;
  }
  return null;
}

// ---------------------------------------
// Server starten
// ---------------------------------------
const PORT = process.env.PORT || 8888;
server.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
