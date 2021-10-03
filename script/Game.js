'use strict';

ld49.states.Game = class extends State {
    constructor(level) {
        super();
        this.level = level;
        this.width = ld49.gameWidth;
        this.height = ld49.gameHeight;
        this.buffer = cq(ld49.screenWidth, ld49.screenHeight);
        this.entities = [];
        this.pressedKeys = {};
        this.tiles = [];
        this.won = false;
        this.gemsCollected = 0;
        this.ui = new ld49.util.UI([
            new ld49.util.ResetButton(4, 4, () => {
                this.app.setState(new ld49.states.Game(level));
            }),
        ]);
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                const border = x === 0 || y === 0 || x === this.width - 1 || y === this.height - 1;
                if (border) {
                    row.push(new ld49.tiles.SmoothWall(x, y));
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

    keypress(data) {}

    keyup(data) {}

    mousedown(data) {
        this.ui.click(data);
    }

    mousemove(data) {
        this.ui.mouseMove(data);
    }

    step(dt) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.tiles[y][x].update(this, dt);
            }
        }
        const applyInput = (key) => {
            for (const entity of this.entities) {
                entity.input(this, key);
            }
        };
        if (this.app.keyboard.keys['w'] || this.app.keyboard.keys['up']) {
            applyInput('up');
        }
        if (this.app.keyboard.keys['s'] || this.app.keyboard.keys['down']) {
            applyInput('down');
        }
        if (this.app.keyboard.keys['a'] || this.app.keyboard.keys['left']) {
            applyInput('left');
        }
        if (this.app.keyboard.keys['d'] || this.app.keyboard.keys['right']) {
            applyInput('right');
        }
        for (const entity of this.entities) {
            entity.update(this, dt);
        }
        for (let i = this.entities.length - 1; i >= 0; i--) {
            if (!this.entities[i].live) {
                this.entities.splice(i, 1);
            }
        }
        if (this.won) {
            ld49.util.finishedLevel(this.level, this.gemsCollected);
            if (this.level + 1 < ld49.app.data.levels.levels.length) {
                const nextLevel = new ld49.states.Game(this.level + 1);
                const transition = new ld49.states.TransitionBetween(this, nextLevel);
                this.app.setState(transition);
            } else {
                this.app.setState(new ld49.states.Menu());
            }
        }
    }

    getTile(x, y) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
            return new ld49.tiles.OutsideVoid(x, y);
        }
        return this.tiles[y][x];
    }

    draw(renderer) {
        for (let y = this.height - 1; y >= 0; y--) {
            for (let x = 0; x < this.width; x++) {
                this.tiles[y][x].draw(renderer);
            }
        }
        for (const entity of this.entities) {
            entity.draw(renderer);
        }
    }

    render() {
        this.buffer
            .fillStyle('#222')
            .fillRect(0, 0, ld49.screenWidth, ld49.screenHeight);
        const renderer = new ld49.util.Renderer(this.buffer, this.app.images.tiles);
        this.draw(renderer);
        renderer.finishDrawing();
        this.app.layer.drawImage(this.buffer.canvas, 0, 0, ld49.screenWidth, ld49.screenHeight);
        this.ui.draw(this.app);
    }
};
