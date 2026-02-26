import { useState, useEffect, useRef } from "react";

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const BASE_SPEED = 300;

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
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [highScore, setHighScore] = useState(
    Number(localStorage.getItem("highScore")) || 0
  );

  const directionRef = useRef(direction);
  directionRef.current = direction;

  const intervalRef = useRef(null);

  /* ================= SOUND SYSTEM ================= */

  const eatSound = useRef(null);
  const gameOverSound = useRef(null);
  const bgMusic = useRef(null);

  useEffect(() => {
    eatSound.current = new Audio("/sounds/eat.mp3");
    gameOverSound.current = new Audio("/sounds/gameover.mp3");

    bgMusic.current = new Audio("/sounds/bg-music.mp3");
    bgMusic.current.loop = true;
    bgMusic.current.volume = 0.4;
  }, []);

  /* ================= DIRECTION CONTROL ================= */

  const changeDirection = (newDirection) => {
    if (!isRunning) return;

    const { x, y } = directionRef.current;

    // Prevent reverse
    if (x + newDirection.x === 0 && y + newDirection.y === 0) {
      return;
    }

    setDirection(newDirection);
  };

  /* ================= KEYBOARD CONTROL ================= */

  useEffect(() => {
    const handleKey = (e) => {
      if (!isRunning) return;

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

      const min = 30;
      if (Math.abs(dx) < min && Math.abs(dy) < min) return;

      if (Math.abs(dx) > Math.abs(dy)) {
        dx > 0
          ? changeDirection({ x: 1, y: 0 })
          : changeDirection({ x: -1, y: 0 });
      } else {
        dy > 0
          ? changeDirection({ x: 0, y: 1 })
          : changeDirection({ x: 0, y: -1 });
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isRunning]);

  /* ================= GAME LOOP ================= */

  useEffect(() => {
    if (!isRunning || gameOver) return;

    const speed = Math.max(BASE_SPEED - score * 5, 70);

    intervalRef.current = setInterval(() => {
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

        // Self collision (ignore last tail because it moves)
        const body = prevSnake.slice(0, -1);
        if (
          body.some(
            (segment) =>
              segment.x === newHead.x &&
              segment.y === newHead.y
          )
        ) {
          endGame();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Eat food
        if (newHead.x === food.x && newHead.y === food.y) {
          eatSound.current?.play().catch(() => {});

          // 🔥 Particle trigger for canvas
          window.dispatchEvent(
            new CustomEvent("snakeEat", {
              detail: { x: newHead.x, y: newHead.y },
            })
          );

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
    }, speed);

    return () => clearInterval(intervalRef.current);
  }, [food, isRunning, gameOver, score]);

  /* ================= END GAME ================= */

  const endGame = () => {
    gameOverSound.current?.play().catch(() => {});
    bgMusic.current?.pause();
    setGameOver(true);
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  /* ================= START / RESTART ================= */

  const startGame = () => {
    setGameOver(false);
    setIsRunning(true);
    bgMusic.current?.play().catch(() => {});
  };

  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(getRandomFood(INITIAL_SNAKE));
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsRunning(true);
    bgMusic.current?.play().catch(() => {});
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