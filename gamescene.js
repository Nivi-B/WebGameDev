class gamescene extends Phaser.Scene{
    constructor(){
      super("playGame");
    }
  
    create(){
      this.score = 0;

      this.add.image(400, 300, "background");
      this.character = this.add.sprite(50, 285, "character_idle");
      this.car = this.add.sprite(750, 320, "car");
      this.car.setScale(0.5);
      this.add.text(20, 20, "Playing game", {font: "25px Arial", fill: "yellow"});
      this.backgroundMusic = this.sound.add('background_music', { loop: true });
      this.backgroundMusic.play();

      this.scoreText = this.add.bitmapText(this.cameras.main.width - 20, 20, 'customFont', 'Score: 0', 32);
      this.scoreText.setOrigin(1, 0);


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

    //this.coin = this.add.sprite(Phaser.Math.Between(100, 700), Phaser.Math.Between(100, 400), 'coin');
    //this.coin.setScale(0.5);

    }

    update(time, delta) {
      if (!this.lastScoreUpdate) {
        this.lastScoreUpdate = 0; // Initialize the timer
    }

      if (time - this.lastScoreUpdate > 100) { // 500ms = 0.5 seconds
        this.score += 1; // Increment score by 1
        this.updateScoreText();
        this.lastScoreUpdate = time; // Update the timer
    }

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

      //if (Phaser.Geom.Intersects.RectangleToRectangle(this.character.getBounds(), this.coin.getBounds())) {
        //this.score += 50;
  
        // Respawn the coin at a random position
        //this.coin.setPosition(Phaser.Math.Between(100, 700), Phaser.Math.Between(100, 400));
        //this.updateScoreText();
      //}

  }

    updateScoreText() {
      // Update the score text
      this.scoreText.setText('Score: ' + this.score);
    }

    
  }