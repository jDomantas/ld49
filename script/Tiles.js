'use strict';

class Tile {
    constructor(icon, x, y, isSolid) {
        this.icon = icon;
        this.x = x;
        this.y = y;
        this.isSolid = isSolid;
    }

    draw(renderer) {
        renderer.draw(this.icon, this.x, this.y, 0);
    }
}

ld39.tiles.Floor = class extends Tile {
    constructor(x, y) {
        super(0, x, y, false);
    }
};

ld39.tiles.Wall = class extends Tile {
    constructor(x, y) {
        super(1, x, y, true);
    }
};

ld39.tiles.Void = class extends Tile {
    constructor(x, y) {
        super(2, x, y, false);
    }
};
