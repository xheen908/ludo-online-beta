// server.js

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

// Importiere die Spiellogik
const {
  initialGameState,
  applyMove,
  switchPlayer,
} = require("./ludogame/gameLogic");

// Importiere die Pfade
const { PATHS, END_SLOTS } = require("./ludogame/paths");

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
        // Update gameState mit socketId
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
      console.log(`Raum ${roomId} nicht gefunden.`);
      return;
    }

    const gameState = room.gameState;
    const updatedState = applyMove(gameState, moveData, roomId, socket.id, rooms);

    if (updatedState.error) {
      socket.emit("invalidMove", { message: updatedState.error });
      console.log(`Ungültiger Zug von ${socket.id} in Raum ${roomId}: ${updatedState.error}`);
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
      let leavingColor = null;

      // Durchlaufe alle Spieler im SpielState
      for (const color in room.gameState.players) {
        if (room.gameState.players[color].socketId === socket.id) {
          // Entferne den Spieler
          delete room.gameState.players[color];
          playerLeft = true;
          leavingColor = color;
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
          // Wechsle den aktuellen Spieler, falls der verlassende Spieler der aktuelle war
          if (room.gameState.currentPlayer === leavingColor) {
            switchPlayer(room.gameState, room);
            io.to(roomId).emit("gameStateUpdate", room.gameState);
            console.log(`Spielerwechsel nach dem Verlassen eines Spielers in Raum ${roomId}.`);
          }
        }
        break; // Annahme: Ein Spieler kann nur in einem Raum sein
      }
    }
  });
});

// ---------------------------------------
// Server starten
// ---------------------------------------
const PORT = process.env.PORT || 8888;
server.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
