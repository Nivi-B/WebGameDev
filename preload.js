class preload extends Phaser.Scene {
    constructor() {
      super("bootGame");
    }
    preload(){
      this.load.image("background", "assets/background.png");
      this.load.image("gloomy_background", "assets/gloomy_background.png");

      this.load.image("character_idle", "assets/character_idle.png");
      this.load.image("character_run0", "assets/character_run0.png");
      this.load.image("character_run1", "assets/character_run1.png");
      this.load.image("character_run2", "assets/character_run2.png");
      this.load.image("character_jump", "assets/character_jump.png");

      this.load.image("car", "assets/car.png");
      this.load.image("police_car", "assets/police_car.png");
      this.load.image("ambulance", "assets/ambulance.png");

      this.load.image("snowflake", "assets/snowflake.png");
      this.load.image("power_up", "assets/power_up.png");
      this.load.image("coin", "assets/coin.png");


      this.load.audio('background_music', 'assets/audio/background_music.mp3');
      this.load.audio('coin_sound', 'assets/audio/coin_sound.wav');
 
    }
    create() {
      this.add.text(20, 20, "Loading game...");
      this.scene.start("playGame");
    }
  }