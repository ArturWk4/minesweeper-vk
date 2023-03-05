import { useState } from 'react';
import './App.css';
import { Battlefield, CellDetails } from './components/Battlefield';
import { Scoreboard } from './components/Scoreboard';

export const defaults = {
  SIZE: 16,
  IMG_SIZE: 24,
  BOMBS_COUNT: 40,
};

export enum GameState {
  NotStarted = 'NotStarted',
  Started = 'Started',
  CellPressed = 'CellPressed',
  GameWon = 'GameWon',
  GameLost = 'GameLost',
};

export type GameStats = {
  bombCount: number;
  startedAt?: Date;
  finishedAt?: Date;
};

export type BattlefieldDetails = Array<Array<CellDetails>>;

function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.NotStarted);
  const [gameStats, setGameStats] = useState<GameStats>({
    bombCount: defaults.BOMBS_COUNT,
  });

  return (
    <div className="App">
      <main>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#C0C0C0', width: `${defaults.SIZE * defaults.IMG_SIZE + 8}px`, padding: '8px' }}>
            <Scoreboard size={defaults.SIZE} gameState={gameState} stats={gameStats} changeStats={setGameStats} changeGameState={setGameState}/>
            <div style={{ height: '8px' }}></div>
            <Battlefield gameState={gameState} gameStats={gameStats} changeGameStats={setGameStats} changeGameState={(gameState: GameState) => {setGameState(gameState)}} size={defaults.SIZE} bombsCount={defaults.BOMBS_COUNT} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
