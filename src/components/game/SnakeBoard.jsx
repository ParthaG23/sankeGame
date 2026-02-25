import { useRef, useEffect, useState } from "react";

const SnakeBoard = ({ snake, food, GRID_SIZE }) => {
  const boardRef = useRef(null);
  const [tileSize, setTileSize] = useState(20);

  /* ===============================
     RESPONSIVE SQUARE BOARD
  =============================== */
  useEffect(() => {
    const resize = () => {
      if (!boardRef.current) return;

      const size = boardRef.current.offsetWidth;
      if (size > 0) {
        setTileSize(size / GRID_SIZE);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [GRID_SIZE]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        ref={boardRef}
        className="relative aspect-square w-full max-w-[600px] bg-black border border-slate-700"
      >
        {/* GRID BACKGROUND */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)
            `,
            backgroundSize: `${tileSize}px ${tileSize}px`,
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
                width: tileSize,
                height: tileSize,
                left: segment.x * tileSize,
                top: segment.y * tileSize,
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
            width: tileSize,
            height: tileSize,
            left: food.x * tileSize,
            top: food.y * tileSize,
            backgroundColor: "#ff2d2d",
            borderRadius: "50%",
            boxShadow: "0 0 15px #ff2d2d",
          }}
        />
      </div>
    </div>
  );
};

export default SnakeBoard;