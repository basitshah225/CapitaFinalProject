class Laser {
    constructor(x) {
        this.x = x;
        this.y = 800;
        this.speed = 45;
    }

    move() {
        this.y = this.y - this.speed;
    }

    show() {
        strokeWeight(5);
        stroke(0,0,255);
        line(this.x, this.y, this.x, this.y - 30);
    }

    render() {
        this.show();
        this.move();
    }
}