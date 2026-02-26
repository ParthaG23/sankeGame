import TopBar from "./TopBar";
import GameArea from "../game/GameArea";
import useSnakeGame from "../../hooks/useSnakeGame";

const Layout = () => {
  const {
    snake,
    food,
    score,
    highScore,
    gameOver,
    GRID_SIZE,
    startGame,
    restartGame,
    isRunning,
  } = useSnakeGame();

  return (
    <div  className="h-screen w-screen flex flex-col bg-slate-900 overflow-hidden">

      {/* ===== LOGO / TOP BAR ===== */}
      <TopBar />

      {/* ===== SCORE + BUTTON ROW ===== */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex justify-between items-center">

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
          onClick={isRunning ? restartGame : startGame}
          className="bg-green-500 hover:bg-green-600 transition px-4 py-2 rounded text-white text-sm font-medium"
        >
          {isRunning ? "Restart" : "Start"}
        </button>

      </div>

      {/* ===== GAME SCREEN FULL ===== */}
      <div className="flex-1 ">

        <GameArea
          snake={snake}
          food={food}
          gameOver={gameOver}
          GRID_SIZE={GRID_SIZE}
          onRestart={restartGame}
        />

      </div>

    </div>
  );
};

export default Layout;