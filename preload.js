class preload extends Phaser.Scene {
    constructor() {
      super("bootGame");
    }
    preload(){
      this.load.image("background", "assets/background.png");
      this.load.image("character_idle", "assets/character_idle.png");
      this.load.image("character_run0", "assets/character_run0.png");
      this.load.image("character_run1", "assets/character_run1.png");
      this.load.image("character_run2", "assets/character_run2.png");

      
    }
    create() {
      this.add.text(20, 20, "Loading game...");
      this.scene.start("playGame");
    }
  }