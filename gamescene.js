class gamescene extends Phaser.Scene{
    constructor(){
      super("playGame");
    }
  
    create(){
      this.background = this.add.tileSprite(0, 0, gameConfig.width, gameConfig.height, "background");
      this.background.setOrigin(0, 0);
      this.character = this.add.sprite(50, 150, "character_idle");
      this.character.setScale(0.5);
      this.car = this.add.sprite(750, 185, "car");
      this.car.setScale(0.25);   
      this.add.text(20, 20, "Playing game", {font: "25px Arial", fill: "yellow"});
      this.backgroundMusic = this.sound.add('background_music', { loop: true });
      this.backgroundMusic.play();


      this.anims.create({
        key: "run",
        frames: [
            { key: "character_run0" },
            { key: "character_run1" },
            { key: "character_run2" }
        ],
        frameRate: 10, 
        repeat: -1   
    });

   
    this.character.play("run");
    }

    update() {
      // character movement
      this.character.x += 2;
      if (this.character.x > 800) {
          this.character.x = -50; 
      }

      // car movement
      this.car.x -= 2;
      if (this.car.x < -50) {
          this.car.x = 850; 
      }

      this.background.tilePositionX -= -3;

  }

    
  }