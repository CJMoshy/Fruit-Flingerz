# Fruit Flingerz

A real-time multiplayer web game where players battle it out in fruity mayhem!
Launch various fruits at your opponents while jumping and dodging in fast-paced
arena combat.

## Game Overview

Fruit Flingerz is a multiplayer browser-based game where players compete to
become the elimination leader. Jump around the arena, and fling some fruit! The
more eliminations you get, the closer you are to victory!

## Features

- **Real-time Multiplayer Combat**: Battle against other players in fast-paced
  fruit-flinging action
- **Multiple Game Lobbies**: Create or join different game rooms to play with
  friends
- **Seamless Reconnection**: Got disconnected? No problem! Rejoin your game
  session seamlessly
- **Dynamic Gameplay**: Jump, dodge, and launch your fruit projectiles
  strategically

## Tech Stack

### Frontend

- **Phaser 3**: Powerful HTML5 game framework for smooth 2D gameplay
- **TypeScript**: Type-safe programming for robust game logic
- **WebSocket Client - socket.io**: Real-time communication with the game server

### Backend

- **Node.js**: Fast and scalable server runtime
- **Express**: Web application framework for handling HTTP requests
- **WebSocket Server - socket.io**: Manages real-time game state and player
  communications

## Getting Started

### Prerequisites

- Node.js (v14 or higher), Deno should also work
- npm or a given package manager

### Installation

1. Clone the repository:

```bash
git clone (https://github.com/CJMoshy/Fruit-Flingerz.git)
cd Fruit-Flingerz
```

2. Install dependencies:

```bash
# Install server dependencies
cd backend
npm install

# Install client dependencies
cd ../frontend
npm install
```

3. Start the development servers:

```bash
# Start the backend server
cd backend
npm run build # start typescript compile
npm run start # run the server with nodemon

# In a new terminal, start the frontend
cd frontend
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Game Controls

- **AS**: Move your character left or right
- **W**: Jump
- **Spacebar**: Fling Fruit

## Architecture

The game uses a client-server architecture with WebSocket connections for
real-time communication:

- **Client**: Handles game rendering, input processing, and state interpolation
- **Server**: Manages game state, player synchronization and lobby logic
- **WebSocket Protocol**: Ensures low-latency communication for smooth
  multiplayer experience

## Multiplayer Features

- **Lobby System**: Create private rooms or join public matches
- **Room Management**: Support for multiple concurrent game sessions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the
[LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Massive thank you to Pixel Frog for providing all the assets.
  - check out thier content here -> (https://pixelfrog-assets.itch.io/,
    https://x.com/PixelFrogStudio?mx=2,
    https://itch.io/profile/pixelfrog-assets)
