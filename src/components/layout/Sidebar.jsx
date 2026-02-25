const Sidebar = ({ score, highScore, onStart, onRestart, isRunning }) => {
  return (
    <div className="w-64 h-full bg-slate-800 flex flex-col">

      {/* Logo / Title Top */}
      {/* <div className="p-6 border-b border-gray-700">
        <h2 className="text-green-400 text-xl font-semibold">
          Dashboard
        </h2>
      </div> */}

      {/* Center Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-white space-y-6">

        <div className="text-2xl">
          Score: <span className="text-yellow-400">{score}</span>
        </div>

        <div className="text-2xl">
          High Score: <span className="text-green-400">{highScore}</span>
        </div>

        <button
          onClick={isRunning ? onRestart : onStart}
          className="bg-green-500 hover:bg-green-600 px-8 py-3 rounded-lg text-white font-semibold transition"
        >
          {isRunning ? "Restart" : "Start"}
        </button>

      </div>

      {/* Bottom Info */}
      <div className="p-4 text-sm text-gray-400 text-center border-t border-gray-700">
        Use Arrow Keys to Play
      </div>

    </div>
  );
};

export default Sidebar;