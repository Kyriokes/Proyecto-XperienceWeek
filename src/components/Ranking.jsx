// src/components/Ranking.jsx
import { useState } from "react";
import PropTypes from "prop-types";

const Ranking = ({ players, addPlayer }) => {
    const [name, setName] = useState("");
    const [score, setScore] = useState("");

    const handleSubmit = () => {
        if (name && score) {
            addPlayer(name, parseInt(score));
            setName("");
            setScore("");
        }
    };

    return (
        <div className="ranking">
            <h2>Ranking de los 10 Mejores Jugadores</h2>
            <ul>
                {players.map((player, index) => (
                    <li key={index}>
                        {player.name}: {player.score} puntos
                    </li>
                ))}
            </ul>
            <div className="add-player">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Para guardar tu puntaje ingresa tu nombre"
                />
                <button onClick={handleSubmit}>Enviar</button>
            </div>
        </div>
    );
};

Ranking.propTypes = {
    players: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            score: PropTypes.number.isRequired,
        })
    ).isRequired,
    addPlayer: PropTypes.func.isRequired,
};

export default Ranking;
