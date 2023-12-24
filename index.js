import playBackgroundAudio from "./sound_effect.js";

const audioEffects = playBackgroundAudio();

const modalGameOver = document.querySelector(".overplayModal");
const modalVictory = document.querySelector(".victoryModal");
const snakeHeadImg = document.getElementById("snakeHead");
const foodIcon = document.getElementById("foodIcon");
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

const gridSize = 25;
let snake = [
  { x: 10, y: 10 },
  { x: 10, y: 10 },
  { x: 10, y: 10 },
  { x: 10, y: 10 },
];
let direction = "right";
let food = { x: 5, y: 5 };
let gameOver = false; // Biến để kiểm tra trạng thái kết thúc trò chơi
let gameRestarted = false; // Biến để kiểm tra xem đã khởi động lại trò chơi hay chưa
let initialSnakeSpeed = 180; // Tốc độ ban đầu của con rắn
let snakeSpeed = initialSnakeSpeed; // Biến để theo dõi tốc độ hiện tại của con rắn
let gameInterval; // Biến để lưu trữ interval
let score = 0; // Biến để lưu trữ điểm số
let level = 1; // Biến để lưu trữ cấp độ khó của game
let isPaused = false;

function drawSnake() {
  // Màu trong suốt (đặt alpha thành 0.5)
  snake.forEach((segment, key) => {
    if (key === 0) {
      context.fillStyle = "white";
      context.fillRect(
        segment.x * gridSize,
        segment.y * gridSize,
        gridSize,
        gridSize
      );
    } else {
      context.fillStyle = "rgba(113,181,69,0.8)";
      context.fillRect(
        segment.x * gridSize,
        segment.y * gridSize,
        gridSize,
        gridSize
      );
    }
  });
}

function drawFood() {
  context.fillStyle = "rgba(0,0,0,0)";
  context.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function updateScore() {
  audioEffects.scoredSound.currentTime = 0;
  const scoreElement = document.getElementById("score");
  scoreElement.textContent = `Score: ${score}`;
  if (score > 0 && score < 250) {
    // Đặt thời gian phát về 0 và phát âm thanh
    audioEffects.scoredSound.play();
  }
}

function updateLevel() {
  const levelsElement = document.getElementById("levels");
  levelsElement.textContent = `Levels: ${level}`;
  audioEffects.backgroundAudio.src = `./audio/sound_playing_lv${level}.mp3`;
  audioEffects.onSoundLoop.click();
}

function moveSnake() {
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "right") {
    snakeHeadImg.style.transform = "rotate(-90deg)";
    snakeHeadImg.style.left = headX * gridSize + 25 + "px";
    snakeHeadImg.style.top = headY * gridSize - 2 + "px";
    headX++;
  } else if (direction === "left") {
    snakeHeadImg.style.transform = "rotate(90deg)";
    snakeHeadImg.style.left = headX * gridSize - 30 + "px";
    snakeHeadImg.style.top = headY * gridSize - 2 + "px";
    headX--;
  } else if (direction === "up") {
    snakeHeadImg.style.transform = "rotate(180deg)";
    snakeHeadImg.style.left = headX * gridSize - 2 + "px";
    snakeHeadImg.style.top = headY * gridSize - 30 + "px";
    headY--;
  } else if (direction === "down") {
    snakeHeadImg.style.transform = "rotate(0deg)";
    snakeHeadImg.style.left = headX * gridSize - 2 + "px";
    snakeHeadImg.style.top = headY * gridSize + 25 + "px";
    headY++;
  }

  snake.unshift({ x: headX, y: headY });

  if (headX === food.x && headY === food.y) {
    // Snake ate the food
    score += 10; // Tăng điểm số khi ăn thức ăn
    updateScore();
    // Cập nhật điểm số trên màn hình
    if (score % 50 === 0) {
      // Nếu điểm số chia hết cho 100, tăng cấp độ và tốc độ
      level++;
      updateScore();
      updateLevel();
      snakeSpeed -= 35;
      console.log(`tốc độ hiện tại: ${snakeSpeed}`);
      clearInterval(gameInterval);
      gameInterval = setInterval(gameLoop, snakeSpeed);
    }
    generateFood();
  } else {
    // Remove the tail segment
    snake.pop();
  }
  // Cập nhật vị trí và hiển thị hình ảnh đầu con rắn
  snakeHeadImg.style.display = "block";
}

function generateFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * (canvas.width / gridSize)),
      y: Math.floor(Math.random() * (canvas.height / gridSize)),
    };
  } while (
    snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)
  );
  food = newFood;
  foodIcon.style.left = newFood.x * gridSize + "px";
  foodIcon.style.top = newFood.y * gridSize + "px";
  foodIcon.style.display = "block";
}

function checkCollision() {
  const head = snake[0];
  // Check if the snake hits the wall or itself
  if (
    head.x < 0 ||
    head.x >= canvas.width / gridSize ||
    head.y < 0 ||
    head.y >= canvas.height / gridSize
  ) {
    clearInterval(gameInterval);
    if (!gameOver) {
      gameOverFunc();
    }
  }
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      clearInterval(gameInterval);
      if (!gameOver) {
        gameOverFunc();
      }
      break;
    }
  }
}

function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  moveSnake();
  checkCollision();
  drawFood();
  drawSnake();
  if (score === 250) {
    gameVictory();
  }
}

document.addEventListener("keydown", function (event) {
  // Xử lý phím tắt bình thường khi trò chơi đang diễn ra
  if (event.key === "ArrowRight" && direction !== "left") direction = "right";
  else if (event.key === "ArrowLeft" && direction !== "right")
    direction = "left";
  else if (event.key === "ArrowUp" && direction !== "down") direction = "up";
  else if (event.key === "ArrowDown" && direction !== "up") direction = "down";
});

//event restartgame
function restartGame() {
  audioEffects.backgroundAudio.play();
  // Đặt lại tất cả trạng thái cần thiết để khởi động lại trò chơi
  snake = [
    { x: 10, y: 10 },
    { x: 10, y: 10 },
    { x: 10, y: 10 },
    { x: 10, y: 10 },
  ];
  direction = "right";
  gameOver = false;
  generateFood();
  gameRestarted = true; // Đánh dấu rằng đã khởi động lại trò chơi
  snakeSpeed = initialSnakeSpeed; // Đặt lại tốc độ ban đầu
  score = 0;
  level = 1; // Đặt lại điểm số thành 0
  updateScore();
  updateLevel();
  clearInterval(gameInterval); // Xóa interval cũ
  gameInterval = setInterval(gameLoop, snakeSpeed); // Khởi tạo interval mới
}
document.querySelectorAll(".btnRestart").forEach((key) => {
  key.addEventListener("click", restartGame);
});

//event pause game
function pauseGame() {
  const btnPause = document.querySelector(".btnPause");
  if (!isPaused) {
    clearInterval(gameInterval); // Dừng interval nếu đang chạy
    isPaused = true;
    btnPause.innerHTML = "CONTINUE GAME";
    audioEffects.backgroundAudio.pause();
  } else {
    gameInterval = setInterval(gameLoop, snakeSpeed); // Tiếp tục interval nếu đã tắt
    isPaused = false;
    btnPause.innerHTML = "PAUSE GAME";
    audioEffects.backgroundAudio.play();
  }
}
document.querySelector(".btnPause").addEventListener("click", pauseGame);

// event btn startGame
function startGame() {
  updateScore();
  updateLevel();
  generateFood();
  document.querySelector(".gameStart").style.display = "none";
  document.querySelector(".canvas-container").style.display = "block";
  document.querySelector(".toolBar").style.display = "flex";
  audioEffects.onSoundLoop.click();
  gameInterval = setInterval(gameLoop, snakeSpeed);
}
document.querySelector("#startGame").addEventListener("click", startGame);

function gameOverFunc() {
  audioEffects.backgroundAudio.pause();
  audioEffects.backgroundAudio.currentTime = 0;
  audioEffects.gameOverSound.play();
  gameOver = true; // Đặt trạng thái kết thúc trò chơi thành true
  gameRestarted = false; // Đặt trạng thái khởi động lại trò chơi thành false
  modalGameOver.classList.add("active");
}
document
  .getElementById("closeGameOverModal")
  .addEventListener("click", function () {
    audioEffects.gameOverSound.pause();
    audioEffects.gameOverSound.currentTime = 0;
    modalGameOver.classList.remove("active");
  });

function gameVictory() {
  audioEffects.backgroundAudio.pause();
  audioEffects.backgroundAudio.currentTime = 0;
  audioEffects.victorySound.play();
  modalVictory.classList.add("active");
  pauseGame();
}
document
  .getElementById("closeVictoryModal")
  .addEventListener("click", function () {
    audioEffects.victorySound.pause();
    audioEffects.victorySound.currentTime = 0;
    modalVictory.classList.remove("active");
  });
