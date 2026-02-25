const SnakeBoard = ({ snake, food, GRID_SIZE }) => {
  const cellSize = 100 / GRID_SIZE;

  return (
    <div className="relative w-full h-full bg-black border border-slate-700 rounded-lg overflow-hidden">

      {/* GRID BACKGROUND */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: `${cellSize}% ${cellSize}%`,
        }}
      />

      {/* SNAKE */}
      {snake.map((segment, index) => {
        const isHead = index === 0;

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              width: `${cellSize}%`,
              height: `${cellSize}%`,
              left: `${segment.x * cellSize}%`,
              top: `${segment.y * cellSize}%`,
              backgroundColor: isHead ? "#22ff88" : "#16a34a",
              borderRadius: "6px",
              boxShadow: isHead
                ? "0 0 12px #22ff88"
                : "0 0 6px #16a34a",
              transition: "all 0.1s linear",
            }}
          />
        );
      })}

      {/* FOOD */}
      <div
        style={{
          position: "absolute",
          width: `${cellSize}%`,
          height: `${cellSize}%`,
          left: `${food.x * cellSize}%`,
          top: `${food.y * cellSize}%`,
          backgroundColor: "#ff2d2d",
          borderRadius: "50%",
          boxShadow: "0 0 15px #ff2d2d",
        }}
      />
    </div>
  );
};

export default SnakeBoard;