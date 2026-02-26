const SnakeBoard = ({ snake, food, GRID_SIZE }) => {
  const cellSize = 100 / GRID_SIZE;

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">

      {/* Keep board perfectly square */}
      <div className="relative h-full aspect-square max-h-full max-w-full overflow-hidden rounded-lg border border-slate-700">

        {/* ===== GRID BACKGROUND ===== */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: `${cellSize}% ${cellSize}%`,
          }}
        />

        {/* ===== SNAKE ===== */}
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
                  ? "0 0 14px #22ff88"
                  : "0 0 8px #16a34a",
                transition: "all 0.08s linear",
              }}
            />
          );
        })}

        {/* ===== FOOD ===== */}
        <div
          style={{
            position: "absolute",
            width: `${cellSize}%`,
            height: `${cellSize}%`,
            left: `${food.x * cellSize}%`,
            top: `${food.y * cellSize}%`,
            backgroundColor: "#ff2d2d",
            borderRadius: "50%",
            boxShadow: "0 0 18px #ff2d2d",
          }}
        />

      </div>
    </div>
  );
};

export default SnakeBoard;