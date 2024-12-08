class gamescene extends Phaser.Scene{
    constructor(){
      super("playGame");
    }
  
    create(){
      this.add.image(400, 300, "background");
      this.character = this.add.sprite(50, 285, "character_idle");
      this.car = this.add.sprite(750, 320, "car");
      this.car.setScale(0.5);
      this.add.text(20, 20, "Playing game", {font: "25px Arial", fill: "yellow"});


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

  }

    
  }