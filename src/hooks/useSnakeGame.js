import { useState, useEffect, useRef } from "react";

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const BASE_SPEED = 200; // faster & smoother base

function getRandomFood(snake) {
  let newFood;

  do {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (
    snake.some(
      (segment) =>
        segment.x === newFood.x && segment.y === newFood.y
    )
  );

  return newFood;
}

export default function useSnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(() => getRandomFood(INITIAL_SNAKE));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const [highScore, setHighScore] = useState(
    Number(localStorage.getItem("highScore")) || 0
  );

  const directionRef = useRef(INITIAL_DIRECTION);
  const animationRef = useRef(null);
  const lastMoveTime = useRef(0);

  /* ================= CHANGE DIRECTION ================= */

  const changeDirection = (newDirection) => {
    if (!isRunning) return;

    const current = directionRef.current;

    // Prevent reverse
    if (
      current.x + newDirection.x === 0 &&
      current.y + newDirection.y === 0
    )
      return;

    directionRef.current = newDirection; // instant update
  };

  /* ================= KEYBOARD ================= */

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowUp") changeDirection({ x: 0, y: -1 });
      if (e.key === "ArrowDown") changeDirection({ x: 0, y: 1 });
      if (e.key === "ArrowLeft") changeDirection({ x: -1, y: 0 });
      if (e.key === "ArrowRight") changeDirection({ x: 1, y: 0 });
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isRunning]);

  /* ================= MOBILE SWIPE ================= */

  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    };

    const handleTouchEnd = (e) => {
      if (!isRunning) return;

      const touch = e.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;

      const threshold = 25;

      if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) > threshold) {
          dx > 0
            ? changeDirection({ x: 1, y: 0 })
            : changeDirection({ x: -1, y: 0 });
        }
      } else {
        if (Math.abs(dy) > threshold) {
          dy > 0
            ? changeDirection({ x: 0, y: 1 })
            : changeDirection({ x: 0, y: -1 });
        }
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isRunning]);

  /* ================= GAME LOOP (SUPER SMOOTH) ================= */

  useEffect(() => {
    if (!isRunning || gameOver) return;

    const gameLoop = (time) => {
      const speed = Math.max(BASE_SPEED - score * 5, 70);

      if (time - lastMoveTime.current > speed) {
        setSnake((prevSnake) => {
          const head = prevSnake[0];
          const newHead = {
            x: head.x + directionRef.current.x,
            y: head.y + directionRef.current.y,
          };

          // Wall collision
          if (
            newHead.x < 0 ||
            newHead.y < 0 ||
            newHead.x >= GRID_SIZE ||
            newHead.y >= GRID_SIZE
          ) {
            endGame();
            return prevSnake;
          }

          // Self collision
          if (
            prevSnake.some(
              (segment) =>
                segment.x === newHead.x &&
                segment.y === newHead.y
            )
          ) {
            endGame();
            return prevSnake;
          }

          const newSnake = [newHead, ...prevSnake];

          if (newHead.x === food.x && newHead.y === food.y) {
            setFood(getRandomFood(newSnake));

            setScore((prev) => {
              const newScore = prev + 1;
              if (newScore > highScore) {
                setHighScore(newScore);
                localStorage.setItem("highScore", newScore);
              }
              return newScore;
            });
          } else {
            newSnake.pop();
          }

          return newSnake;
        });

        lastMoveTime.current = time;
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, gameOver, food, score]);

  /* ================= GAME CONTROL ================= */

  const endGame = () => {
    setGameOver(true);
    setIsRunning(false);
    cancelAnimationFrame(animationRef.current);
  };

  const startGame = () => {
    setGameOver(false);
    setIsRunning(true);
  };

  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(getRandomFood(INITIAL_SNAKE));
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setIsRunning(true);
  };

  return {
    snake,
    food,
    score,
    highScore,
    gameOver,
    GRID_SIZE,
    startGame,
    restartGame,
    isRunning,
    changeDirection,
  };
}