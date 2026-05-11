(function () {
  "use strict";

  class SnakeGame {
    constructor(config, callbacks) {
      this.config = config;
      this.callbacks = callbacks;
      this.timer = null;
      this.difficultyKey = "normal";
      this.reset();
    }

    reset() {
      this.snake = this.config.initialSnake.map((part) => ({ ...part }));
      this.direction = { ...this.config.initialDirection };
      this.nextDirection = { ...this.config.initialDirection };
      this.food = this.createFood();
      this.score = 0;
      this.status = "idle";
      this.tickCount = 0;
      this.emitChange();
    }

    setDifficulty(key) {
      if (!this.config.difficulty[key]) return;
      this.difficultyKey = key;

      if (this.status === "running") {
        this.stopTimer();
        this.startTimer();
      }

      this.emitChange();
    }

    start() {
      if (this.status === "gameover") this.reset();
      this.status = "running";
      this.startTimer();
      this.emitChange();
    }

    pause() {
      if (this.status !== "running") return;
      this.status = "paused";
      this.stopTimer();
      this.emitChange();
    }

    toggle() {
      if (this.status === "running") {
        this.pause();
      } else {
        this.start();
      }
    }

    changeDirection(directionName) {
      const directions = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 }
      };

      const requested = directions[directionName];
      if (!requested) return;

      const isOpposite =
        requested.x + this.direction.x === 0 &&
        requested.y + this.direction.y === 0;

      if (isOpposite) return;
      this.nextDirection = requested;
    }

    startTimer() {
      this.stopTimer();
      const interval = this.config.difficulty[this.difficultyKey].interval;
      this.timer = window.setInterval(() => this.step(), interval);
    }

    stopTimer() {
      if (this.timer) {
        window.clearInterval(this.timer);
        this.timer = null;
      }
    }

    step() {
      this.direction = this.nextDirection;

      const head = this.snake[0];
      const nextHead = {
        x: head.x + this.direction.x,
        y: head.y + this.direction.y
      };

      if (this.isCollision(nextHead)) {
        this.status = "gameover";
        this.stopTimer();
        this.emitChange();
        return;
      }

      this.snake.unshift(nextHead);

      if (nextHead.x === this.food.x && nextHead.y === this.food.y) {
        this.score += this.config.difficulty[this.difficultyKey].score;
        this.food = this.createFood();
      } else {
        this.snake.pop();
      }

      this.tickCount += 1;
      this.emitChange();
    }

    isCollision(point) {
      const outOfBounds =
        point.x < 0 ||
        point.y < 0 ||
        point.x >= this.config.gridSize ||
        point.y >= this.config.gridSize;

      if (outOfBounds) return true;

      return this.snake.some((part) => part.x === point.x && part.y === point.y);
    }

    createFood() {
      const occupied = new Set(this.snake.map((part) => `${part.x},${part.y}`));
      const available = [];

      for (let y = 0; y < this.config.gridSize; y += 1) {
        for (let x = 0; x < this.config.gridSize; x += 1) {
          if (!occupied.has(`${x},${y}`)) {
            available.push({ x, y });
          }
        }
      }

      if (available.length === 0) return { x: 0, y: 0 };
      return available[Math.floor(Math.random() * available.length)];
    }

    emitChange() {
      if (typeof this.callbacks.onChange === "function") {
        this.callbacks.onChange(this.getState());
      }
    }

    getState() {
      return {
        snake: this.snake.map((part) => ({ ...part })),
        food: { ...this.food },
        score: this.score,
        status: this.status,
        difficultyKey: this.difficultyKey,
        difficulty: this.config.difficulty[this.difficultyKey],
        gridSize: this.config.gridSize,
        tickCount: this.tickCount
      };
    }
  }

  window.SnakeGame = SnakeGame;
})();
