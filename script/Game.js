'use strict';

class State {
    step(dt) {}
    mousedown(data) {}
    keydown(data) {}
    keyup(data) {}
    render() {}
}

ld39.states.Game = class extends State {
    constructor(level) {
        super();
        this.width = ld39.gameWidth;
        this.height = ld39.gameHeight;
        this.buffer = cq(240, 160);
        this.entities = [];
        this.pressedKeys = {};
        // ld39.loadLevel(this, level);
        this.tiles = [];
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                const border = x === 0 || y === 0 || x === this.width - 1 || y === this.height - 1;
                if (border) {
                    row.push(new ld39.tiles.Wall(x, y));
                } else {
                    row.push(new ld39.tiles.Floor(x, y));
                }
            }
            this.tiles.push(row);
        }
        this.entities.push(new ld39.entities.Player(4, 4));
    }

    keydown(data) {
        switch (data.key) {
            case 'w':
            case 'up':
                this.pressedKeys.up = true;
                break;
            case 's':
            case 'down':
                this.pressedKeys.down = true;
                break;
            case 'a':
            case 'left':
                this.pressedKeys.left = true;
                break;
            case 'd':
            case 'right':
                this.pressedKeys.right = true;
                break;
        }
    }

    keypress(data) {
        // console.log('key press');
    }

    keyup(data) {
        switch (data.key) {
            case 'w':
            case 'up':
                this.pressedKeys.up = false;
                break;
            case 's':
            case 'down':
                this.pressedKeys.down = false;
                break;
            case 'a':
            case 'left':
                this.pressedKeys.left = false;
                break;
            case 'd':
            case 'right':
                this.pressedKeys.right = false;
                break;
        }
    }

    mousedown(data) {
        // console.log('mouse down');
    }

    mouseup(data) {
        // console.log('mouse up');
    }

    mousemove(data) {
        // console.log('mouse move');
    }

    mouseout(data) {
        // console.log('mouse out');
    }

    step(dt) {
        for (const key in this.pressedKeys) {
            if (this.pressedKeys[key]) {
                for (const entity of this.entities) {
                    entity.input(this, key);
                }
            }
        }
        for (const entity of this.entities) {
            entity.update(this, dt);
        }
    }

    render() {
        this.buffer
            .fillStyle('#000')
            .fillRect(0, 0, ld39.screenWidth, ld39.screenHeight);
        const renderer = new ld39.util.Renderer(this.buffer, this.app.images.tiles);
        for (let y = this.height - 1; y >= 0; y--) {
            for (let x = 0; x < this.width; x++) {
                this.tiles[y][x].draw(renderer);
            }
        }
        for (const entity of this.entities) {
            entity.draw(renderer);
        }
        // for (let i = 0; i < this.entities.length; i++) {
        //     this.entities[i].draw(this.buffer, this);
        // }
        this.app.layer.drawImage(this.buffer.canvas, 0, 0, ld39.screenWidth, ld39.screenHeight);
    }
};
