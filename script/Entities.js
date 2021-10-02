'use strict';

class Entity {
    constructor() {}
    update(game, dt) {}
    input(game, key) {}
    draw(renderer) {}
}

ld49.entities.Player = class extends Entity {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.moveX = 0;
        this.moveY = 0;
        this.moveLeft = 0;
        this.frame = 0;
        this.dir = 0;
    }

    input(game, key) {
        if (this.moveLeft > 0) {
            return;
        }
        let dx = 0, dy = 0, dir = 0;
        if (key == 'w' || key == 'up') { dy = 1; dir = 2; }
        else if (key == 's' || key == 'down') { dy = -1; dir = 0; }
        else if (key == 'a' || key == 'left') { dx = -1; dir = 1; }
        else if (key == 'd' || key == 'right') { dx = 1; dir = 3; }
        else { return; }
        let x = this.x + dx;
        let y = this.y + dy;
        if (x < 0 || y < 0 || x >= game.width || y >= game.height) {
            return;
        }
        let tile = game.tiles[y][x];
        this.dir = dir;
        if (!tile.canWalk) {
            // game.app.sound.play('shoot');
            return;
        }
        game.tiles[this.y][this.x].walked(game);
        this.moveX = this.x - x;
        this.moveY = this.y - y;
        this.moveLeft = 1;
        this.x = x;
        this.y = y;
    }

    update(game, dt) {
        if (this.moveLeft > 0) {
            this.moveLeft -= dt * 4;
            this.frame += dt * 8;
        }
        if (this.moveLeft < 0) {
            this.moveLeft = 0;
            this.frame = Math.round(this.frame / 2) * 2;
        }
    }

    draw(renderer) {
        const frame = Math.round(this.frame) % 4;
        renderer.draw(16 + + this.dir * 4 + frame, this.x + this.moveX * this.moveLeft, this.y + this.moveY * this.moveLeft);
    }
}
