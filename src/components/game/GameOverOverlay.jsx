const GameOverOverlay = ({ onRestart }) => {
  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-red-600 animate-pulse">
          GAME OVER
        </h1>

        <button
          onClick={onRestart}
          className="mt-6 bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-lg text-white font-semibold"
        >
          Restart Game
        </button>
      </div>
    </div>
  );
};

export default GameOverOverlay;