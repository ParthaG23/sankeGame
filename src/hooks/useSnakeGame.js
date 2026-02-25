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

  /* ================= GAME LOOP ================= */

  useEffect(() => {
    if (!isRunning || gameOver) return;

    const dynamicSpeed = Math.max(BASE_SPEED - score * 8, 70);

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
          if (gameOverSound.current) {
            gameOverSound.current.play().catch(() => {});
          }

          if (bgMusic.current) {
            bgMusic.current.pause();
          }

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
          if (gameOverSound.current) {
            gameOverSound.current.play().catch(() => {});
          }

          if (bgMusic.current) {
            bgMusic.current.pause();
          }

          setGameOver(true);
          setIsRunning(false);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // EAT FOOD
        if (newHead.x === food.x && newHead.y === food.y) {
          if (eatSound.current) {
            eatSound.current.play().catch(() => {});
          }

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

  /* ================= KEYBOARD CONTROL ================= */

  useEffect(() => {
    const handleKey = (e) => {
      if (!isRunning) return;

      if (e.key === "ArrowUp" && directionRef.current.y === 0)
        setDirection({ x: 0, y: -1 });

      if (e.key === "ArrowDown" && directionRef.current.y === 0)
        setDirection({ x: 0, y: 1 });

      if (e.key === "ArrowLeft" && directionRef.current.x === 0)
        setDirection({ x: -1, y: 0 });

      if (e.key === "ArrowRight" && directionRef.current.x === 0)
        setDirection({ x: 1, y: 0 });
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isRunning]);

  /* ================= TOUCH CONTROL ================= */

  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleEnd = (e) => {
      if (!isRunning) return;

      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;

      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && directionRef.current.x === 0)
          setDirection({ x: 1, y: 0 });
        else if (dx < 0 && directionRef.current.x === 0)
          setDirection({ x: -1, y: 0 });
      } else {
        if (dy > 0 && directionRef.current.y === 0)
          setDirection({ x: 0, y: 1 });
        else if (dy < 0 && directionRef.current.y === 0)
          setDirection({ x: 0, y: -1 });
      }
    };

    window.addEventListener("touchstart", handleStart);
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("touchstart", handleStart);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isRunning]);

  /* ================= START GAME ================= */

  const startGame = () => {
    setGameOver(false);
    setIsRunning(true);

    if (bgMusic.current) {
      bgMusic.current.play().catch(() => {});
    }
  };

  /* ================= RESTART GAME ================= */

  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(getRandomFood(INITIAL_SNAKE));
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsRunning(true);

    if (bgMusic.current) {
      bgMusic.current.currentTime = 0;
      bgMusic.current.play().catch(() => {});
    }
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
  };
}