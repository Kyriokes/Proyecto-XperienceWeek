import  { useState } from "react";
import GameCanvas from "./components/GameCanvas";
import Ranking from "./components/Ranking";
import "./App.css";

const App = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [players, setPlayers] = useState([
        { name: "Jugador1", score: 100 },
        { name: "Jugador2", score: 90 },
        { name: "Jugador3", score: 80 },
        { name: "Jugador4", score: 70 },
        { name: "Jugador5", score: 60 },
        { name: "Jugador6", score: 50 },
        { name: "Jugador7", score: 40 },
        { name: "Jugador8", score: 30 },
        { name: "Jugador9", score: 20 },
        { name: "Jugador10", score: 10 },
    ]);

    const [gameOver, setGameOver] = useState(false);
    const [finalScore, setFinalScore] = useState(0);

    const handleGameOver = (score) => {
        setGameOver(true);
        setFinalScore(score);
        // Agregar el jugador al ranking
        const newPlayer = { name: "Nuevo Jugador", score };
        const updatedPlayers = [...players, newPlayer]
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
        setPlayers(updatedPlayers);
    };

    return (
        <div className="app">
            <header className="header">
                <h1>Juego de la Cuarentena</h1>
            </header>

            <main className="main-content">
                <div className="game-area">
                    {!gameStarted && !gameOver ? (
                        <button onClick={() => setGameStarted(true)}>
                            Comenzar Juego
                        </button>
                    ) : (
                        <GameCanvas onGameOver={handleGameOver} />
                    )}
                </div>

                <div className="ranking-area">
                    <Ranking players={players} />
                </div>
            </main>
        </div>
    );
};

export default App;
