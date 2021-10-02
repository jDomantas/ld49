'use strict';

class Tile {
    constructor(icon, x, y, isSolid) {
        this.icon = icon;
        this.x = x;
        this.y = y;
        this.isSolid = isSolid;
    }

    draw(layer, game) {
        layer.drawImage(
            ld39.app.images.tiles,
            this.icon % 16 * 8, Math.floor(this.icon / 16) * 8, 8, 8,
            this.x * 8, this.y * 8, 8, 8
        );
    }
}

ld39.tiles.Floor = class extends Tile {
    constructor(x, y) {
        super(0, x, y, false);
    }
};

ld39.tiles.Void = class extends Tile {
    constructor(x, y) {
        super(4, x, y, false);
    }
};

ld39.tiles.Wall = class extends Tile {
    constructor(x, y) {
        super(2, x, y, true);
    }
};

ld39.tiles.Digit = class extends Tile {
    constructor(x, y, digit) {
        let index = "0123456789".indexOf(digit);
        super(16 + index, x, y, true);
    }
}
