// Game Configuration
const CONFIG = {
    gravity: 0.6,
    jumpForce: -9,  // Reduced from -12 for smoother, more controlled jumps
    gameSpeed: 3,
    buildingGap: 200,
    buildingSpacing: 320, // Increased spacing
    minBuildingHeight: 100,
    maxBuildingHeight: 400,
};

// Game State
const gameState = {
    isPlaying: false,
    score: 0,
    highScore: localStorage.getItem('flappySnakeHighScore') || 0,
    frames: 0,
    autoMoveTimer: 0,
    autoMoveDuration: 30, // 0.5 seconds at 60fps
};

// Assets
const barrierImage = new Image();
barrierImage.src = 'barrier.jpg';
// Audio handled via AudioContext

// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    // Re-generate nature when canvas resizes to fill new width
    initNature();
}

// Nature Data Storage (for static rendering)
const natureData = {
    trees: [],
    grassL1: [],
    grassL2: [],
    grassL3: []
};

function initNature() {
    natureData.trees = [];
    natureData.grassL1 = [];
    natureData.grassL2 = [];
    natureData.grassL3 = [];

    // Generate Trees (Plain Forest - Dense)
    for (let x = 0; x < canvas.width; x += 15) { // Dense spacing
        const h = 40 + Math.random() * 80;
        const w = 15 + Math.random() * 20;
        const hasClutter = Math.random() > 0.3;

        natureData.trees.push({ x, h, w, hasClutter });
    }

    // Generate Grass Layer 1 (Deep)
    for (let x = 0; x < canvas.width; x += 12) {
        natureData.grassL1.push({
            x,
            h: 20 + Math.random() * 15
        });
    }

    // Generate Grass Layer 2 (Mid)
    for (let x = 0; x < canvas.width; x += 8) {
        natureData.grassL2.push({
            x,
            h: 15 + Math.random() * 10
        });
    }

    // Generate Grass Layer 3 (Front)
    for (let x = 0; x < canvas.width; x += 5) {
        natureData.grassL3.push({
            x,
            h: 10 + Math.random() * 8
        });
    }
}

// Ensure nature is initialized on load
resizeCanvas(); // This calls initNature
window.addEventListener('resize', resizeCanvas);


// Snake Object
// Rolling Ball Object
const snake = {
    x: 150,
    y: 300,
    width: 30,
    height: 30,
    velocity: 0,
    angle: 0,

    draw() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);

        // Ball Body - 3D Red Sphere
        const gradient = ctx.createRadialGradient(-5, -5, 2, 0, 0, 15);
        gradient.addColorStop(0, '#FF6B6B');
        gradient.addColorStop(0.5, '#FF0000');
        gradient.addColorStop(1, '#8B0000');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.fill();

        // Cross pattern to visualize rotation
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-15, 0);
        ctx.lineTo(15, 0);
        ctx.moveTo(0, -15);
        ctx.lineTo(0, 15);
        ctx.stroke();

        // Highlight/Glow
        ctx.shadowColor = 'rgba(255, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
    },

    update() {
        this.velocity += CONFIG.gravity;
        this.y += this.velocity;

        // Spin animation (faster when falling, backward when jumping)
        // This gives a nice physics feel
        this.angle += 0.1 + (this.velocity * 0.02);

        // Boundary check
        if (this.y + this.height > canvas.height || this.y < 0) {
            gameOver();
        }
    },

    jump() {
        this.velocity = CONFIG.jumpForce;
    },

    reset() {
        this.y = canvas.height / 2;
        this.velocity = 0;
        this.angle = 0;
    }
};

// Building Object (Now using custom image)
class Building {
    constructor(x) {
        this.x = x;
        this.width = 75; // 0.5cm wider (approx)

        const minHeight = CONFIG.minBuildingHeight;
        const maxHeight = canvas.height - CONFIG.buildingGap - CONFIG.minBuildingHeight;

        this.topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
        this.bottomY = this.topHeight + CONFIG.buildingGap;
        this.bottomHeight = canvas.height - this.bottomY;

        this.passed = false;
    }

    draw() {
        // Top Barrier
        this.drawBricks(this.x, 0, this.width, this.topHeight);

        // Bottom Barrier
        this.drawBricks(this.x, this.bottomY, this.width, this.bottomHeight);
    }

