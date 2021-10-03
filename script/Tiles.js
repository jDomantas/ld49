'use strict';

class Tile {
    constructor(icon, x, y, canWalk, canFly, canGrapple) {
        this.icon = icon;
        this.x = x;
        this.y = y;
        this.canWalk = canWalk;
        this.canFly = canFly;
        this.canGrapple = canGrapple;
    }

    draw(renderer) {
        renderer.draw(this.icon, this.x, this.y, 0);
    }

    update(game, dt) {}

    leaveTrigger(game) {}

    pullTrigger(game) {}
}

ld49.tiles.StableFloor = class extends Tile {
    constructor(x, y) {
        super(1, x, y, true, true, false);
    }

    draw(renderer) {
        renderer.draw(this.icon, this.x, this.y, -1);
    }
};

ld49.tiles.UnstableFloor = class extends Tile {
    constructor(icon, x, y, breakSound, next) {
        super(icon, x, y, true, true, false);
        this.next = next;
        this.bump = 0;
        this.breakSound = breakSound;
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
        renderer.draw(this.icon, this.x, this.y, -sink - 1);
    }

    leaveTrigger(game) {
        game.app.sound.play(this.breakSound);
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
        super(4, x, y, false, true, false);
        this.fall = 0;
    }

    update(game, dt) {
        this.fall -= dt * 2;
        if (this.fall < 0) {
            this.fall = 0;
        }
    }

    draw(renderer) {
        if (this.fall > 0) {
            const [dx1, dy1] = debrisOffset(2, -4);
            const [dx2, dy2] = debrisOffset(-4, 0);
            const [dx3, dy3] = debrisOffset(4, 0);
            const [dx4, dy4] = debrisOffset(1, 5);
            const p1 = Math.max(0, (1 - this.fall) * 8);
            const p2 = Math.max(0, (1 - this.fall) * 7 - 4);
            const p3 = Math.max(0, (1 - this.fall) * 8 - 2.5);
            const p4 = Math.max(0, (1 - this.fall) * 6 - 1.3);
            if (p1 < 3) renderer.draw(44, this.x + dx1, this.y + dy1, -1 - p1);
            if (p2 < 3) renderer.draw(45, this.x + dx2, this.y + dy2, -1 - p2);
            if (p3 < 3) renderer.draw(46, this.x + dx3, this.y + dy3, -1 - p3);
            if (p4 < 3) renderer.draw(47, this.x + dx4, this.y + dy4, -1 - p4);
        }
    }

    animate() {
        this.fall = 1;
    }
};

ld49.tiles.crackedFloors = [
    class extends ld49.tiles.UnstableFloor {
        constructor(x, y) {
            super(3, x, y, 'floor_break', ld49.tiles.crackedFloors[1]);
        }
    },
    class extends ld49.tiles.UnstableFloor {
        constructor(x, y) {
            super(4, x, y, 'floor_fall', ld49.tiles.FallingFloor);
        }
    },
];

ld49.tiles.SmoothWall = class extends Tile {
    constructor(x, y) {
        super(2, x, y, false, false, false);
    }

    draw(renderer) {
        renderer.draw(this.icon, this.x, this.y, 0);
    }
};

ld49.tiles.CobbleWall = class extends Tile {
    constructor(x, y) {
        super(5, x, y, false, false, true);
    }

    draw(renderer) {
        renderer.draw(this.icon, this.x, this.y, 0);
    }
};

ld49.tiles.FragileWall = class extends Tile {
    constructor(x, y) {
        super(6, x, y, false, false, true);
    }

    draw(renderer) {
        renderer.draw(this.icon, this.x, this.y, 0);
    }

    pullTrigger(game) {
        game.app.sound.play('wall_fall');
        const tile = new ld49.tiles.FallingWall(this.x, this.y);
        game.tiles[this.y][this.x] = tile;
        tile.animate();
    }
};

ld49.tiles.FallingWall = class extends Tile {
    constructor(x, y) {
        super(6, x, y, false, true, false);
        this.fall = 0;
    }

    update(game, dt) {
        this.fall -= dt * 1.5;
        if (this.fall < 0) {
            this.fall = 0;
        }
    }

    draw(renderer) {
        if (this.fall > 0) {
            const progress = 1 - this.fall;
            const z = (progress - 0.2) * (progress - 0.2) * -4.5 + 0.18;
            renderer.draw(this.icon, this.x, this.y, z);
        }
    }

    animate() {
        this.fall = 1;
    }
};

ld49.tiles.Void = class extends Tile {
    constructor(x, y) {
        super(0, x, y, false, true, false);
    }

    draw(renderer) {}
};

ld49.tiles.OutsideVoid = class extends Tile {
    constructor(x, y) {
        super(0, x, y, false, false, false);
    }

    draw(renderer) {}
};

function debrisOffset(x, y) {
    return [(13 * x + 6 * y) / 213, (x - 5 * y) / 71];
}
