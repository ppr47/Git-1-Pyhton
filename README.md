# 🔥 Flappy Snake 🐍

A thrilling Flappy Bird-style game where you control a snake navigating through a burning city filled with towering buildings!

![Fire Background](file:///C:/Users/piush/.gemini/antigravity/brain/c9adddee-90cd-470a-8db0-5a2daecb1951/fire_background_1765564665233.png)

## 🎮 Game Features

- **🐍 Snake Character**: Animated green snake with glowing golden eyes
- **🏢 Building Obstacles**: Procedurally generated buildings with lit windows
- **🔥 Fire Effects**: 100+ animated fire particles creating an inferno atmosphere
- **🎯 Scoring System**: Real-time score tracking with high score persistence
- **✨ Premium UI**: Modern glassmorphism design with fire theme

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) runtime installed

### Installation & Running

```bash
# Navigate to the project directory
cd "P:\New app"

# Start the game server
bun run start
```

Then open your browser to:
```
http://localhost:3333
```

## 🎯 How to Play

1. Click **START GAME** button
2. Use **SPACE** key or **CLICK** to make the snake jump
3. Navigate through gaps between buildings
4. Avoid hitting buildings or screen boundaries
5. Try to beat your high score!

## 🛠️ Technology Stack

- **HTML5 Canvas** - Game rendering
- **CSS3** - Fire-themed styling and animations
- **JavaScript** - Game logic and physics
- **Bun** - Runtime and HTTP server

## 📁 Project Structure

```
.
├── index.html      # Game UI structure
├── style.css       # Fire-themed styling
├── game.js         # Core game logic
├── server.js       # Bun HTTP server
└── package.json    # Project configuration
```

## 🎨 Game Mechanics

- **Gravity**: Realistic physics simulation
- **Collision Detection**: Precise hitbox detection
- **Procedural Generation**: Random building heights
- **Velocity-based Animation**: Smooth snake rotation

## 🏆 Scoring

- **+1 point** for each building successfully passed
- High scores saved to browser localStorage
- Performance messages based on your score:
  - 0-10: "Keep practicing!"
  - 11-20: "👍 GOOD JOB! 👍"
  - 21+: "🔥 AMAZING! 🔥"
  - New record: "🏆 NEW HIGH SCORE! 🏆"

## 🎨 Visual Design

### Fire Theme
- Vibrant orange and red color palette
- Animated flame particles
- Glowing text effects
- Metallic building gradient

### Animations
- Floating title screen
- Pulsing score displays
- Glowing button effects
- Smooth transitions

## 📱 Responsive Design

The game automatically adapts to different screen sizes with:
- Scaled fonts for mobile
- Flexible canvas dimensions
- Touch-friendly controls

## 🎮 Controls

| Input | Action |
|-------|--------|
| **SPACE** | Make snake jump |
| **CLICK** | Make snake jump |

## 💾 Data Persistence

High scores are automatically saved to your browser's localStorage and persist across sessions.

## 🔧 Configuration

Game parameters can be adjusted in `game.js`:

```javascript
const CONFIG = {
    gravity: 0.6,           // Gravity force
    jumpForce: -12,         // Jump velocity
    gameSpeed: 3,           // Scroll speed
    buildingGap: 200,       // Gap between buildings
    buildingSpacing: 300,   // Distance between obstacles
};
```

## 📝 License

MIT License - Feel free to modify and use this game!

## 🎊 Enjoy the Game!

Navigate through the burning city and set a new high score! 🔥🐍

---

Made with ❤️ using Bun, HTML5, CSS3, and JavaScript