    drawBricks(x, y, w, h) {
        ctx.save();

        // Clip to barrier area
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.clip();

        // Wall Background (Mortar)
        ctx.fillStyle = '#A9A9A9'; // Gray mortar
        ctx.fillRect(x, y, w, h);

        // Brick Properties
        const brickH = 20;
        const brickW = 30;
        const gap = 3;

        // Draw Bricks
        for (let by = y; by < y + h; by += brickH + gap) {
            // Offset every other row
            const rowIdx = Math.floor((by - y) / (brickH + gap));
            const isOffset = rowIdx % 2 !== 0;
            const startX = isOffset ? x - brickW / 2 : x;

            for (let bx = startX; bx < x + w; bx += brickW + gap) {
                // Main Brick Color
                ctx.fillStyle = '#B22222'; // Firebrick red
                ctx.fillRect(bx, by, brickW, brickH);

                // 3D Highlight (Top/Left)
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.fillRect(bx, by, brickW, 3);
                ctx.fillRect(bx, by, 3, brickH);

                // 3D Shadow (Bottom/Right)
                ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
                ctx.fillRect(bx, by + brickH - 3, brickW, 3);
                ctx.fillRect(bx + brickW - 3, by, 3, brickH);
            }
        }

        // Outer Border
        ctx.strokeStyle = '#2F4F4F';
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, w, h);

        ctx.restore();
    }

    update() {
        this.x -= CONFIG.gameSpeed;
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }

    collidesWith(snake) {
        const snakeLeft = snake.x;
        const snakeRight = snake.x + snake.width;
        const snakeTop = snake.y;
        const snakeBottom = snake.y + snake.height;

        const buildingLeft = this.x;
        const buildingRight = this.x + this.width;

        if (snakeRight > buildingLeft && snakeLeft < buildingRight) {
            if (snakeTop < this.topHeight || snakeBottom > this.bottomY) {
                return true;
            }
        }

        return false;
    }
}

// Buildings Array
const buildings = [];

function spawnBuilding() {
    const lastBuilding = buildings[buildings.length - 1];
    const x = lastBuilding ? lastBuilding.x + CONFIG.buildingSpacing : canvas.width;
    buildings.push(new Building(x));
}

// Enhanced Nature System (Static Rendering)
function drawNatureSystem() {
    ctx.save();

    // 1. Light Opacity Forest Background
    ctx.fillStyle = '#1a472a'; // Deep forest green
    ctx.globalAlpha = 0.15; // Light opacity

    // Draw pre-generated trees
    natureData.trees.forEach(tree => {
        ctx.beginPath();
        ctx.moveTo(tree.x, canvas.height - 15);
        ctx.lineTo(tree.x + tree.w / 2, canvas.height - 15 - tree.h);
        ctx.lineTo(tree.x + tree.w, canvas.height - 15);
        ctx.fill();

        if (tree.hasClutter) {
            ctx.beginPath();
            ctx.moveTo(tree.x + 10, canvas.height - 15);
            ctx.lineTo(tree.x + 10 + tree.w / 3, canvas.height - 15 - tree.h / 1.5);
            ctx.lineTo(tree.x + 10 + tree.w / 1.5, canvas.height - 15);
            ctx.fill();
        }
    });

    ctx.globalAlpha = 1.0; // Reset opacity
    ctx.lineCap = 'round';

    // 2. Top Vine (Header) - Static
    ctx.strokeStyle = '#006400';
    ctx.fillStyle = '#228B22';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 15);
    for (let x = 0; x < canvas.width; x += 40) {
        ctx.quadraticCurveTo(x + 20, 25, x + 40, 15);

        // Add leaf
        ctx.save();
        ctx.translate(x + 20, 20);
        ctx.beginPath();
        ctx.ellipse(0, 0, 8, 4, Math.PI / 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    ctx.stroke();

    // 3. Dense Grass (Footer) - Triple Layer - Static
    const by = canvas.height;

    // Layer 1: Darkest background grass
    ctx.fillStyle = '#1a472a';
    ctx.beginPath();
    ctx.moveTo(0, by);
    natureData.grassL1.forEach(g => {
        ctx.lineTo(g.x + 6, by - g.h);
        ctx.lineTo(g.x + 12, by);
    });
    ctx.lineTo(canvas.width, by);
    ctx.lineTo(0, by);
    ctx.fill();

    // Layer 2: Mid-tone green
    ctx.fillStyle = '#006400';
    ctx.beginPath();
    ctx.moveTo(0, by);
    natureData.grassL2.forEach(g => {
        ctx.lineTo(g.x + 4, by - g.h);
        ctx.lineTo(g.x + 8, by);
    });
    ctx.lineTo(canvas.width, by);
    ctx.lineTo(0, by);
    ctx.fill();

    // Layer 3: Lighter foreground grass
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.moveTo(0, by);
    natureData.grassL3.forEach(g => {
        ctx.lineTo(g.x + 2, by - g.h);
        ctx.lineTo(g.x + 5, by);
    });
    ctx.lineTo(canvas.width, by);
    ctx.lineTo(0, by);
    ctx.fill();

    ctx.restore();
}

// Background Drawing
function drawBackground() {
    // Light green gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#90EE90'); // Light Green
    gradient.addColorStop(0.5, '#98FB98'); // Pale Green
    gradient.addColorStop(1, '#3CB371'); // Medium Sea Green
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Enhanced Nature System
    drawNatureSystem();
}

// Game Loop
function gameLoop() {
    // Draw background
    drawBackground();

    if (gameState.isPlaying) {
        // Handle auto-move timer (2 seconds at start)
        if (gameState.autoMoveTimer > 0) {
            gameState.autoMoveTimer--;
            // Keep snake steady during auto-move by resetting velocity
            snake.velocity = 0;
            snake.y = canvas.height / 2;
        }

        // Update snake
        snake.update();

        // Update and draw buildings
        buildings.forEach((building, index) => {
            building.update();
            building.draw();

            // Check collision
            if (building.collidesWith(snake)) {
                gameOver();
            }

            // Score when passing building
            if (!building.passed && snake.x > building.x + building.width) {
                building.passed = true;
                gameState.score++;
                updateScore();
            }

            // Remove off-screen buildings
            if (building.isOffScreen()) {
                buildings.splice(index, 1);
            }
        });

        // Spawn new buildings
        if (buildings.length === 0 || buildings[buildings.length - 1].x < canvas.width - CONFIG.buildingSpacing) {
            spawnBuilding();
        }

        gameState.frames++;
    } else {
        // Draw idle buildings
        buildings.forEach(building => building.draw());
    }

    // Always draw snake
    snake.draw();

    requestAnimationFrame(gameLoop);
}

// Input Handling
function handleJump() {
    // Auto-start game on first interaction if not playing
    if (!gameState.isPlaying) {
        const startScreen = document.getElementById('startScreen');
        if (!startScreen.classList.contains('hidden')) {
            startGame();
        }
    }

    if (gameState.isPlaying) {
        snake.jump();
    }
}

canvas.addEventListener('click', handleJump);
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        handleJump();
    }
});

