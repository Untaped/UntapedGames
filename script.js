const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;
let snake = [{ x: 10 * box, y: 10 * box }];
let food = {
  x: Math.floor(Math.random() * 20) * box,
  y: Math.floor(Math.random() * 20) * box,
};
let direction = "RIGHT";
let score = 0;
let snakeColor = "green";
let coins = 100;

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (event.key === "w" && direction !== "DOWN") direction = "UP";
  if (event.key === "s" && direction !== "UP") direction = "DOWN";
  if (event.key === "a" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "d" && direction !== "LEFT") direction = "RIGHT";
  if (event.key === "W" && direction !== "DOWN") direction = "UP";
  if (event.key === "S" && direction !== "UP") direction = "DOWN";
  if (event.key === "A" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "D" && direction !== "LEFT") direction = "RIGHT";
  if (event.key === "r" || event.key === "R") {
    restartGame();
  }
  if (event.key === "R" || event.key === "R") {
    restartGame();
  }
  if (event.key === " " || event.key === "R") {
    restartGame();
  }
}

function restartGame() {
  clearInterval(game);
  snake = [{ x: 10 * box, y: 10 * box }];
  food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box,
  };
  direction = "RIGHT";
  score = 0;
  game = setInterval(draw, 150);
}


function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? snakeColor : "data-color";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "UP") snakeY -= box;
  if (direction === "DOWN") snakeY += box;
  if (direction === "LEFT") snakeX -= box;
  if (direction === "RIGHT") snakeX += box;

  if (snakeX === food.x && snakeY === food.y) {
    score++;
    coins += 10;
    food = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box,
    };
  } else {
    snake.pop();
  }

  let newHead = { x: snakeX, y: snakeY };

  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    alert("Game Over! Score: " + score);
  }

  snake.unshift(newHead);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);
  ctx.fillText("Coins: " + coins, 10, 40);
}

function collision(head, array) {
  for (let i = 1; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

let game = setInterval(draw, 150);

// Get the shop items from the HTML
const shopItems = document.querySelectorAll('.shop-item');

// Add event listeners to each shop item
shopItems.forEach((item) => {
  item.addEventListener('click', () => {
    const color = item.getAttribute('data-color');
    const cost = parseInt(item.getAttribute('data-cost'));
    buyItem(color, cost);
  });
});

// Update the buyItem function to update the coins display
function buyItem(color, cost) {
  if (coins >= cost) {
    snakeColor = color;
    coins -= cost;
    document.querySelector('.shop-title').innerHTML = `Snake Skin Shop - Coins: ${coins}`;
  } else {
    alert('Not enough coins!');
  }
}