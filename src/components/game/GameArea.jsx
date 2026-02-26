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
    <div className="w-full h-full flex flex-col">

      {/* ===== GAME BOARD ===== */}
      <div className="flex-1 relative">
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
      <div className="md:hidden bg-slate-900 border-t border-slate-700 px-4 py-3 flex justify-between items-center">

        <div className="text-white text-sm">
          Score:
          <span className="text-yellow-400 font-semibold ml-1">
            {score}
          </span>
        </div>

        <div className="text-white text-sm">
          High:
          <span className="text-green-400 font-semibold ml-1">
            {highScore}
          </span>
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