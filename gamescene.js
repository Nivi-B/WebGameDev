class gamescene extends Phaser.Scene{
    constructor(){
      super("playGame");
      this.score = 0;
      this.scoreMultiplier = 1;
      this.isReady = false;
    }
  
    async create() {
      try {
        // Fetch the weather and set the background
        const weatherCondition = await this.getWeather();
        const bgKey = weatherCondition === "clear" ? "background" : "gloomy_background";
        this.background = this.add.tileSprite(0, 0, gameConfig.width, gameConfig.height, bgKey);
        this.background.setOrigin(0, 0);
  
        // Initialize game elements
        this.character = this.add.sprite(50, 170, "character_idle");
        this.character.setScale(0.5);
        this.car = this.add.sprite(750, 185, "car");
        this.car.setScale(0.25);
        this.add.text(20, 20, "Playing game", { font: "25px Arial", fill: "yellow" });
  
        // Background music
        this.backgroundMusic = this.sound.add("background_music", { loop: true });
        this.backgroundMusic.play({ volume: 0.2 });
        this.coinSound = this.sound.add('coin_sound');

      this.coins = this.physics.add.group({
        key: 'coin',
        repeat: 3, // Create 4 coins in total
        setXY: { x: 700, y: 150, stepX: 150 }
      });

      this.powerUp = this.physics.add.sprite(700, 150, 'power_up');
      this.powerUp.setScale(0.1);
      this.powerUp.body.allowGravity = false;
      this.randomizePowerUpPosition(this.powerUp);
        // Animations
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

      // Randomize initial coin positions
      this.coins.children.iterate((coin) => {
        coin.setScale(0.2);
        coin.body.allowGravity = false;
        this.randomizeCoinPosition(coin);
      });
  
        this.physics.add.overlap(this.character, this.coins, this.collectCoin, null, this);

      this.physics.add.overlap(this.character, this.powerUp, this.collectPowerUp, null, this);
      } catch (error) {
        console.error("Error initializing game:", error);
      }
      this.isReady = true;
    }

    async getWeather() {
      try {
        const apiKey = "08a83eb57c04f1d6ddc19f289ffb5a7d"; 
        const lat = 39.1031; // Cincinnati, OH
        const lon = 84.5120; // Cincinnati, OH
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  
        const response = await fetch(url);
        const data = await response.json();
  
        // Parse the weather condition
        const weatherCondition = data.weather[0].main.toLowerCase();
        console.log(`Weather Condition: ${weatherCondition}`);
  
        // Return "clear" or "gloomy" based on the weather
        if (["clear", "sunny"].includes(weatherCondition)) {
          return "clear";
        } else {
          return "gloomy";
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
        return "clear"; // Default to clear if API call fails
      }
    }

    randomizeCoinPosition(coin) {
      // Set coins to the right of the screen and randomize Y position
      coin.x = Phaser.Math.Between(650, 800); // Random X position to the right
      coin.y = Phaser.Math.Between(30, 180); // Random Y position
    }

    randomizePowerUpPosition(powerUp) {
      // Randomize position for the power-up
      powerUp.x = Phaser.Math.Between(4000, 5000); 
      powerUp.y = Phaser.Math.Between(40, 180); 
    }
  
    collectCoin(character, coin) {
      this.coinSound.play({ volume: 2.0 });
      // Hide coin when collected
      coin.setActive(false);
      coin.setVisible(false);
  
      // Randomize position and re-enable coin
      this.randomizeCoinPosition(coin);
      coin.setActive(true);
      coin.setVisible(true);

      this.score += (100 * this.scoreMultiplier);
    }

    collectPowerUp(character, powerUp) {
  
      // Hide power-up when collected
      powerUp.setActive(false);
      powerUp.setVisible(false);
  
      // Randomize position and re-enable power-up
      this.randomizePowerUpPosition(powerUp);
      powerUp.setActive(true);
      powerUp.setVisible(true);
  
      // Double the score multiplier
      this.scoreMultiplier = 10;
  
      // Reset multiplier after 5 seconds
      this.time.addEvent({
        delay: 5000,  // Duration in milliseconds (5 seconds)
        callback: () => {
          this.scoreMultiplier = 1;  // Reset to normal multiplier
        },
        callbackScope: this
      });
    }

    handleCollision(character, car) {
      // Reset car position when collision occurs
      car.x = 850; // Reset car to the right side of the screen
      this.score = 0;   // Reset the score
      this.scoreText.setText(`Score: ${this.score}`); // Update score text
    }

    update() {
      if (!this.isReady) return;
      // character movement
      //this.character.x += 2;
      //if (this.character.x > 800) {
      //    this.character.x = -50; 
      //}

      // Increment the score every frame
      this.score += (1 * this.scoreMultiplier);
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

      this.powerUp.x -= 6;
      if (this.powerUp.x < -50) {
        this.randomizePowerUpPosition(this.powerUp);
      }

    this.background.tilePositionX -= -5;

  }


}