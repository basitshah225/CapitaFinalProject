class Word {
    //creates Word Object with random X position
    constructor(word, startY) {
      this.x = random(100, 700);
      this.y = startY;
      this.word = word;
      this.ca = Array.from(word);
      this.wordColour = color(0, 255, 0);
      this.speed = 0.4;
    }
    
    move() {
      this.y = this.y + this.speed;
    }
    
    show() {
      fill(this.wordColour);
      textAlign(CENTER, TOP);
      textSize(32);
      text(this.word, this.x, this.y);
      noFill();
    }
    
    render() {
      this.move();
      this.show();
    }
}