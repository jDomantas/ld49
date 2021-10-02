'use strict';

class Entity {
    constructor() {}
    update(game, dt) {}
    input(game, key) {}
    draw(renderer) {}
}

ld39.entities.Player = class extends Entity {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.moveX = 0;
        this.moveY = 0;
        this.moveLeft = 0;
    }

    input(game, key) {
        if (this.moveLeft > 0) {
            return;
        }
        let dx = 0, dy = 0;
        if (key == 'w' || key == 'up') dy = 1;
        else if (key == 's' || key == 'down') dy = -1;
        else if (key == 'a' || key == 'left') dx = -1;
        else if (key == 'd' || key == 'right') dx = 1;
        let x = this.x + dx;
        let y = this.y + dy;
        if (x < 0 || y < 0 || x >= game.width || y >= game.height) {
            return;
        }
        let tile = game.tiles[y][x];
        if (tile.isSolid) {
            game.app.sound.play('shoot');
            return;
        }
        this.moveX = this.x - x;
        this.moveY = this.y - y;
        this.moveLeft = 1;
        this.x = x;
        this.y = y;
    }

    update(game, dt) {
        if (this.moveLeft > 0) {
            this.moveLeft -= dt * 4;
        }
        if (this.moveLeft < 0) {
            this.moveLeft = 0;
        }
    }

    draw(renderer) {
        renderer.draw(3, this.x + this.moveX * this.moveLeft, this.y + this.moveY * this.moveLeft);
    }
}
