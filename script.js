// Lấy tham chiếu đến phần tử canvas
const canvasEl = document.getElementById('game-container');
const ctx = canvasEl.getContext('2d');

// Tạo hình ảnh từ file hình ảnh lớn
const spriteSheet = new Image();
spriteSheet.src = 'hehe.png';

// Tạo hình ảnh icon rắn
const snakeIcon = new Image();
snakeIcon.src = 'hehe.png';

// Hàm kiểm tra xem hình ảnh đã tải xong chưa
spriteSheet.onload = function() {
     // Vẽ hình ảnh nền
     ctx.drawImage(spriteSheet, 0, 0, 400, 400, 0, 0, 400, 400);
};

// Vẽ nền
function drawBackground() {
    ctx.drawImage(spriteSheet, 0, 0, 400, 400, 0, 0, 400, 400);
}

// Định nghĩa thông số vị trí và kích thước cho hình ảnh rắn
const spriteX = 79;
const spriteY = 827;
const spriteWidth = 10;
const spriteHeight = 8;

// Khởi tạo một số biến cần thiết
let snake = [{ x: 200, y: 200 }];
let food = { x: 100, y: 100 };
let dx = 0;
let dy = 0;
let gamePaused = false;
let score = 0;
let lastTimeUpdate = 0;
let gameSpeed = 200;

// Hàm thay đổi tốc độ trò chơi dựa trên độ khó
let gameDifficulty = 150;
function changeSpeed(difficulty) {
    gameDifficulty = difficulty;
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameDifficulty);
    document.getElementById('current-difficulty').innerText = 'Độ khó hiện tại: ' + getDifficultyString(difficulty);
}

// mô tả độ khó
function getDifficultyString(difficulty) {
    if (difficulty === 150) {
        return 'Dễ';
    } else if (difficulty === 100) {
        return 'Vừa';
    } else if (difficulty === 60) {
        return 'Khó';
    } else {
        return 'Không xác định';
    }
}

// Thiết lập vòng lặp trò chơi ban đầu
let gameInterval = setInterval(gameLoop, gameDifficulty);

// Xóa màn hình
function clearScreen() {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
}

// Vẽ rắn
function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        let currentSpriteX = spriteX;
        let currentSpriteY = spriteY;

        if (i === 0) {
            if (dx < 0) {
                ctx.save();
                ctx.scale(-1, 1); // Lật ngang hình ảnh
                if (dx < 0) {
                    ctx.drawImage(spriteSheet, spriteX, spriteY, spriteWidth, spriteHeight, -snake[i].x - 20, snake[i].y, 20, 20);
                }
                ctx.restore();
            } else {
                ctx.drawImage(spriteSheet, currentSpriteX, currentSpriteY, spriteWidth, spriteHeight, snake[i].x, snake[i].y, 20, 20);
            }
        } else {
            if (dx < 0) {
                ctx.save();
                ctx.scale(-1, 1); // Lật ngang hình ảnh
                if (dx < 0) {
                    ctx.drawImage(spriteSheet, spriteX, spriteY, spriteWidth, spriteHeight, -snake[i].x - 20, snake[i].y, 20, 20);
                }
                ctx.restore();
            } else {
                ctx.drawImage(spriteSheet, currentSpriteX, currentSpriteY, spriteWidth, spriteHeight, snake[i].x, snake[i].y, 20, 20);
            }
        }
    }
}

// Di chuyển rắn
function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score += 10;
        document.getElementById('score-display').innerText = 'Score: ' + score;
        generateFood();

        // Thêm icon rắn mới vào đuôi
        const tail = { x: snake[snake.length - 1].x, y: snake[snake.length - 1].y };
        snake.push(tail);
        for (let i = 1; i < snake.length; i++) {
            let currentSegment = snake[i];
            if (dx < 0) {
                ctx.save();
                ctx.scale(-1, 1); // Lật ngang hình ảnh
                ctx.drawImage(spriteSheet, spriteX, spriteY, spriteWidth, spriteHeight, -currentSegment.x - 20, currentSegment.y, 20, 20);
                ctx.restore();
            } else {
                ctx.drawImage(spriteSheet, spriteX, spriteY, spriteWidth, spriteHeight, currentSegment.x, currentSegment.y, 20, 20);
            }
        }
    } else {
        snake.pop();
    }
}

