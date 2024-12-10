class gamescene extends Phaser.Scene{
    constructor(){
      super("playGame");
      this.score = 0;
    }
  
    create(){
      this.background = this.add.tileSprite(0, 0, gameConfig.width, gameConfig.height, "background");
      this.background.setOrigin(0, 0);
      this.gloomyBackground = this.add.tileSprite(0, 0, gameConfig.width, gameConfig.height, "gloomy_background");  //added gloomy background
      this.gloomyBackground.setOrigin(0, 0);
      this.gloomyBackground.setAlpha(0); // Initially invisible,
      this.character = this.add.sprite(50, 170, "character_idle");
      this.character.setScale(0.5);
      this.car = this.add.sprite(750, 185, "car");
      this.car.setScale(0.25);   
      this.add.text(20, 20, "Playing game", {font: "25px Arial", fill: "yellow"});
      this.backgroundMusic = this.sound.add('background_music', { loop: true });
      this.backgroundMusic.play();

      // Snowflake particles
      const particles = this.add.particles('snowflake');
      this.snowEmitter = particles.createEmitter({
        x: { min: 0, max: gameConfig.width },
        y: 0,
        lifespan: 4000,
        speedY: { min: 50, max: 100 },
        scale: { start: 0.1, end: 0.5 },
        quantity: 5,
        blendMode: 'ADD',
        active: false, // Initially inactive
      });
    
      // Timer to toggle backgrounds and snowflakes every 25 seconds
      this.time.addEvent({
        delay: 25000, // 25 seconds
        callback: this.toggleBackground,
        callbackScope: this,
        loop: true, // Repeat infinitely
      });


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
      this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


      this.anims.create({
        key: 'jump',
        frames: [{ key: 'character_jump' }],  
        frameRate: 10,
        repeat: 0  
      });

      this.isJumping = false;
      this.jumpSpeed = -10; 
      this.gravity = 0.5;  
      this.velocityY = 0;

      // Add physics to character and car
      this.physics.add.existing(this.character);
      this.physics.add.existing(this.car);
      
      // Adjust hitbox size and position to match visual
      this.character.body.setSize(30, 50); 
      this.character.body.setOffset(10, 10);
      this.car.body.setSize(80, 30); 
      this.car.body.setOffset(5, 10); 

      // Enable collilsion check
      this.physics.add.overlap(this.character, this.car, this.handleCollision, null, this);

      this.scoreText = this.add.text(20, 50, `Score: ${this.score}`, { font: "25px Arial", fill: "white" });

      this.coins = this.physics.add.group({
        key: 'coin',
        repeat: 3, // Create 4 coins in total
        setXY: { x: 700, y: 150, stepX: 150 }
      });
  
      // Randomize initial coin positions
      this.coins.children.iterate((coin) => {
        coin.setScale(0.2);
        coin.body.allowGravity = false;
        this.randomizeCoinPosition(coin);
      });
  
      // Overlap detection for coin collection
      this.physics.add.overlap(this.character, this.coins, this.collectCoin, null, this);
    }

    // Toggle between backgrounds and snowflakes
    toggleBackground() {
      if (this.gloomyBackground.alpha === 0) {
        // Transition to gloomy background with snowflakes
        this.tweens.add({
          targets: this.gloomyBackground,
          alpha: 1, // Fade in gloomy background
          duration: 5000, // 5 seconds
          onUpdate: () => {
            this.background.setAlpha(1 - this.gloomyBackground.alpha); // Fade out original background
          },
        });
        this.snowEmitter.start(); // Start snowflakes
      } else {
        // Transition back to the original background
        this.tweens.add({
          targets: this.gloomyBackground,
          alpha: 0, // Fade out gloomy background
          duration: 5000, // 5 seconds
          onUpdate: () => {
            this.background.setAlpha(1 - this.gloomyBackground.alpha); // Fade in original background
          },
        });
        this.snowEmitter.stop(); // Stop snowflakes
      }
    }

    randomizeCoinPosition(coin) {
      // Set coins to the right of the screen and randomize Y position
      coin.x = Phaser.Math.Between(650, 800); // Random X position to the right
      coin.y = Phaser.Math.Between(30, 180); // Random Y position
    }
  
    collectCoin(character, coin) {
      // Hide coin when collected
      coin.setActive(false);
      coin.setVisible(false);
  
      // Randomize position and re-enable coin
      this.randomizeCoinPosition(coin);
      coin.setActive(true);
      coin.setVisible(true);

      this.score += 100;
    }

    handleCollision(character, car) {
      // Reset car position when collision occurs
      car.x = 850; // Reset car to the right side of the screen
      this.score = 0;   // Reset the score
      this.scoreText.setText(`Score: ${this.score}`); // Update score text
    }

    update() {
      // character movement
      //this.character.x += 2;
      //if (this.character.x > 800) {
      //    this.character.x = -50; 
      //}

      // Increment the score every frame
      this.score++;
      this.scoreText.setText(`Score: ${this.score}`); // Update score text

      if (this.spacebar.isDown && !this.isJumping) {
        this.isJumping = true;  
        this.velocityY = this.jumpSpeed; 
        this.character.play('jump'); 
      }

      if (this.isJumping) {
        this.character.y += this.velocityY;
        this.velocityY += this.gravity;
        if (this.character.y >= 170) {
          this.character.y = 170;
          this.isJumping = false;
          this.character.play('run');
        }
      }
  
      // car movement
      this.car.x -= 6;
      if (this.car.x < -50) {
        this.car.x = 850;
      }
  
      this.coins.children.iterate((coin) => {
        coin.x -= 6; // Move each coin by 6 units per frame
        if (coin.x < -50) { // Reset coin to the right side when it goes off-screen
          this.randomizeCoinPosition(coin);
        }
      });


    this.background.tilePositionX -= -5;

  }


}