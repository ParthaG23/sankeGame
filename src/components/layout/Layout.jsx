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
    <div className="min-h-screen flex flex-col bg-slate-900">

      {/* ===== TOP BAR ===== */}
      <TopBar />

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex flex-1 overflow-hidden">

        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar
            score={score}
            highScore={highScore}
            onStart={startGame}
            onRestart={restartGame}
            isRunning={isRunning}
          />
        </div>

        {/* Game Area */}
        <div className="flex-1">
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