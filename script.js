const canvas = document.getElementById("table");
const ctx = canvas.getContext('2d');

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    velX: 3,
    velY: 3,
    color: "pink"
};

const user = {
    x: 0,
    y: (canvas.height - 100) / 2,
    width: 10,
    height: 100,
    score: 0,
    color: "red"
};

const cpu = {
    x: canvas.width - 10,
    y: (canvas.height - 100) / 2,
    width: 10,
    height: 100,
    score: 0,
    color: "red"
};

function drawRectangle(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

function drawScore(text, x, y) {
    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.fillText(text, x, y);
}

function drawSeparator() {
    for (let i = 0; i <= canvas.height; i += 20) {
        drawRectangle(canvas.width / 2 - 1, i, 2, 10, "pink");
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRectangle(0, 0, canvas.width, canvas.height, "black");
    drawScore(user.score, canvas.width / 4, canvas.height / 5);
    drawScore(cpu.score, 3 * canvas.width / 4, canvas.height / 5);
    drawSeparator();
    drawRectangle(user.x, user.y, user.width, user.height, user.color);
    drawRectangle(cpu.x, cpu.y, cpu.width, cpu.height, cpu.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

function update() {
    ball.x += ball.velX;
    ball.y += ball.velY;

    if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {
        ball.velY = -ball.velY;
    }

    if (ball.x + ball.radius >= canvas.width) {
        user.score++;
        if (user.score === 10) {
            gameOver("You Win!");
        } else {
            restart();
        }
    } else if (ball.x - ball.radius <= 0) {
        cpu.score++;
        if (cpu.score === 10) {
            gameOver("CPU Wins!");
        } else {
            restart();
        }
    }

    if (ball.x + ball.radius >= cpu.x && ball.y >= cpu.y && ball.y <= cpu.y + cpu.height) {
        ball.velX = -ball.velX;
    } else if (ball.x - ball.radius <= user.x + user.width && ball.y >= user.y && ball.y <= user.y + user.height) {
        ball.velX = -ball.velX;
    }

    updateCPU();
}

function gameLoop() {
    draw();
    update();
    requestAnimationFrame(gameLoop);
}

function restart() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velX = -ball.velX;
    ball.velY = -ball.velY;
}

function getMousePos(evt) {
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height / 2;
}

canvas.addEventListener("mousemove", getMousePos);

function updateCPU() {
    const cpuCenter = cpu.y + cpu.height / 2;

    if (cpuCenter < ball.y - 35) {
        cpu.y += 5;
    } else if (cpuCenter > ball.y + 35) {
        cpu.y -= 5;
    }
}

function gameOver(message) {
    alert(message);
}

const restartButton = document.getElementById("restartButton");
restartButton.addEventListener("click", restartGame);

function restartGame() {
    user.score = 0;
    cpu.score = 0;
    restart();
    gameLoop();
}

gameLoop();
