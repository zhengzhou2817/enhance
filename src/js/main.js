(function () {
  "use strict";

  const config = window.SnakeConfig;
  const ui = new window.SnakeUI(config);
  const game = new window.SnakeGame(config, {
    onChange: (state) => ui.render(state)
  });

  const startButton = document.getElementById("start-button");
  const restartButton = document.getElementById("restart-button");
  const difficultySelect = document.getElementById("difficulty");

  const keyMap = {
    ArrowUp: "up",
    KeyW: "up",
    ArrowDown: "down",
    KeyS: "down",
    ArrowLeft: "left",
    KeyA: "left",
    ArrowRight: "right",
    KeyD: "right"
  };

  startButton.addEventListener("click", () => {
    game.toggle();
  });

  restartButton.addEventListener("click", () => {
    game.reset();
    game.start();
  });

  difficultySelect.addEventListener("change", (event) => {
    game.setDifficulty(event.target.value);
  });

  document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      event.preventDefault();
      game.toggle();
      return;
    }

    const direction = keyMap[event.code];

    if (direction) {
      event.preventDefault();
      game.changeDirection(direction);
    }
  });

  document.querySelectorAll("[data-direction]").forEach((button) => {
    button.addEventListener("click", () => {
      game.changeDirection(button.dataset.direction);

      const state = game.getState();
      if (state.status === "idle" || state.status === "gameover") {
        game.start();
      }
    });
  });

  ui.render(game.getState());
})();