// UI Functions
function updateScore() {
    document.getElementById('scoreValue').textContent = gameState.score;
}

function updateHighScore() {
    document.getElementById('highScoreValue').textContent = gameState.highScore;
}

function startGame() {
    // Reset game state
    gameState.isPlaying = true;
    gameState.score = 0;
    gameState.frames = 0;
    gameState.autoMoveTimer = gameState.autoMoveDuration;

    // Reset snake
    snake.reset();

    // Clear buildings
    buildings.length = 0;
    spawnBuilding();

    // Update UI
    updateScore();

    // Page Transition
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameOverScreen').classList.add('hidden');
    document.getElementById('gameContainer').classList.remove('hidden');

    resizeCanvas();
}

function gameOver() {
    if (!gameState.isPlaying) return;

    gameState.isPlaying = false;

    // Play Game Over Sound (Synthetic)
    playGameOverSound();

    // Update high score
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem('flappySnakeHighScore', gameState.highScore);
        updateHighScore();
    }

    // Show game over screen
    document.getElementById('finalScore').textContent = gameState.score;

    const resultMessage = document.getElementById('resultMessage');
    if (gameState.score > gameState.highScore - 1) {
        resultMessage.textContent = '🏆 NEW HIGH SCORE! 🏆';
        resultMessage.style.color = '#FFD700';
    } else if (gameState.score > 20) {
        resultMessage.textContent = '🔥 AMAZING! 🔥';
        resultMessage.style.color = '#FF4500';
    } else if (gameState.score > 10) {
        resultMessage.textContent = '👍 GOOD JOB! 👍';
        resultMessage.style.color = '#FFA500';
    } else {
        resultMessage.textContent = 'Keep practicing!';
        resultMessage.style.color = '#FF8C00';
    }

    setTimeout(() => {
        // Page Transition
        document.getElementById('gameContainer').classList.add('hidden');
        document.getElementById('gameOverScreen').classList.remove('hidden');
    }, 500);
}

// Event Listeners
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('restartButton').addEventListener('click', startGame);

// Audio Synthesizer
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playGameOverSound() {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
    oscillator.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.5); // Drop to A2

    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
}

// Initialize
updateHighScore();
spawnBuilding();
gameLoop();
