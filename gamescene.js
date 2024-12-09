class gamescene extends Phaser.Scene{
    constructor(){
      super("playGame");
      this.score = 0;
    }
  
    create(){
      this.background = this.add.tileSprite(0, 0, gameConfig.width, gameConfig.height, "background");
      this.background.setOrigin(0, 0);
      this.character = this.add.sprite(50, 170, "character_idle");
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


      this.background.tilePositionX -= -5; 
    }  

  
  }