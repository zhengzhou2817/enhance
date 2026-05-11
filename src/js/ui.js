(function () {
  "use strict";

  class SnakeUI {
    constructor(config) {
      this.config = config;
      this.canvas = document.getElementById("game-board");
      this.ctx = this.canvas.getContext("2d");
      this.scoreEl = document.getElementById("score");
      this.bestScoreEl = document.getElementById("best-score");
      this.speedLabelEl = document.getElementById("speed-label");
      this.overlay = document.getElementById("overlay");
      this.overlayTitle = document.getElementById("overlay-title");
      this.overlayText = document.getElementById("overlay-text");
      this.startButton = document.getElementById("start-button");

      this.bestScore = Number(localStorage.getItem(config.storageKey) || 0);
      this.bestScoreEl.textContent = String(this.bestScore);
    }

    render(state) {
      this.updateStats(state);
      this.drawBoard(state);
      this.updateOverlay(state);
    }

    updateStats(state) {
      if (state.score > this.bestScore) {
        this.bestScore = state.score;
        localStorage.setItem(this.config.storageKey, String(this.bestScore));
      }

      this.scoreEl.textContent = String(state.score);
      this.bestScoreEl.textContent = String(this.bestScore);
      this.speedLabelEl.textContent = state.difficulty.label;
    }

    updateOverlay(state) {
      const overlayMap = {
        idle: ["准备开始", "点击开始游戏或按空格键"],
        paused: ["已暂停", "按空格键继续"],
        gameover: ["游戏结束", "点击重新开始再挑战一次"]
      };

      if (state.status === "running") {
        this.overlay.classList.add("hidden");
        this.startButton.textContent = "暂停";
        return;
      }

      this.overlay.classList.remove("hidden");

      const [title, text] = overlayMap[state.status] || overlayMap.idle;
      this.overlayTitle.textContent = title;
      this.overlayText.textContent = text;
      this.startButton.textContent = state.status === "paused" ? "继续" : "开始游戏";
    }

    drawBoard(state) {
      const { ctx, canvas } = this;
      const cell = canvas.width / state.gridSize;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.drawGrid(ctx, canvas, cell, state.gridSize);
      this.drawFood(ctx, state.food, cell);
      this.drawSnake(ctx, state.snake, cell);
    }

    drawGrid(ctx, canvas, cell, gridSize) {
      ctx.save();
      ctx.strokeStyle = "rgba(148, 163, 184, 0.08)";
      ctx.lineWidth = 1;

      for (let i = 0; i <= gridSize; i += 1) {
        const pos = i * cell;

        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, pos);
        ctx.lineTo(canvas.width, pos);
        ctx.stroke();
      }

      ctx.restore();
    }

    drawFood(ctx, food, cell) {
      const centerX = food.x * cell + cell / 2;
      const centerY = food.y * cell + cell / 2;
      const radius = cell * 0.32;

      ctx.save();

      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.1,
        centerX,
        centerY,
        radius * 1.4
      );

      gradient.addColorStop(0, "#fff7ad");
      gradient.addColorStop(0.45, "#facc15");
      gradient.addColorStop(1, "rgba(250, 204, 21, 0.1)");

      ctx.fillStyle = gradient;
      ctx.shadowColor = "rgba(250, 204, 21, 0.85)";
      ctx.shadowBlur = 22;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    drawSnake(ctx, snake, cell) {
      snake.forEach((part, index) => {
        const padding = Math.max(3, cell * 0.12);
        const x = part.x * cell + padding;
        const y = part.y * cell + padding;
        const size = cell - padding * 2;

        ctx.save();

        const gradient = ctx.createLinearGradient(x, y, x + size, y + size);
        gradient.addColorStop(0, index === 0 ? "#67e8f9" : "#22d3ee");
        gradient.addColorStop(1, index === 0 ? "#c4b5fd" : "#0ea5e9");

        ctx.fillStyle = gradient;
        ctx.shadowColor = "rgba(34, 211, 238, 0.45)";
        ctx.shadowBlur = index === 0 ? 18 : 10;

        this.roundRect(ctx, x, y, size, size, Math.max(6, cell * 0.22));
        ctx.fill();

        if (index === 0) {
          ctx.fillStyle = "rgba(2, 6, 23, 0.9)";
          ctx.beginPath();
          ctx.arc(x + size * 0.36, y + size * 0.38, size * 0.08, 0, Math.PI * 2);
          ctx.arc(x + size * 0.64, y + size * 0.38, size * 0.08, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });
    }

    roundRect(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + width, y, x + width, y + height, radius);
      ctx.arcTo(x + width, y + height, x, y + height, radius);
      ctx.arcTo(x, y + height, x, y, radius);
      ctx.arcTo(x, y, x + width, y, radius);
      ctx.closePath();
    }
  }

  window.SnakeUI = SnakeUI;
})();
