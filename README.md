## Table of Contents
- [Demo](#demo)
- [Screenshots](#screenshots)
- [About the Project](#about-the-project)
  - [Features](#features)
  - [Technologies](#technologies)
- [Installation and Setup](#installation-and-setup)
  - [Requirements](#requirements)
  - [Local Installation](#local-installation)
  - [Deployment with Docker](#deployment-with-docker)
- [Feedback and Contact](#feedback-and-contact)
- [To-Do](#to-do)
- [Enjoy testing the beta version!](#enjoy-testing-the-beta-version)


# Ludo Online (Beta)

## Demo
[**Click here to visit the demo page!**](https://game.ludo.x3.dynu.com/)

---

## Screenshots

### Splash Screen
<img src="images/splashscreen.png" alt="Splash Screen" width="300"/>

### Main Screen
<img src="images/mainscreen.png" alt="Main Screen" width="300"/>

### Game Selection
<img src="images/gameselection.png" alt="Game Selection" width="300"/>

### Query Screen
<img src="images/querryscreen.png" alt="Query Screen" width="300"/>

### Game Screen
<img src="images/gamescreen.png" alt="Game Screen" width="300"/>

---

## About the Project

**Ludo Online** is a real-time multiplayer game developed with modern technology to provide a smooth and exciting gaming experience. The beta version gives you an initial insight into the features and gameplay.

### Features
- **Multiplayer Support:** Play with your friends in real-time.
- **Real-Time Communication:** Fast and stable interactions between players.
- **3D Visualization:** Dynamic game boards for an immersive experience.
- **Cross-Platform:** Playable on desktop and mobile devices.

### Technologies
- **Frontend:** Ionic, React, Three.js, Capacitor
- **Backend:** Node.js, Express, Socket.IO, Docker
- **Database:** MySQL (for player statistics and match tracking)

---

## Installation and Setup

### Requirements
- Node.js (v18 or higher)
- Docker (optional for deployment)

### Local Installation
1. **Clone the repository:**

    ```bash
    git clone https://github.com/xheen908/ludo-online-beta.git
    cd ludo-online-beta
    cd ludo-server
    ```

2. **Install server dependencies:**

    ```bash
    npm install
    ```

3. **Install web demo dependencies:**

    ```bash
    cd ludo-app
    npm install
    ```

4. **Start Backend + Web Demo:**

    ```bash
    cd ..
    node server.js
    ```

5. **Open in browser:**

    ```
    http://localhost:8888
    ```

### Deployment with Docker
1. **Create Docker container:**

    ```bash
    docker build -t ludo-online .
    ```

2. **Run the container:**

    ```bash
    docker run -p 8888:8888 ludo-online
    ```

---

## Feedback and Contact

Do you have feedback, suggestions, or have found bugs? Create an [Issue](https://github.com/xheen908/ludo-online-beta/issues) or contact me directly at **xheen908@gmail.com**.

---

## To-Do
- Asymmetric dice server-side + visual feedback frontend
- Animations
- More game sounds...
- Improvements to UI/UX
- Integration of a ranking system
- Expansion of game modes

---

### Enjoy testing the beta version! 😊


## Table of Contents
- [Demo](#demo)
- [Screenshots](#screenshots)
- [About the Project](#about-the-project)
  - [Features](#features)
  - [Technologies](#technologies)
- [Installation and Setup](#installation-and-setup)
  - [Requirements](#requirements)
  - [Local Installation](#local-installation)
  - [Deployment with Docker](#deployment-with-docker)
- [Feedback and Contact](#feedback-and-contact)
- [To-Do](#to-do)
- [Enjoy testing the beta version!](#enjoy-testing-the-beta-version)


# Ludo Online (Beta)

## Demo
[**Hier geht's zur Demo-Seite!**](https://game.ludo.x3.dynu.com/)

---

## Screenshots

### Splash Screen
<img src="images/splashscreen.png" alt="Splash Screen" width="300"/>

### Mainscreen
<img src="images/mainscreen.png" alt="Mainscreen" width="300"/>

### Game Selection
<img src="images/gameselection.png" alt="Game Selection" width="300"/>

### Querry Screen
<img src="images/querryscreen.png" alt="Querry Screen" width="300"/>

### Game Screen
<img src="images/gamescreen.png" alt="Game Screen" width="300"/>

---

## Über das Projekt

Ludo Online ist ein Echtzeit-Multiplayer-Spiel, das mit moderner Technologie umgesetzt wurde, um eine reibungslose und spannende Spielerfahrung zu bieten. Die Beta-Version gibt dir einen ersten Einblick in die Funktionen und das Gameplay.

### Features
- **Multiplayer-Unterstützung:** Spiele mit deinen Freunden in Echtzeit.
- **Echtzeit-Kommunikation:** Schnelle und stabile Interaktionen zwischen Spielern.
- **3D-Visualisierung:** Dynamische Spielfelder für ein immersives Erlebnis.
- **Plattformübergreifend:** Spielbar auf Desktop und mobilen Geräten.

### Technologien
- **Frontend:** Ionic, React, Three.js, Capacitor
- **Backend:** Node.js, Express, Socket.IO, Docker
- **Datenbank:** MySQL (für Spielerstatistiken und Match-Tracking)

---

## Installation und Setup

### Voraussetzungen
- Node.js (v18 oder höher)
- Docker (falls gewünscht für Deployment)

### Lokale Installation
1. **Repository klonen:**
   ```bash
   git clone https://github.com/xheen908/ludo-online-beta.git
   cd ludo-online-beta
   cd ludo-server
   ```

2. **Server Abhängigkeiten installieren:**
   ```bash
   npm install
   ```

3. **Web Demo Abhängigkeiten installieren:**
   ```bash
   cd ludo-app
   npm install
   ```

3. **Backend + WebDemo starten:**
   ```bash
    cd ..
    node server.js
   ```

4. **Im Browser öffnen:**
   ```
   http://localhost:8888
   ```

### Deployment mit Docker
1. **Docker-Container erstellen:**
   ```bash
   docker build -t ludo-online .
   ```

2. **Container starten:**
   ```bash
   docker run -p 8888:8888 ludo-online
   ```

---

## Feedback und Kontakt

Hast du Feedback, Vorschläge oder Bugs gefunden? Erstelle ein [Issue](https://github.com/xheen908/ludo-online-beta/issues) oder kontaktiere mich direkt unter **xheen908@gmail.com*.

---

## To-Do
- Asymetrische Wüfel Physicalisch Server Seitig + Visual feedback Frontend
- Animationen
- mehr Spielsounds ...
- Verbesserungen am UI/UX
- Integration eines Rankingsystems
- Erweiterung der Spielmodi

---

### Viel Spaß beim Testen der Beta-Version! 😊
