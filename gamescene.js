class gamescene extends Phaser.Scene {
  constructor() {
    super("playGame");
    this.score = 0;
    this.scoreMultiplier = 1;
  }

  create() {
    this.background = this.add.tileSprite(0, 0, gameConfig.width, gameConfig.height, "background");
    this.background.setOrigin(0, 0);
    this.character = this.add.sprite(50, 170, "character_idle");
    this.character.setScale(0.5);
    this.car = this.add.sprite(750, 185, "car");
    this.car.setScale(0.25);
    this.add.text(20, 20, "Playing game", { font: "25px Arial", fill: "yellow" });
    this.backgroundMusic = this.sound.add('background_music', { loop: true });
    this.backgroundMusic.play();
    this.powerUp = this.physics.add.sprite(50, 180, "power_up");
    this.powerUp.setScale(0.1);
    this.powerUp.body.allowGravity = false;
    this.powerUp.setActive(false);
    this.powerUp.setVisible(false);


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

    // Enable collilsion check for player and car
    this.physics.add.overlap(this.character, this.car, this.handleCollision, null, this);

    this.scoreText = this.add.text(20, 50, `Score: ${this.score}`, { font: "25px Arial", fill: "white" });

    this.coins = this.physics.add.group({
      key: 'coin',
      repeat: 3,
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
    // Overlap detection for power-up collection
    this.physics.add.overlap(this.character, this.powerUp, this.collectPowerUp, null, this);

    this.time.addEvent({
      delay: Phaser.Math.Between(10000, 15000), // Random delay between 10 to 15 seconds
      loop: true, // Repeat the event
      callback: () => {
        this.spawnPowerUp();
      },
      callbackScope: this,
    });
  }


  collectPowerUp(character, powerUp) {
    // Hide the power-up when collected
    powerUp.setActive(false);
    powerUp.setVisible(false);

    // Set score multiplier to 2 and schedule reset
    this.scoreMultiplier = 2;
    this.time.addEvent({
        delay: 5000, // Duration in milliseconds (5 seconds)
        callback: () => {
            this.scoreMultiplier = 1; // Reset to normal
        },
        callbackScope: this,
    });

    // Delay the next spawn of the power-up
    this.time.addEvent({
        delay: Phaser.Math.Between(10000, 15000), // Random delay between 10 to 15 seconds
        callback: () => {
            this.spawnPowerUp();
        },
        callbackScope: this,
    });
}


  randomizeCoinPosition(coin) {
    // Set coins to the right of the screen and randomize Y position
    coin.x = Phaser.Math.Between(650, 800); // Random X position to the right
    coin.y = Phaser.Math.Between(30, 180); // Random Y position
  }

  randomizePowerUpPosition() {
    // Randomize position for the power-up
    this.powerUp.x = Phaser.Math.Between(650, 800); // Random X position to the right
    this.powerUp.y = Phaser.Math.Between(30, 31); // Random Y position
  }

  collectCoin(character, coin) {
    // Hide coin when collected
    coin.setActive(false);
    coin.setVisible(false);

    // Randomize position and re-enable coin
    this.randomizeCoinPosition(coin);
    coin.setActive(true);
    coin.setVisible(true);

    this.score += (100 * this.scoreMultiplier);
  }

  handleCollision(character, car) {
    // Reset car position when collision occurs
    car.x = 850; // Reset car to the right side of the screen
    this.score = 0;   // Reset the score
    this.scoreText.setText(`Score: ${this.score}`); // Update score text
  }

  spawnPowerUp() {
    // Use randomizePowerUpPosition to randomize the position of the power-up
    this.randomizePowerUpPosition();
    this.powerUp.setActive(true);
    this.powerUp.setVisible(true);
  }
  


  update() {
    // character movement
    //this.character.x += 2;
    //if (this.character.x > 800) {
    //    this.character.x = -50; 
    //}

    // Increment the score every frame
    this.score += 1 * this.scoreMultiplier;
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

    if (this.powerUp.active) {
      this.powerUp.x -= 6;  // Move power-up to the left
      if (this.powerUp.x < -50) { // If power-up goes off-screen
        this.powerUp.setActive(false);  // Deactivate it
        this.powerUp.setVisible(false); // Hide it
      }
    }



    this.background.tilePositionX -= -5;

  }


}