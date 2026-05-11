(function () {
  "use strict";

  window.SnakeConfig = {
    gridSize: 24,
    initialSnake: [
      { x: 7, y: 12 },
      { x: 6, y: 12 },
      { x: 5, y: 12 }
    ],
    initialDirection: { x: 1, y: 0 },
    difficulty: {
      easy: { label: "轻松", interval: 150, score: 8 },
      normal: { label: "标准", interval: 105, score: 12 },
      hard: { label: "极速", interval: 72, score: 18 }
    },
    storageKey: "enhance-snake-best-score"
  };
})();
