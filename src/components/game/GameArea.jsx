import SnakeBoard from "./SnakeBoard";
import GameOverOverlay from "./GameOverOverlay";

const GameArea = ({
  snake,
  food,
  gameOver,
  GRID_SIZE,
  onRestart,
  score,
  highScore,
  isRunning,
  onStart,
}) => {
  return (
    <div className="flex flex-col h-full bg-black">

      {/* ===== BOARD ===== */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden p-2">
        <SnakeBoard
          snake={snake}
          food={food}
          GRID_SIZE={GRID_SIZE}
        />

        {gameOver && (
          <GameOverOverlay onRestart={onRestart} />
        )}
      </div>

      {/* ===== MOBILE CONTROLS ===== */}
      <div className="md:hidden bg-slate-900 border-t border-slate-700 p-4 flex justify-between items-center">
        <div className="text-white text-sm">
          Score: <span className="text-yellow-400 font-semibold">{score}</span>
        </div>

        <div className="text-white text-sm">
          High: <span className="text-green-400 font-semibold">{highScore}</span>
        </div>

        <button
          onClick={isRunning ? onRestart : onStart}
          className="bg-green-500 hover:bg-green-600 transition px-4 py-2 rounded text-white text-sm font-medium"
        >
          {isRunning ? "Restart" : "Start"}
        </button>
      </div>

    </div>
  );
};

export default GameArea;