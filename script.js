const canvas = document.getElementById("gameCanvas");
const timeDisplay = document.getElementById("timeDisplay");
const scoreBarProgress = document.getElementById("scoreBarProgress");
const scoreText = document.getElementById("scoreText");
const clockTens = document.getElementById("clockTens");
const clockOnes = document.getElementById("clockOnes");
const ctx = canvas.getContext("2d");

let score = 0;
let countdown = 60;
let gameStarted = false;

let isPaused = false; // Estado del juego (inicialmente no está pausado)
let gameInterval; // Variable que almacena el intervalo de actualización del juego (si usas intervalos)
let timer; // Variable del temporizador del juego (si lo tienes)

// Referencias al botón y al audio
const toggleMusicButton = document.getElementById("toggleMusic");
const backgroundMusic = document.getElementById("backgroundMusic");

// Reproducir música por defecto
backgroundMusic.play();

// Variable para controlar el estado de la música
let musicOn = true;

// Función para alternar la música
function toggleMusic() {
    if (musicOn) {
        backgroundMusic.pause(); // Detener música
        toggleMusicButton.textContent = "🔇"; // Cambiar el ícono del botón
    } else {
        backgroundMusic.play(); // Reproducir música
        toggleMusicButton.textContent = "🔊"; // Cambiar el ícono del botón
    }
    musicOn = !musicOn; // Cambiar el estado
}

// Asignar el evento de clic al botón
toggleMusicButton.addEventListener("click", toggleMusic);

const colors = ["green", "yellow", "red", "violet"];

const digitImages = [
    "Resources/cero.gif",
    "Resources/uno.gif",
    "Resources/dos.gif",
    "Resources/tres.gif",
    "Resources/cuatro.gif",
    "Resources/cinco.gif",
    "Resources/seis.gif",
    "Resources/siete.gif",
    "Resources/ocho.gif",
    "Resources/nueve.gif",
];

const player = {
    x: 120,
    y: 450,
    width: 40,
    height: 40,
    image: new Image(),
    body: new Image(),
};
player.image.src = "Resources/player.gif";
player.body.src = "Resources/homen1.gif";

const foodTypes = [
    { image: "Resources/pizza.gif", points: 10 },
    { image: "Resources/hotdog.gif", points: 20 },
    { image: "Resources/helado.gif", points: 30 },
    { image: "Resources/hamburguer.gif", points: 40 },
    { image: "Resources/donut.gif", points: 50 },
];

let food = {
    x: Math.random() * (canvas.width - 40),
    y: Math.random() * (canvas.height - 40),
    width: 40,
    height: 40,
    image: new Image(),
    points: 0,
};

function generateRandomFood() {
    const randomFood = foodTypes[Math.floor(Math.random() * foodTypes.length)];
    food.image.src = randomFood.image;
    food.points = randomFood.points;
    food.x = Math.random() * (canvas.width - food.width);
    food.y = Math.random() * (canvas.height - food.height);
}

function updateClock() {
    const tens = Math.floor(countdown / 10);
    const ones = countdown % 10;

    clockTens.src = digitImages[tens];
    clockOnes.src = digitImages[ones];
}

function movePlayer() {
    const speed = 11;

    if (movement.up && player.y > 0) player.y -= speed;
    if (movement.down && player.y < canvas.height - player.height)
        player.y += speed;
    if (movement.left && player.x > 0) player.x -= speed;
    if (movement.right && player.x < canvas.width - player.width)
        player.x += speed;
}

const movement = { up: false, down: false, left: false, right: false };

function checkCollision() {
    if (
        player.x < food.x + food.width &&
        player.x + player.width > food.x &&
        player.y < food.y + food.height &&
        player.y + player.height > food.y
    ) {
        score += food.points;
        generateRandomFood();
        updateScoreBar();
    }
}

function updateScoreBar() {
    let percentage = ((score % 1000) / 1000) * 100;
    let colorIndex = Math.floor(score / 1000) % colors.length;
    scoreBarProgress.style.background = colors[colorIndex];
    scoreBarProgress.style.width = percentage + "%";
    scoreText.textContent = `Puntos:${score}`;
}

function startTimer() {
    const interval = setInterval(() => {
        if (countdown > 0) {
            countdown--;
            updateClock();
        } else {
            clearInterval(interval);
            alert("¡Tiempo fuera! Tu puntuación final es: " + score);
            gameStarted = false;
        }
    }, 1000);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
        player.body,
        player.x,
        player.y + player.height,
        player.width,
        player.height
    );
    ctx.drawImage(
        player.image,
        player.x,
        player.y,
        player.width,
        player.height
    );
    ctx.drawImage(food.image, food.x, food.y, food.width, food.height);
}

function gameLoop() {
    if (gameStarted) {
        movePlayer();
        checkCollision();
        draw();
    }
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") movement.up = true;
    if (e.key === "ArrowDown") movement.down = true;
    if (e.key === "ArrowLeft") movement.left = true;
    if (e.key === "ArrowRight") movement.right = true;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowUp") movement.up = false;
    if (e.key === "ArrowDown") movement.down = false;
    if (e.key === "ArrowLeft") movement.left = false;
    if (e.key === "ArrowRight") movement.right = false;
});

// Variables de los botones
const moveUpButton = document.getElementById("moveUp");
const moveDownButton = document.getElementById("moveDown");
const moveLeftButton = document.getElementById("moveLeft");
const moveRightButton = document.getElementById("moveRight");

// Manejadores de eventos táctiles para los botones
moveUpButton.addEventListener("touchstart", (e) => {
    e.preventDefault(); // Prevenir eventos del navegador

    movement.up = true;
});
moveUpButton.addEventListener("touchend", (e) => {
    e.preventDefault(); // Prevenir eventos del navegador

    movement.up = false;
});

moveDownButton.addEventListener("touchstart", (e) => {
    e.preventDefault(); // Prevenir eventos del navegador

    movement.down = true;
});
moveDownButton.addEventListener("touchend", (e) => {
    e.preventDefault(); // Prevenir eventos del navegador

    movement.down = false;
});

moveLeftButton.addEventListener("touchstart", (e) => {
    e.preventDefault(); // Prevenir eventos del navegador

    movement.left = true;
});
moveLeftButton.addEventListener("touchend", (e) => {
    e.preventDefault(); // Prevenir eventos del navegador

    movement.left = false;
});

moveRightButton.addEventListener("touchstart", (e) => {
    e.preventDefault(); // Prevenir eventos del navegador

    movement.right = true;
});
moveRightButton.addEventListener("touchend", (e) => {
    e.preventDefault(); // Prevenir eventos del navegador

    movement.right = false;
});

// Iniciar juego al hacer clic
document.addEventListener("click", () => {
    if (!gameStarted) {
        gameStarted = true;
        startTimer();
    }
});

setInterval(gameLoop, 1000 / 60);
