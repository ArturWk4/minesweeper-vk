import { useEffect, useState } from "react";
import { GameState, GameStats } from "../../App";

type ScoreboardProps = {
    size: number;
    gameState: GameState;
    stats: GameStats;
    width?: number;
    changeGameState: (gameState: GameState) => void;
    changeStats: (gameStats: GameStats) => void;
}

const selectImageByGameState = (state: GameState) => {
    switch (state) {
        case GameState.NotStarted:
            return '/smile1.jpg';
        case GameState.Started:
            return '/smile1-pressed.jpg';
        case GameState.CellPressed:
            return '/smile2.jpg';
        case GameState.GameWon:
            return '/smile3.jpg';
        case GameState.GameLost:
            return '/smile4.jpg';
    }
};

const ScoreboardItem = ({ amount }: { amount: number }) => {
    const timerStr = amount > 999 ? '999' : amount.toString().padStart(3, '0');

    return (
        <div className="timer">
            <img style={{ height: '100%' }} src={`/num${timerStr[0]}.jpg`} alt="" />
            <img style={{ height: '100%' }} src={`/num${timerStr[1]}.jpg`} alt="" />
            <img style={{ height: '100%' }} src={`/num${timerStr[2]}.jpg`} alt="" />
        </div>
    );
};

export const Scoreboard = ({ size, gameState, stats, changeStats, width = size * 24 - 8, changeGameState }: ScoreboardProps) => {
    const [seconds, setSeconds] = useState(0);
    useEffect(() => {
        
        if (!stats.startedAt) {
            setSeconds(0);
            return;
        }
        // TODO: activate stopwatch
        const start = stats.startedAt.getTime();
        const end = (stats.finishedAt ?? new Date()).getTime();
        console.log(end - start)
        const interval = setInterval(() => {setSeconds(Math.ceil(end - start) / 1000)}, 1000);
        return () => clearInterval(interval);
    }, [stats.startedAt, stats.finishedAt])

    return (
        <div style={{
            height: '37.5px',
            width: `${width}px`,
            backgroundColor: '#C0C0C0',
            borderLeft: '4px solid #808080',
            borderTop: '4px solid #808080',
            borderRight: '4px solid white',
            borderBottom: '4px solid white',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '4.5px',
        }}>
            <ScoreboardItem amount={stats.bombCount}/>
            <div className="smile" onClick={() => changeGameState(GameState.Started)}>
                <img style={{ height: '100%' }} src={selectImageByGameState(gameState)} alt="" />
            </div>
            <ScoreboardItem amount={seconds}/>
        </div>
    );
};