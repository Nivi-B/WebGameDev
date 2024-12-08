class gamescene extends Phaser.Scene{
    constructor(){
      super("playGame");
    }
  
    create(){
      this.add.image(400, 300, "background");
      this.character = this.add.sprite(50, 285, "character_idle");
      this.add.text(20, 20, "Playing game", {font: "25px Arial", fill: "yellow"});
    }
  }