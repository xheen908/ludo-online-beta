// Ludo.tsx
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Physics } from '@react-three/cannon';
import { IonPage, IonContent, IonButton } from "@ionic/react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Figur from "../assets/models/figur2.stl";
import DiceOutlay from "../assets/models/diceOutlay2.stl";
import DiceInlay from "../assets/models/diceInlay2.stl";
import "./Ludo.css";
import LudoLogic from "./Ludo/LudoLogic"; // Importiere die Spiellogik
import PhysicalDice from "./Ludo/PhysicalDice";
import LudoBoard from "./Ludo/LudoBoard";
import logo from "../assets/menschärgeredichnicht.png";

interface User {
  userId: string;
}

const Ludo = () => {
  // UI-Zustände
  const aktuellesJahr = new Date().getFullYear();
  const [view, setView] = useState<'home' | 'selectMode' | 'waiting' | 'playing'>('home');
  const [mode, setMode] = useState<number | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [playerColor, setPlayerColor] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<number[]>([]);

  // Spiellogik
  const {
    players,
    currentPlayer,
    message,
    dice,
    rollDice,
    checkWinner,
    isAnimating,
    setIsAnimating,
    setMessage, // Hinzugefügt für Nachrichten
    setPlayers, // Stelle sicher, dass setPlayers in LudoLogic verfügbar ist
    setCurrentPlayer, // Stelle sicher, dass setCurrentPlayer in LudoLogic verfügbar ist
    setDice, // Stelle sicher, dass setDice in LudoLogic verfügbar ist
  } = LudoLogic();

  // Ergebnis des Würfels
  const [diceResult, setDiceResult] = useState<number | null>(null);

  // Benutzerstate
  const [user, setUser] = useState<User | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialisiere Socket.IO
  const [socket, setSocket] = useState<Socket | null>(null);

  // Camera Start positions by color
  const getCameraPosition = (color: string | null) => {
    switch (color) {
        case 'red':
            return [0, 30, 15];
        case 'blue':
            return [0, 30, -15];
        case 'yellow':
            return [15, 30, 0];
        case 'green':
            return [-15, 30, 0];
        default:
            return [0, 30, 15]; 
    }
  };

  useEffect(() => {
    const newSocket = io("https://ludogame.x3.dynu.com"); // Stelle sicher, dass die URL korrekt ist
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Verbunden mit dem Server. Socket ID:", newSocket.id);
      setUser({ userId: newSocket.id });
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Verbindung zum Server getrennt.");
      setUser(null);
      setIsConnected(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Debug: Überprüfe, ob socket definiert ist
    console.log("Socket instance:", socket);

    // Empfang von Raumzuweisungen
    socket.on("roomAssigned", ({ roomId, seatIndex, mode, color, userId }) => {
      console.log("roomAssigned event received:", { roomId, seatIndex, mode, color, userId });
      if (user && user.userId === userId) { // Stelle sicher, dass der Raum dem aktuellen Benutzer zugewiesen wird
        setRoomId(roomId);
        setPlayerColor(color); // Farbe speichern
        setView('waiting');
        console.log(`Raum zugewiesen: ${roomId}, Sitz: ${seatIndex}, Modus: ${mode}, Farbe: ${color}, UserID: ${userId}`);
      } else {
        console.log(`roomAssigned: user ${user?.userId} does not match event userId ${userId}`);
      }
    });

    // Empfang des Spielstarts
    socket.on("gameStarted", (initialGameState) => {
      console.log("gameStarted event received:", initialGameState);
      setView('playing');
      setIsAnimating(false); // Falls Animation gestoppt werden soll
      setPlayers(initialGameState.players);
      setCurrentPlayer(initialGameState.currentPlayer);
      setDice(initialGameState.dice);
      setMessage(initialGameState.message);
    });

    // Empfang von Spielstands-Updates
    socket.on("gameStateUpdate", (updatedState) => {
      console.log("gameStateUpdate event received:", updatedState);
      setPlayers(updatedState.players);
      setCurrentPlayer(updatedState.currentPlayer);
      setDice(updatedState.dice);
      setMessage(updatedState.message);
      setPossibleMoves(updatedState.possibleMoves || []);
    });

    // Empfang, wenn ein Spieler das Spiel verlässt
    socket.on("playerLeft", ({ socketId, color }) => {
      console.log("playerLeft event received:", { socketId, color });
      if (user && user.userId === socketId) {
        setMessage(`Du hast das Spiel verlassen.`);
        console.log(`Du hast Raum verlassen: ${socketId}`);
        setView('home'); // Zurück zur Startseite
      } else {
        setMessage(`Ein Spieler hat das Spiel verlassen: ${socketId} (${color})`);
        console.log(`Spieler verlassen: ${socketId} (${color})`);
      }
    });

    // Empfang von ungültigen Zügen
    socket.on("invalidMove", ({ message }) => {
      console.log("invalidMove event received:", message);
      setMessage(message);
    });

    return () => {
      if (socket) {
        socket.off("roomAssigned");
        socket.off("gameStarted");
        socket.off("gameStateUpdate");
        socket.off("playerLeft");
        socket.off("invalidMove");
      }
    };
  }, [socket, user, setIsAnimating, setMessage, setPlayers, setCurrentPlayer, setDice]);

  // Funktion zum Beitreten der Warteschlange
  const joinQueue = (mode: number) => {
    console.log("Attempting to join queue...");
    console.log("User:", user);
    console.log("roomId:", roomId);
    console.log("Socket:", socket);
    console.log("isConnected:", isConnected);

    if (user && roomId === null && socket && isConnected) { // Stelle sicher, dass der Benutzer registriert ist und noch keinem Raum zugewiesen wurde
      socket.emit("joinQueue", mode);
      console.log(`Beitritt zur Warteschlange für ein ${mode}-Spiel`);
      setView('waiting');
    } else {
      console.log("Beitritt zur Warteschlange fehlgeschlagen: Benutzer nicht registriert oder bereits in einem Raum.");
    }
  };

  // Funktion zum Handhaben des Würfel-Ergebnisses
// Ludo.tsx (Client-Seite)

// Funktion zum Handhaben des Würfel-Ergebnisses
const handleRoll = () => {
  if (roomId && user && socket) {
    console.log(`User ${user.userId} is attempting to roll the dice in room ${roomId}`);
    socket.emit("playerMove", { 
      roomId, 
      moveData: { type: "ROLL_DICE" }
    });
    console.log("Würfeln angefragt");
  } else {
    console.log("Roll request failed: roomId oder user ist null");
  }
};

// Funktion zum Bewegen einer Figur
const movePiece = (pieceIndex: number) => {
  if (roomId && user && socket && dice !== null) {
    socket.emit("playerMove", { 
      roomId, 
      moveData: { type: "MOVE_PIECE", pieceIndex }
    });
    console.log(`Bewege Figur ${pieceIndex} in Raum ${roomId}`);
  }
};




  return (
    <IonPage>
      <Header pageTitle="Ludo" />
      <IonContent fullscreen>
        <div className="ludo-container">
          {view === 'home' && (
            <div className="home-screen">
              <img src={logo} alt="Ludo Logo" className="logo" width="200px" />
              <IonButton 
                expand="block" 
                onClick={() => setView('selectMode')}
                disabled={!isConnected} // Button deaktivieren, wenn nicht verbunden
              >
                Neues Spiel
              </IonButton>
              <IonButton 
                expand="block" 
                onClick={() => setView('selectMode')}
                disabled={!isConnected} // Button deaktivieren, wenn nicht verbunden
              >
                Einstellungen
              </IonButton>
              {!isConnected && <p>Verbinde zum Server...</p>}
            </div>
          )}

          {view === 'selectMode' && (
            <div className="select-mode-screen">
              <img src={logo} alt="Ludo Logo" className="logo" width="200px" />
              <h2>Wähle dein Spielmodus:</h2>
              <IonButton 
                expand="block" 
                onClick={() => { setMode(2); joinQueue(2); }}
                disabled={!isConnected} // Button deaktivieren, wenn nicht verbunden
              >
                2 Spieler
              </IonButton>
              <IonButton 
                expand="block" 
                onClick={() => { setMode(4); joinQueue(4); }}
                disabled={!isConnected} // Button deaktivieren, wenn nicht verbunden
              >
                4 Spieler
              </IonButton>
              <IonButton expand="block" color="light" onClick={() => setView('home')}>Zurück</IonButton>
            </div>
          )}

          {view === 'waiting' && (
            <div className="waiting-screen">
              <img src={logo} alt="Ludo Logo" className="logo" width="200px" />
              <h2>Warte auf Spieler...</h2>
              <p>suche...</p>
              {/* Optional: Spinner oder Animation */}
            </div>
          )}

{view === 'playing' && (
  <div className="playing-screen">
    <p></p>
    <p></p>
    <p></p>
    <p>Player Color: {playerColor}</p>
{/*     <p>{message}</p>   */}
    <p>Current Player: {currentPlayer}</p>
    <p>Dice Roll: {dice}</p>
    <IonButton 
      expand="block" 
      onClick={handleRoll} 
      disabled={currentPlayer !== playerColor || possibleMoves.length > 0} // Deaktivieren, wenn nicht am Zug oder Bewegungen ausstehen
      className={currentPlayer === playerColor ? "active-button" : "disabled-button"}
    >
      Würfeln
    </IonButton>
    {currentPlayer === playerColor && possibleMoves.length > 0 && (
      <div className="move-pieces">
        <h3>Wähle eine Figur zum Bewegen:</h3>
        {possibleMoves.map((pieceIndex) => (
          <IonButton 
            key={pieceIndex} 
            onClick={() => movePiece(pieceIndex)} 
            color="primary"
          >
            Figur {pieceIndex + 1}
          </IonButton>
        ))}
      </div>
    )}
      <Canvas 
        camera={{ position: getCameraPosition(playerColor), fov: 20 }} 
        shadows 
        style={{ width: "100%", height: "500px" }}
      >
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 10]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      <OrbitControls enabled={false} />.
      <Physics>
        <LudoBoard
          isAnimating={isAnimating}
          setIsAnimating={setIsAnimating}
          players={players} // Spieler-Daten aus der Logik
          Figur={Figur}
        />
        <PhysicalDice 
          position={[0, 3, 0]} 
          outlayPath={DiceOutlay} 
          inlayPath={DiceInlay} 
          onRoll={handleRoll} // Hier wird die Funktion übergeben
        />
      </Physics>
    </Canvas>
    

    {/* Button für den Wurf */}

    
    {/* Anzeigen der möglichen Züge und ermöglichen, eine Figur zu wählen */}
    
  </div>
)}
        </div>
      </IonContent>
      <Footer text={`© Glovelab 2024-${aktuellesJahr}`} />
    </IonPage>
  );
};

export default Ludo;
