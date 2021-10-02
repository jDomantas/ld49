'use strict';

class State {
    step(dt) {}
    mousedown(data) {}
    keydown(data) {}
    keyup(data) {}
    render() {}
}

ld49.states.Game = class extends State {
    constructor(level) {
        super();
        this.level = level;
        this.width = ld49.gameWidth;
        this.height = ld49.gameHeight;
        this.buffer = cq(240, 160);
        this.entities = [];
        this.pressedKeys = {};
        this.tiles = [];
        this.won = false;
        this.gemsCollected = 0;
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                const border = x === 0 || y === 0 || x === this.width - 1 || y === this.height - 1;
                if (border) {
                    row.push(new ld49.tiles.Wall(x, y));
                } else {
                    row.push(new ld49.tiles.crackedFloors[0](x, y));
                }
            }
            this.tiles.push(row);
        }
        this.entities.push(new ld49.entities.Player(4, 4));
        ld49.loadLevel(this, level);
    }

    keydown(data) {
        if (data.key === 'r') {
            this.app.setState(new ld49.states.Game(this.level));
            return;
        }
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
        if (data.key === 'space') {
            for (const entity of this.entities) {
                entity.input(this, 'space');
            }
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
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.tiles[y][x].update(this, dt);
            }
        }
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
        for (let i = this.entities.length - 1; i >= 0; i--) {
            if (!this.entities[i].live) {
                this.entities.splice(i, 1);
            }
        }
        if (this.won && this.level < 1) {
            this.app.setState(new ld49.states.Game(this.level + 1));
        }
    }

    getTile(x, y) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
            return new ld49.tiles.OutsideVoid(x, y);
        }
        return this.tiles[y][x];
    }

    render() {
        this.buffer
            .fillStyle('#000')
            .fillRect(0, 0, ld49.screenWidth, ld49.screenHeight);
        const renderer = new ld49.util.Renderer(this.buffer, this.app.images.tiles);
        for (let y = this.height - 1; y >= 0; y--) {
            for (let x = 0; x < this.width; x++) {
                this.tiles[y][x].draw(renderer);
            }
        }
        for (const entity of this.entities) {
            entity.draw(renderer);
        }
        renderer.finishDrawing();
        this.app.layer.drawImage(this.buffer.canvas, 0, 0, ld49.screenWidth, ld49.screenHeight);
    }
};
