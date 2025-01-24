// src/components/GameCanvas.jsx
import { useEffect, useRef } from "react";

const GameCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Configuración inicial
        const player = { x: 100, y: 100, width: 20, height: 20, speed: 5 };
        const food = { x: 200, y: 200, width: 10, height: 10 };
        let score = 0;
        let countdown = 60;

        // Dibuja el canvas
        function draw() {
            // Limpiar el canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Dibujar jugador
            ctx.fillStyle = "red";
            ctx.fillRect(player.x, player.y, player.width, player.height);

            // Dibujar comida
            ctx.fillStyle = "red";
            ctx.fillRect(food.x, food.y, food.width, food.height);

            // Mostrar puntuación
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.fillText(`Score: ${score}`, 10, 20);

            // Mostrar temporizador
            ctx.fillText(`Time: ${countdown}`, 500, 20);
        }

        // Lógica del temporizador
        const timer = setInterval(() => {
            if (countdown > 0) countdown--;
            draw();
        }, 1000);

        // Manejar eventos de teclado
        const handleKeyDown = (e) => {
            switch (e.key) {
                case "ArrowUp":
                    player.y -= player.speed;
                    break;
                case "ArrowDown":
                    player.y += player.speed;
                    break;
                case "ArrowLeft":
                    player.x -= player.speed;
                    break;
                case "ArrowRight":
                    player.x += player.speed;
                    break;
                default:
                    break;
            }
            draw();
        };

        document.addEventListener("keydown", handleKeyDown);

        // Dibujar por primera vez
        draw();

        return () => {
            clearInterval(timer);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return <canvas ref={canvasRef} width={600} height={600}></canvas>;
};

export default GameCanvas;
