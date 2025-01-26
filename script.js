const canvas = document.getElementById("gameCanvas"); // Canvas donde se dibuja el juego
const timeDisplay = document.getElementById("timeDisplay"); // Área donde se muestra el tiempo
const scoreBarProgress = document.getElementById("scoreBarProgress"); // Barra de progreso del puntaje
const scoreText = document.getElementById("scoreText"); // Texto que muestra el puntaje
const clockTens = document.getElementById("clockTens"); // Imagen para los diez segundos del reloj
const clockOnes = document.getElementById("clockOnes"); // Imagen para los segundos del reloj
const ctx = canvas.getContext("2d"); // Contexto de dibujo del canvas
// Referencias a los nuevos elementos HTML
const gameOverlay = document.getElementById("gameOverlay"); // Contenedor que cubre el canvas
const startButtonContainer = document.getElementById("startButtonContainer"); // Contenedor del botón de inicio
const startButton = document.getElementById("startButton"); // Botón para iniciar el juego
const scoreContainer = document.getElementById("scoreContainer"); // Contenedor para el puntaje final
const finalScoreText = document.getElementById("finalScore"); // Texto donde se muestra el puntaje final
// Referencias al botón de reiniciar el juego
const restartButton = document.getElementById("restartButton"); // El botón para reiniciar el juego

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
const volumeControl = document.getElementById("volumeControl"); // Control deslizante de volumen

// Establecer el volumen inicial (0.5 equivale a 50%)
backgroundMusic.volume = 0.5;

// Variable para controlar si el evento inicial ya se ejecutó
let firstClick = true;

// Reproducir música por defecto
// backgroundMusic.play();

// Variable para controlar si la música está encendida o apagada
let musicOn = false;

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

// Asignar el evento de clic al botón para la primera vez
toggleMusicButton.addEventListener("click", function handleFirstClick() {
    if (firstClick) {
        // Reproducir música solo en el primer clic
        backgroundMusic
            .play()
            .then(() => {
                toggleMusicButton.textContent = "🔊"; // Cambiar icono a encendido
                musicOn = true; // Actualizar estado de la música
            })
            .catch((error) => {
                console.warn("Autoplay bloqueado por el navegador:", error);
                toggleMusicButton.textContent = "🔇"; // Mantener en silenciado
                musicOn = false;
            });

        // Evitar que este evento se ejecute de nuevo
        firstClick = false;
    } else {
        // Obedecer al estado del botón después del primer clic
        toggleMusic();
    }
});

// // Sincronizar volumen con el control deslizante
volumeControl.addEventListener("input", () => {
    backgroundMusic.volume = volumeControl.value; // Asignar el valor del slider al volumen
});

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
    x: Math.floor(Math.random() * (500 - 100 + 1)) + 100,
    y: Math.floor(Math.random() * (500 - 100 + 1)) + 100,
    width: 50,
    height: 50,
    image: new Image(), // Imagen del jugador
    body: new Image(), // Imagen del cuerpo del jugador
};
player.image.src = "Resources/player.gif"; // Fuente de la imagen del jugador
player.body.src = "Resources/homen1.gif"; // Fuente de la imagen del cuerpo del jugador

// Cambiar el cuerpo del jugador según su puntaje
function changeBody() {
    if (score >= 500) player.body.src = "Resources/homen2.gif";
    if (score >= 1000) player.body.src = "Resources/homen3.gif";
    if (score >= 1500) player.body.src = "Resources/homen4.gif";
}

// Tipos de comida con sus respectivas imágenes y puntos
const foodTypes = [
    { image: "Resources/pizza.gif", points: 30 },
    { image: "Resources/hotdog.gif", points: 20 },
    { image: "Resources/helado.gif", points: 10 },
    { image: "Resources/hamburguer.gif", points: 40 },
    { image: "Resources/donut.gif", points: 50 },
    { image: "Resources/cupcake.gif", points: 60 },
];

// Objeto de comida con propiedades iniciales
let food = {
    x: Math.random() * (canvas.width - 40), // Posición aleatoria
    y: Math.random() * (canvas.height - 40), // Posición aleatoria
    width: 60,
    height: 60,
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
        changeBody(); // Actualiza el cuerpo
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
        player.height,

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

// Función para iniciar el juego
function startGame() {
    gameStarted = true; // Indicar que el juego ha comenzado
    startButtonContainer.style.display = "none"; // Ocultar el botón de inicio
    generateRandomFood(); // Generar comida inmediatamente
    startTimer(); // Iniciar el temporizador
}

// Función para terminar el juego
function endGame() {
    gameStarted = false; // Indicar que el juego ha terminado
    scoreContainer.style.display = "block"; // Mostrar el puntaje final
    finalScoreText.textContent = `Puntuación Final: ${score}`; // Actualizar el texto con la puntuación
    gameOverlay.style.display = "flex"; // Asegurar que la superposición siga visible
}

// Detectar clic en el botón de inicio
startButton.addEventListener("click", () => {
    startGame(); // Iniciar el juego
    gameOverlay.style.display = "none"; // Ocultar la superposición una vez que comienza el juego
});

// Función para actualizar el temporizador
function startTimer() {
    const interval = setInterval(() => {
        if (countdown > 0) {
            countdown--; // Decrementar el contador
            updateClock(); // Actualizar el reloj en pantalla
        } else {
            clearInterval(interval); // Detener el temporizador cuando llegue a cero
            endGame(); // Llamar a la función para terminar el juego
        }
    }, 1000);
}
// Función para reiniciar el juego
function restartGame() {
    score = 0; // Reiniciar el puntaje
    countdown = 60; // Reiniciar el temporizador
    gameStarted = false; // Reiniciar el estado del juego
    gameOverlay.style.display = "flex"; // Asegurarse de que el overlay sea visible
    scoreContainer.style.display = "none"; // Ocultar el puntaje final
    startButtonContainer.style.display = "block"; // Mostrar el botón de inicio de nuevo
    updateScoreBar(); // Actualizar la barra de puntaje
    generateRandomFood(); // Generar una nueva comida
}

// Manejador de evento para el botón de reinicio
restartButton.addEventListener("click", restartGame);

// Iniciar el ciclo del juego (actualización continua)
setInterval(gameLoop, 1000 / 60);
