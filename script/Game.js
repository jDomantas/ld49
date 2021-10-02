'use strict';

class State {
    step(dt) {}
    mousedown(data) {}
    keydown(data) {}
    keyup(data) {}
    render() {}
}

ld39.states2.Game = class extends State {
    constructor(level) {
        super();
        this.width = ld39.gameWidth;
        this.height = ld39.gameHeight;
        this.buffer = cq(this.width * 8, this.height * 8);
        this.entities = [];
        ld39.loadLevel(this, level);
    }

    keydown(data) {
        console.log('key down: ' + JSON.stringify(data));
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].input(this, data.key);
        }
    }

    keypress(data) {
        console.log('key press');
    }

    keyup(data) {
        console.log('key up');
    }

    mousedown(data) {
        console.log('mouse down');
    }

    mouseup(data) {
        console.log('mouse up');
    }

    mousemove(data) {
        console.log('mouse move');
    }

    mouseout(data) {
        console.log('mouse out');
    }

    render() {
        this.buffer
            .fillStyle('#000')
            .fillRect(0, 0, this.width * 8, this.height * 8);
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.tiles[y][x].draw(this.buffer, this, x, y);
            }
        }
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].draw(this.buffer, this);
        }
        this.app.layer.drawImage(this.buffer.canvas, 0, 0, this.width * 8, this.height * 8);
    }
};
