import { useEffect, useRef } from "react";
import GameOverOverlay from "./GameOverOverlay";

const GameArea = ({ snake, food, gameOver, GRID_SIZE, onRestart }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);

  /* ================= CANVAS RESIZE ================= */

  useEffect(() => {
    const canvas = canvasRef.current;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - 120; // subtract top bars height
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  /* ================= PARTICLE CREATION ================= */

  const createParticles = (x, y) => {
    for (let i = 0; i < 12; i++) {
      particlesRef.current.push({
        x,
        y,
        dx: (Math.random() - 0.5) * 6,
        dy: (Math.random() - 0.5) * 6,
        life: 30,
      });
    }
  };

  /* ================= LISTEN EAT EVENT ================= */

  useEffect(() => {
    const handleEat = (e) => {
      const canvas = canvasRef.current;
      const cellWidth = canvas.width / GRID_SIZE;
      const cellHeight = canvas.height / GRID_SIZE;

      createParticles(
        e.detail.x * cellWidth + cellWidth / 2,
        e.detail.y * cellHeight + cellHeight / 2
      );
    };

    window.addEventListener("snakeEat", handleEat);
    return () => window.removeEventListener("snakeEat", handleEat);
  }, [GRID_SIZE]);

  /* ================= MAIN RENDER LOOP ================= */

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let animationFrame;

    const render = () => {
      const cellWidth = canvas.width / GRID_SIZE;
      const cellHeight = canvas.height / GRID_SIZE;

      // Clear background
      ctx.fillStyle = "#0b1220";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      /* ================= DRAW FOOD ================= */

      const pulse = 0.2 * Math.sin(Date.now() * 0.01);

      const foodX = food.x * cellWidth + cellWidth / 2;
      const foodY = food.y * cellHeight + cellHeight / 2;

      ctx.save();
      ctx.shadowColor = "red";
      ctx.shadowBlur = 30;

      const radius = cellWidth / 2.5 + pulse * 8;

      const gradient = ctx.createRadialGradient(
        foodX,
        foodY,
        4,
        foodX,
        foodY,
        radius
      );

      gradient.addColorStop(0, "#ff4d4d");
      gradient.addColorStop(1, "#990000");

      ctx.fillStyle = gradient;

      ctx.beginPath();
      ctx.arc(foodX, foodY, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      /* ================= DRAW SNAKE ================= */

      snake.forEach((segment, index) => {
        const x = segment.x * cellWidth;
        const y = segment.y * cellHeight;

        ctx.save();
        ctx.shadowColor = "#22ff88";
        ctx.shadowBlur = index === 0 ? 25 : 10;

        if (index === 0) {
          const grad = ctx.createLinearGradient(
            x,
            y,
            x + cellWidth,
            y + cellHeight
          );
          grad.addColorStop(0, "#00ff99");
          grad.addColorStop(1, "#00cc66");
          ctx.fillStyle = grad;
        } else {
          ctx.fillStyle = "#16a34a";
        }

        ctx.beginPath();
        ctx.roundRect(x, y, cellWidth, cellHeight, 8);
        ctx.fill();

        // Snake Eyes
        if (index === 0) {
          ctx.fillStyle = "black";
          ctx.beginPath();
          ctx.arc(x + cellWidth * 0.3, y + cellHeight * 0.3, 3, 0, Math.PI * 2);
          ctx.arc(x + cellWidth * 0.7, y + cellHeight * 0.3, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      /* ================= PARTICLES ================= */

      particlesRef.current.forEach((p, i) => {
        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;
        p.life--;

        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
        }
      });

      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrame);
  }, [snake, food, GRID_SIZE]);

  return (
    <div className="relative w-full flex-1 bg-[#0b1220] overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
      {gameOver && <GameOverOverlay onRestart={onRestart} />}
    </div>
  );
};

export default GameArea;