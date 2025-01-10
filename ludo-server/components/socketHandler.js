// socketHandler.js

// Beispielweise brauchst du hier dieselben Importe wie vorher in server.js
const { v4: uuidv4 } = require("uuid");
const {
  initialGameState,
  applyMove,
  switchPlayer,
} = require("../ludogame/gameLogic");

/**
 * Exportierte Funktion, die Socket.IO-Logik kapselt
 * 
 * @param {Server} io - Das Socket.IO-Server-Objekt
 * @param {Object} waitingQueues - Objekt mit Warteschlangen
 * @param {Object} rooms - Objekt mit allen Räumen
 * @param {Object} colorsByMode - Farbenzuteilung für 2er- oder 4er-Spiele
 */
function socketHandler(io, waitingQueues, rooms, colorsByMode) {

  // --- Hilfsfunktionen ---

  function checkQueue(mode) {
    const needed = parseInt(mode, 10);
    if (waitingQueues[mode].length >= needed) {
      const playersForThisRoom = waitingQueues[mode].splice(0, needed);
      const roomId = uuidv4();
      const gameState = initialGameState(needed);

      const assignedPlayers = playersForThisRoom.map((socketId, idx) => ({
        socketId,
        color: colorsByMode[needed][idx],
      }));

      rooms[roomId] = {
        players: {},
        gameState,
        mode: needed,
      };

      assignedPlayers.forEach((player) => {
        const socket = io.sockets.sockets.get(player.socketId);
        if (socket) {
          socket.join(roomId);
          rooms[roomId].gameState.players[player.color].socketId = player.socketId;
          socket.emit("roomAssigned", {
            roomId,
            color: player.color,
            userId: player.socketId,
          });
        }
      });

      io.to(roomId).emit("gameStarted", rooms[roomId].gameState);
    }
  }

  function joinRoom(roomId, player) {
    if (rooms[roomId]) {
      rooms[roomId].players.push(player);
      console.log(`Spieler ${player.name} hat Raum ${roomId} betreten.`);
    } else {
      console.error(`Raum ${roomId} existiert nicht.`);
    }
  }

  function leaveRoom(roomId, playerId) {
    if (rooms[roomId]) {
      const index = rooms[roomId].players.findIndex((p) => p.id === playerId);
      if (index !== -1) {
        const removedPlayer = rooms[roomId].players.splice(index, 1)[0];
        console.log(`Spieler ${removedPlayer.name} hat Raum ${roomId} verlassen.`);
      } else {
        console.error(
          `Spieler mit ID ${playerId} nicht in Raum ${roomId} gefunden.`
        );
      }
    } else {
      console.error(`Raum ${roomId} existiert nicht.`);
    }
  }

  // --- Socket.IO Events ---

  io.on("connection", (socket) => {
    console.log("Neuer Client verbunden:", socket.id);

    socket.on("joinRoom", (roomId, player) => {
      joinRoom(roomId, player);
      // Aktualisierte Räume an alle Clients senden
      io.emit("updateRooms", rooms);
    });

    socket.on("leaveRoom", (roomId, playerId) => {
      leaveRoom(roomId, playerId);
      io.emit("updateRooms", rooms);
    });

    socket.on("joinQueue", (mode) => {
      const validMode = [2, 4].includes(mode) ? mode : 4;
      waitingQueues[validMode].push(socket.id);
      checkQueue(validMode);
    });

    socket.on("playerMove", ({ roomId, moveData }) => {
      const room = rooms[roomId];
      if (!room) {
        socket.emit("invalidMove", { message: "Raum nicht gefunden." });
        return;
      }
      const { gameState } = room;
      const updatedState = applyMove(gameState, moveData, roomId, socket.id, rooms);

      if (updatedState.error) {
        socket.emit("invalidMove", { message: updatedState.error });
        return;
      }
      io.to(roomId).emit("gameStateUpdate", updatedState);
      io.to(roomId).emit("updateBoard", updatedState);
    });

    socket.on("disconnect", () => {
      // Aus Warteschlange entfernen
      for (const mode of [2, 4]) {
        const idx = waitingQueues[mode].indexOf(socket.id);
        if (idx !== -1) {
          waitingQueues[mode].splice(idx, 1);
          break;
        }
      }

      // Aus Räumen entfernen
      for (const roomId in rooms) {
        const room = rooms[roomId];
        let playerLeft = false;
        let leavingColor = null;

        for (const color in room.gameState.players) {
          if (room.gameState.players[color].socketId === socket.id) {
            delete room.gameState.players[color];
            playerLeft = true;
            leavingColor = color;
            io.to(roomId).emit("playerLeft", {
              socketId: socket.id,
              color,
            });
            break;
          }
        }

        if (playerLeft) {
          const remainingPlayers = Object.keys(room.gameState.players).filter(
            (c) => room.gameState.players[c].socketId
          );
          if (remainingPlayers.length === 0) {
            // Raum löschen, wenn keiner mehr drin ist
            delete rooms[roomId];
          } else if (
            !room.gameState.gameOver &&
            room.gameState.currentPlayer === leavingColor
          ) {
            switchPlayer(room.gameState, room);
            io.to(roomId).emit("gameStateUpdate", room.gameState);
          }
        }
      }
    });
  });
}

// Export der Funktion
module.exports = { socketHandler };
