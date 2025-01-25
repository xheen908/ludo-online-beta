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
    docker build -t ludo-online-beta .
    ```

2. **Run the container:**

    ```bash
    docker run -p 8888:8888 ludo-online-beta
    ```

---

## Feedback and Contact

Do you have feedback, suggestions, or have found bugs? Create an [Issue](https://github.com/xheen908/ludo-online-beta/issues) or contact me directly at **xheen908@gmail.com**.

---

## To-Do
- Asymmetric dice server-side + client side visual feedback
- Animations
- More game sounds...
- Improvements to UI/UX
- Integration of Friendlist + Chat
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