// Vẽ mồi
function drawFood() {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(food.x + 10, food.y + 10, 10, 0, 2 * Math.PI);
    ctx.fill();
}


// Bắt đầu trò chơi mới
function newGame() {
    snake = [{ x: 200, y: 200 }];
    food = { x: 100, y: 100 };
    dx = 0;
    dy = 0;
    score = 0;
    gamePaused = false;
}

// Tạm dừng trò chơi
function pauseGame() {
    gamePaused = true;
}

// Tiếp tục trò chơi
function resumeGame() {
    gamePaused = false;
}

// Vẽ màn hình kết thúc trò chơi
function drawGameOverScreen() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Game Over", canvasEl.width / 2 - 80, canvasEl.height / 2);
    ctx.fillText("Score: " + score, canvasEl.width / 2 - 80, canvasEl.height / 2 + 40);
}


function checkCollision() {
    let isCollided = false;
    if (isWallCollisionOnly) {
        if (snake[0].x < 0) {
            snake[0].x = canvasEl.width - 20;
            isCollided = true;
        } else if (snake[0].x >= canvasEl.width) {
            snake[0].x = 0;
            isCollided = true;
        } else if (snake[0].y < 0) {
            snake[0].y = canvasEl.height - 20;
            isCollided = true;
        } else if (snake[0].y >= canvasEl.height) {
            snake[0].y = 0;
            isCollided = true;
        }
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            if (!isImmortal && !isWallCollisionOnly) {
                drawGameOverScreen();
                isCollided = true;
            }
        }
    }
    return isCollided;
}


// Tạo mồi mới
function generateFood() {
    const x = Math.floor(Math.random() * (canvasEl.width / 20)) * 20;
    const y = Math.floor(Math.random() * (canvasEl.height / 20)) * 20;
    food = { x: x, y: y };
}

// Vòng lặp trò chơi
function gameLoop() {
    if (!gamePaused) {
        clearScreen();
        drawBackground();
        drawSnake();
        drawFood();
        moveSnake();
        if (checkCollision()) {
            pauseGame();
        }
    }
}

// điều khiến bằng bàn phím
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowUp' && dy !== 20) {
        dx = 0;
        dy = -20;
    } else if (e.key === 'ArrowDown' && dy !== -20) {
        dx = 0;
        dy = 20;
    } else if (e.key === 'ArrowLeft' && dx !== 20) {
        dx = -20;
        dy = 0;
    } else if (e.key === 'ArrowRight' && dx !== -20) {
        dx = 20;
        dy = 0;
    }
});

// Đặt thời gian lặp trò chơi ban đầu
setInterval(gameLoop, gameSpeed);

// Chế độ bất tử
let isImmortal = false;

// Chuyển đổi trạng thái chế độ bất tử
function toggleImmortal() {
    isImmortal = !isImmortal;
    if (isImmortal) {
        document.getElementById('immortal-status').innerText = 'Chế độ Bất Tử: Đã bật';
    } else {
        document.getElementById('immortal-status').innerText = '';
    }
}

function checkCollision() {
    if (
        snake[0].x < 0 ||
        snake[0].x >= canvasEl.width ||
        snake[0].y < 0 ||
        snake[0].y >= canvasEl.height
    ) {
        if (!isImmortal) {
            drawGameOverScreen();
            return true;
        } else {
            if (snake[0].x < 0) {
                snake[0].x = canvasEl.width - 20;
            } else if (snake[0].x >= canvasEl.width) {
                snake[0].x = 0;
            } else if (snake[0].y < 0) {
                snake[0].y = canvasEl.height - 20;
            } else if (snake[0].y >= canvasEl.height) {
                snake[0].y = 0;
            }
        }
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            if (!isImmortal) {
                drawGameOverScreen();
                return true;
            }
        }
    }
    return false;
}
