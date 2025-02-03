const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Constants
const WIDTH = 300;
const HEIGHT = 600;
const GRID_SIZE = 30;
const COLUMNS = WIDTH / GRID_SIZE;
const ROWS = HEIGHT / GRID_SIZE;
const FPS = 10;
let score = 0;

// Colors
const BLACK = 'black';
const WHITE = 'white';
const COLORS = [
    'cyan',   // I shape
    'red',    // Z shape
    'green',  // S shape
    'orange', // L shape
    'blue',   // J shape
    'purple', // T shape
    'yellow'  // O shape
];

// Tetromino shapes
const SHAPES = [
    [[1, 1, 1, 1]],  // I shape
    [[1, 1, 1], [0, 1, 0]],  // T shape
    [[1, 1, 1], [1, 0, 0]],  // L shape
    [[1, 1, 1], [0, 0, 1]],  // J shape
    [[1, 1], [1, 1]],        // O shape
    [[0, 1, 1], [1, 1, 0]],  // S shape
    [[1, 1, 0], [0, 1, 1]]   // Z shape
];

// Tetromino class
class Tetromino {
    constructor(shape, color) {
        this.shape = shape;
        this.color = color;
        this.x = Math.floor(COLUMNS / 2) - Math.floor(shape[0].length / 2);
        this.y = 0;
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    rotate() {
        this.shape = this.shape[0].map((_, i) => this.shape.map(row => row[i])).reverse();
    }
}

let grid = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(BLACK));
let currentTetromino = new Tetromino(getRandomShape(), getRandomColor());
let dropCounter = 0;

// Helper functions
function getRandomShape() {
    return SHAPES[Math.floor(Math.random() * SHAPES.length)];
}

function getRandomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function checkCollision(tetromino) {
    for (let i = 0; i < tetromino.shape.length; i++) {
        for (let j = 0; j < tetromino.shape[i].length; j++) {
            if (tetromino.shape[i][j]) {
                let x = tetromino.x + j;
                let y = tetromino.y + i;
                if (x < 0 || x >= COLUMNS || y >= ROWS || grid[y][x] !== BLACK) {
                    return true;
                }
            }
        }
    }
    return false;
}

function mergeTetromino(tetromino) {
    tetromino.shape.forEach((row, i) => {
        row.forEach((cell, j) => {
            if (cell) {
                grid[tetromino.y + i][tetromino.x + j] = tetromino.color;
            }
        });
    });
}

function clearLines() {
    let linesCleared = 0;

    for (let i = 0; i < grid.length; i++) {
        if (!grid[i].includes(BLACK)) {
            grid.splice(i, 1); // Remove the full line
            grid.unshift(Array(COLUMNS).fill(BLACK)); // Add a new empty line at the top
            linesCleared++;
            i--; // Recheck the same row after shifting
        }
    }

    // Update the score based on lines cleared
    if (linesCleared > 0) {
        score += linesCleared === 1 ? 100 : linesCleared === 2 ? 300 : linesCleared === 3 ? 500 : 800;
    }

    return linesCleared;
}

function drawScore() {
    ctx.fillStyle = WHITE;
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function drawGrid() {
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLUMNS; x++) {
            ctx.fillStyle = grid[y][x];
            ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
            ctx.strokeStyle = WHITE;
            ctx.strokeRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        }
    }
}

function drawTetromino(tetromino) {
    tetromino.shape.forEach((row, i) => {
        row.forEach((cell, j) => {
            if (cell) {
                ctx.fillStyle = tetromino.color;
                ctx.fillRect(
                    (tetromino.x + j) * GRID_SIZE,
                    (tetromino.y + i) * GRID_SIZE,
                    GRID_SIZE,
                    GRID_SIZE
                );
            }
        });
    });
}

// Game loop
function update() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
drawGrid();
drawScore();
drawTetromino(currentTetromino);
    dropCounter++;
    if (dropCounter > FPS) {
        currentTetromino.move(0, 1);
        if (checkCollision(currentTetromino)) {
            currentTetromino.move(0, -1);
            mergeTetromino(currentTetromino);
            clearLines();
            currentTetromino = new Tetromino(getRandomShape(), getRandomColor());
            if (checkCollision(currentTetromino)) {
                alert('Game Over!');
                resetGame();
            }
        }
        dropCounter = 0;
    }

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawGrid();
    drawTetromino(currentTetromino);
    requestAnimationFrame(update);
}

function resetGame() {
    grid = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(BLACK));
    currentTetromino = new Tetromino(getRandomShape(), getRandomColor());
    dropCounter = 0;
    score = 0; // Reset the score
}

// Controls
document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase(); // Normalize to lowercase for simplicity

    if (key === 'arrowleft' || key === 'a') {
        currentTetromino.move(-1, 0);
        if (checkCollision(currentTetromino)) currentTetromino.move(1, 0);
    } else if (key === 'arrowright' || key === 'd') {
        currentTetromino.move(1, 0);
        if (checkCollision(currentTetromino)) currentTetromino.move(-1, 0);
    } else if (key === 'arrowdown' || key === 's') {
        currentTetromino.move(0, 1);
        if (checkCollision(currentTetromino)) currentTetromino.move(0, -1);
    } else if (key === 'arrowup' || key === 'w') {
        currentTetromino.rotate();
        if (checkCollision(currentTetromino)) {
            // Undo rotation if it results in a collision
            for (let i = 0; i < 3; i++) currentTetromino.rotate();
        }
    }
    else if (key === 'a' || key === 'a') {
        currentTetromino.move(-1, 0);
        if (checkCollision(currentTetromino)) currentTetromino.move(1, 0);
    } else if (key === 'd' || key === 'd') {
        currentTetromino.move(1, 0);
        if (checkCollision(currentTetromino)) currentTetromino.move(-1, 0);
    } else if (key === 's' || key === 's') {
        currentTetromino.move(0, 1);
        if (checkCollision(currentTetromino)) currentTetromino.move(0, -1);
    } else if (key === 'w' || key === 'w') {
        currentTetromino.rotate();
        if (checkCollision(currentTetromino)) {
            // Undo rotation if it results in a collision
            for (let i = 0; i < 3; i++) currentTetromino.rotate();
        }
    }
    else if (key === 'A' || key === 'a') {
        currentTetromino.move(-1, 0);
        if (checkCollision(currentTetromino)) currentTetromino.move(1, 0);
    } else if (key === 'D' || key === 'd') {
        currentTetromino.move(1, 0);
        if (checkCollision(currentTetromino)) currentTetromino.move(-1, 0);
    } else if (key === 'S' || key === 's') {
        currentTetromino.move(0, 1);
        if (checkCollision(currentTetromino)) currentTetromino.move(0, -1);
    } else if (key === 'W' || key === 'w') {
        currentTetromino.rotate();
        if (checkCollision(currentTetromino)) {
            // Undo rotation if it results in a collision
            for (let i = 0; i < 3; i++) currentTetromino.rotate();
        }
    }
});
// Start game
update();