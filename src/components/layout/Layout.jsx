import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
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
    <div className="h-screen flex flex-col bg-slate-900">

      {/* ===== TOP BAR ===== */}
      <TopBar />

      {/* ===== MAIN SECTION ===== */}
      <div className="flex flex-1 overflow-hidden">

        {/* ===== DESKTOP SIDEBAR ===== */}
        <div className="hidden md:flex w-64 bg-slate-800 border-r border-slate-700">
          <Sidebar
            score={score}
            highScore={highScore}
            onStart={startGame}
            onRestart={restartGame}
            isRunning={isRunning}
          />
        </div>

        {/* ===== GAME AREA ===== */}
        <div className="flex-1 flex items-center justify-center bg-black">

          <GameArea
            snake={snake}
            food={food}
            gameOver={gameOver}
            GRID_SIZE={GRID_SIZE}
            onRestart={restartGame}
            score={score}
            highScore={highScore}
            isRunning={isRunning}
            onStart={startGame}
          />

        </div>
      </div>
    </div>
  );
};

export default Layout;