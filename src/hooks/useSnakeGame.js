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
  const [food, setFood] = useState(() =>
    getRandomFood(INITIAL_SNAKE)
  );
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [highScore, setHighScore] = useState(
    Number(localStorage.getItem("highScore")) || 0
  );

  const directionRef = useRef(direction);
  directionRef.current = direction;

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

    // Prevent reverse direction
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

  /* ================= MOBILE SWIPE CONTROL ================= */

  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    };

    const handleTouchEnd = (e) => {
      if (!isRunning) return;

      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartX;
      const dy = touch.clientY - touchStartY;

      const minSwipeDistance = 30; // prevent accidental small swipes

      if (Math.abs(dx) < minSwipeDistance && Math.abs(dy) < minSwipeDistance) {
        return;
      }

      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (dx > 0) changeDirection({ x: 1, y: 0 });
        else changeDirection({ x: -1, y: 0 });
      } else {
        // Vertical swipe
        if (dy > 0) changeDirection({ x: 0, y: 1 });
        else changeDirection({ x: 0, y: -1 });
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

    const dynamicSpeed = Math.max(BASE_SPEED - score * 8, 80);

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const newHead = {
          x: prevSnake[0].x + directionRef.current.x,
          y: prevSnake[0].y + directionRef.current.y,
        };

        // WALL COLLISION
        if (
          newHead.x < 0 ||
          newHead.y < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y >= GRID_SIZE
        ) {
          gameOverSound.current?.play().catch(() => {});
          bgMusic.current?.pause();
          setGameOver(true);
          setIsRunning(false);
          return prevSnake;
        }

        // SELF COLLISION
        if (
          prevSnake.some(
            (segment) =>
              segment.x === newHead.x &&
              segment.y === newHead.y
          )
        ) {
          gameOverSound.current?.play().catch(() => {});
          bgMusic.current?.pause();
          setGameOver(true);
          setIsRunning(false);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // EAT FOOD
        if (newHead.x === food.x && newHead.y === food.y) {
          eatSound.current?.play().catch(() => {});
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
    }, dynamicSpeed);

    return () => clearInterval(interval);
  }, [food, isRunning, gameOver, score, highScore]);

  /* ================= START & RESTART ================= */

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