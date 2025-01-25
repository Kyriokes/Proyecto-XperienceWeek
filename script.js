const canvas = document.getElementById("gameCanvas"); // Canvas donde se dibuja el juego
const timeDisplay = document.getElementById("timeDisplay"); // Área donde se muestra el tiempo
const scoreBarProgress = document.getElementById("scoreBarProgress"); // Barra de progreso del puntaje
const scoreText = document.getElementById("scoreText"); // Texto que muestra el puntaje
const clockTens = document.getElementById("clockTens"); // Imagen para los diez segundos del reloj
const clockOnes = document.getElementById("clockOnes"); // Imagen para los segundos del reloj
const ctx = canvas.getContext("2d"); // Contexto de dibujo del canvas

// Variables para el juego
let score = 0; // Puntaje inicial
let countdown = 60; // Tiempo de cuenta regresiva en segundos
let gameStarted = false; // Estado del juego, si ha comenzado o no

let isPaused = false; // Estado de pausa del juego
let gameInterval; // Intervalo para la actualización continua del juego
let timer; // Temporizador para la cuenta regresiva

// Referencias al botón de música y al audio
const toggleMusicButton = document.getElementById("toggleMusic"); // Botón de alternancia de música
const backgroundMusic = document.getElementById("backgroundMusic"); // Audio de fondo

// Reproducir música de fondo al iniciar
backgroundMusic.play();

// Variable para controlar si la música está encendida o apagada
let musicOn = true;

// Función para alternar el estado de la música
function toggleMusic() {
    if (musicOn) {
        backgroundMusic.pause(); // Detener música
        toggleMusicButton.textContent = "🔇"; // Cambiar el icono del botón
    } else {
        backgroundMusic.play(); // Reproducir música
        toggleMusicButton.textContent = "🔊"; // Cambiar el icono del botón
    }
    musicOn = !musicOn; // Cambiar el estado de la música
}

// Asignar el evento de clic al botón para alternar la música
toggleMusicButton.addEventListener("click", toggleMusic);

// Array de colores para la barra de puntaje
const colors = ["green", "yellow", "red", "violet"];

// Array de imágenes para los números del reloj
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

// Objeto para el jugador
const player = {
    x: 120,
    y: 450,
    width: 40,
    height: 40,
    image: new Image(), // Imagen del jugador
    body: new Image(), // Imagen del cuerpo del jugador
};
player.image.src = "Resources/player.gif"; // Fuente de la imagen del jugador
player.body.src = "Resources/homen1.gif"; // Fuente de la imagen del cuerpo del jugador

// Tipos de comida con sus respectivas imágenes y puntos
const foodTypes = [
    { image: "Resources/pizza.gif", points: 10 },
    { image: "Resources/hotdog.gif", points: 20 },
    { image: "Resources/helado.gif", points: 30 },
    { image: "Resources/hamburguer.gif", points: 40 },
    { image: "Resources/donut.gif", points: 50 },
];

// Objeto de comida con propiedades iniciales
let food = {
    x: Math.random() * (canvas.width - 40), // Posición aleatoria
    y: Math.random() * (canvas.height - 40), // Posición aleatoria
    width: 40,
    height: 40,
    image: new Image(), // Imagen de la comida
    points: 0, // Puntos de la comida
};

// Función para generar comida aleatoria
function generateRandomFood() {
    const randomFood = foodTypes[Math.floor(Math.random() * foodTypes.length)];
    food.image.src = randomFood.image; // Cambiar imagen
    food.points = randomFood.points; // Asignar puntos
    food.x = Math.random() * (canvas.width - food.width); // Nueva posición aleatoria
    food.y = Math.random() * (canvas.height - food.height); // Nueva posición aleatoria
}

// Función para actualizar el reloj
function updateClock() {
    const tens = Math.floor(countdown / 10); // Obtener decenas
    const ones = countdown % 10; // Obtener unidades

    clockTens.src = digitImages[tens]; // Mostrar decenas
    clockOnes.src = digitImages[ones]; // Mostrar unidades
}

