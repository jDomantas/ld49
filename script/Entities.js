'use strict';

class Entity {
    constructor() {}
    update(game, dt) {}
    input(game, key) {}
    draw(layer, game) {}
}

ld39.entities.Player = class extends Entity {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }

    input(game, key) {
        let dx = 0, dy = 0;
        if (key == 'w' || key == 'up') dy = -1;
        else if (key == 's' || key == 'down') dy = 1;
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
        this.x = x;
        this.y = y;
    }

    draw(layer, game) {
        layer.drawImage(game.app.images.tiles, 32, 0, 8, 8, this.x * 8, this.y * 8, 8, 8);
        layer.drawImage(game.app.images.tiles, 8, 0, 8, 8, this.x * 8, this.y * 8, 8, 8);
    }
}
