var gameConfig = {
  width: 600,
  height: 300,
  backgroundColor: 0x000000,
  scene: [preload, gamescene],
  physics: {
      default: 'arcade', // Enable Arcade Physics
      arcade: {
          debug: false, // Set to true for debugging physics bodies
      }
  }
};

var game = new Phaser.Game(gameConfig);