// Función para mover al jugador
function movePlayer() {
    const speed = 11; // Velocidad del jugador

    if (movement.up && player.y > 0) player.y -= speed; // Mover hacia arriba
    if (movement.down && player.y < canvas.height - player.height)
        player.y += speed; // Mover hacia abajo
    if (movement.left && player.x > 0) player.x -= speed; // Mover hacia izquierda
    if (movement.right && player.x < canvas.width - player.width)
        player.x += speed; // Mover hacia derecha
}

// Objeto para almacenar el estado de las teclas
const movement = { up: false, down: false, left: false, right: false };

// Función para comprobar colisiones entre el jugador y la comida
function checkCollision() {
    if (
        player.x < food.x + food.width &&
        player.x + player.width > food.x &&
        player.y < food.y + food.height &&
        player.y + player.height > food.y
    ) {
        score += food.points; // Aumentar el puntaje
        generateRandomFood(); // Generar nueva comida
        updateScoreBar(); // Actualizar la barra de puntaje
    }
}

// Función para actualizar la barra de puntaje
function updateScoreBar() {
    let percentage = ((score % 1000) / 1000) * 100; // Porcentaje de la barra
    let colorIndex = Math.floor(score / 1000) % colors.length; // Cambiar color según puntaje
    scoreBarProgress.style.background = colors[colorIndex]; // Asignar color
    scoreBarProgress.style.width = percentage + "%"; // Actualizar tamaño de la barra
    scoreText.textContent = `Puntos: ${score}`; // Mostrar puntaje
}

// Función para iniciar el temporizador
function startTimer() {
    const interval = setInterval(() => {
        if (countdown > 0) {
            countdown--; // Decrementar el contador
            updateClock(); // Actualizar reloj
        } else {
            clearInterval(interval); // Detener el intervalo
            alert("¡Tiempo fuera! Tu puntuación final es: " + score); // Mostrar mensaje de fin
            gameStarted = false; // Detener el juego
        }
    }, 1000);
}

// Función para dibujar los elementos del juego en el canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas

    // Dibujar al jugador y la comida
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

// Función principal que se ejecuta continuamente para actualizar el juego
function gameLoop() {
    if (gameStarted) {
        movePlayer(); // Mover jugador
        checkCollision(); // Verificar colisiones
        draw(); // Dibujar elementos
    }
}

// Detectar pulsaciones de teclas para mover al jugador
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") movement.up = true;
    if (e.key === "ArrowDown") movement.down = true;
    if (e.key === "ArrowLeft") movement.left = true;
    if (e.key === "ArrowRight") movement.right = true;
});

// Detectar cuando se sueltan las teclas
document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowUp") movement.up = false;
    if (e.key === "ArrowDown") movement.down = false;
    if (e.key === "ArrowLeft") movement.left = false;
    if (e.key === "ArrowRight") movement.right = false;
});

// Variables para los botones táctiles
const moveUpButton = document.getElementById("moveUp");
const moveDownButton = document.getElementById("moveDown");
const moveLeftButton = document.getElementById("moveLeft");
const moveRightButton = document.getElementById("moveRight");

// Manejadores de eventos táctiles para los botones
moveUpButton.addEventListener("touchstart", (e) => {
    e.preventDefault();
    movement.up = true;
});
moveUpButton.addEventListener("touchend", (e) => {
    e.preventDefault();
    movement.up = false;
});

moveDownButton.addEventListener("touchstart", (e) => {
    e.preventDefault();
    movement.down = true;
});
moveDownButton.addEventListener("touchend", (e) => {
    e.preventDefault();
    movement.down = false;
});

moveLeftButton.addEventListener("touchstart", (e) => {
    e.preventDefault();
    movement.left = true;
});
moveLeftButton.addEventListener("touchend", (e) => {
    e.preventDefault();
    movement.left = false;
});

moveRightButton.addEventListener("touchstart", (e) => {
    e.preventDefault();
    movement.right = true;
});
moveRightButton.addEventListener("touchend", (e) => {
    e.preventDefault();
    movement.right = false;
});

// Iniciar el juego al hacer clic en la pantalla
document.addEventListener("click", () => {
    if (!gameStarted) {
        gameStarted = true;
        startTimer(); // Iniciar el temporizador
    }
});

// Iniciar el ciclo del juego (actualización continua)
setInterval(gameLoop, 1000 / 60);
