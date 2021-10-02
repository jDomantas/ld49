'use strict';

class Tile {
    constructor(icon, x, y, canWalk) {
        this.icon = icon;
        this.x = x;
        this.y = y;
        this.canWalk = canWalk;
    }

    draw(renderer) {
        renderer.draw(this.icon, this.x, this.y, 0);
    }

    update(game, dt) {}

    walked(game) {}
}

ld49.tiles.StableFloor = class extends Tile {
    constructor(x, y) {
        super(1, x, y, true);
    }
};

ld49.tiles.UnstableFloor = class extends Tile {
    constructor(icon, x, y, next) {
        super(icon, x, y, true);
        this.next = next;
        this.bump = 0;
    }

    update(game, dt) {
        this.bump -= dt * 4;
        if (this.bump < 0) {
            this.bump = 0;
        }
    }

    draw(renderer) {
        const progress = this.bump * Math.PI;
        const sink = Math.sin(progress) * 0.2;
        renderer.draw(this.icon, this.x, this.y, -sink);
    }

    walked(game) {
        const replacement = new this.next(this.x, this.y);
        game.tiles[this.y][this.x] = replacement;
        replacement.animate();
    }

    animate() {
        this.bump = 1;
    }
};

ld49.tiles.FallingFloor = class extends Tile {
    constructor(x, y) {
        super(4, x, y, false);
        this.fall = 0;
    }

    update(game, dt) {
        this.fall -= dt * 4;
        if (this.fall < 0) {
            this.fall = 0;
        }
    }

    draw(renderer) {
        if (this.fall > 0) {
            renderer.draw(this.icon, this.x, this.y, 3 * (this.fall - 1));
        }
    }

    animate() {
        this.fall = 1;
    }
};

ld49.tiles.crackedFloors = [
    class extends ld49.tiles.UnstableFloor {
        constructor(x, y) {
            super(3, x, y, ld49.tiles.crackedFloors[1]);
        }
    },
    class extends ld49.tiles.UnstableFloor {
        constructor(x, y) {
            super(4, x, y, ld49.tiles.FallingFloor);
        }
    },
];

ld49.tiles.Wall = class extends Tile {
    constructor(x, y) {
        super(2, x, y, false);
    }
};

ld49.tiles.Void = class extends Tile {
    constructor(x, y) {
        super(0, x, y, false);
    }
};
