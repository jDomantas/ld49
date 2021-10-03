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
        this.dir = 2;
        this.chain = null;
        this.pull = null;
        this.live = true;
        this.hold = null;
    }

    input(game, key) {
        if (this.moveLeft > 0 || this.chain !== null || this.pull !== null || this.hold !== null) {
            return;
        }
        if (key === 'space') {
            this.shootChain(game);
            return;
        }
        let dx = 0, dy = 0, dir = 0;
        if (key == 'w' || key == 'up') { dy = 1; dir = 2; }
        else if (key == 's' || key == 'down') { dy = -1; dir = 0; }
        else if (key == 'a' || key == 'left') { dx = -1; dir = 1; }
        else if (key == 'd' || key == 'right') { dx = 1; dir = 3; }
        else { return; }
        const destX = this.x + dx;
        const destY = this.y + dy;
        const tile = game.getTile(destX, destY);
        this.dir = dir;
        if (!tile.canWalk) {
            return;
        }
        game.tiles[this.y][this.x].leaveTrigger(game);
        this.moveX = this.x - destX;
        this.moveY = this.y - destY;
        this.moveLeft = 1;
        this.x = destX;
        this.y = destY;
    }

    shootChain(game) {
        let dx, dy;
        switch (this.dir) {
            case 0: dx = 0; dy = -1; break;
            case 1: dx = -1; dy = 0; break;
            case 2: dx = 0; dy = 1; break;
            case 3: dx = 1; dy = 0; break;
        }
        this.chain = {
            dx,
            dy,
            steps: 2,
            stepProgress: 0,
        };
        // game.app.sound.play('throw');
    }

    update(game, dt) {
        let realX, realY;
        if (this.pull !== null) {
            if (this.pull.tighten >= 0) {
                this.pull.tighten -= dt * 10;
            }
            if (this.pull.tighten <= 0) {
                if (!this.pull.triggeredTile) {
                    if (this.pull.destX != this.x || this.pull.destY != this.y) {
                        game.getTile(this.x, this.y).leaveTrigger(game);
                    }
                    this.pull.triggeredTile = true;
                }
                const delta = this.pull.stepsDone / this.pull.steps * this.pull.tiles;
                realX = this.x + this.pull.dx * delta;
                realY = this.y + this.pull.dy * delta;
                this.pull.tighten = 0;
                this.pull.stepProgress += dt * 120;
                while (this.pull !== null && this.pull.stepProgress >= 1) {
                    this.pull.stepProgress -= 1;
                    this.pull.stepsDone += 1;
                    if (this.pull.stepsDone >= this.pull.steps) {
                        this.x = this.pull.destX;
                        this.y = this.pull.destY;
                        game.getTile(this.pull.targetX, this.pull.targetY).pullTrigger(game);
                        this.pull = null;
                    }
                }
            } else {
                realX = this.x;
                realY = this.y;
            }
        } else if (this.chain !== null) {
            this.chain.stepProgress += dt * 100;
            while (this.chain !== null && this.chain.stepProgress >= 1) {
                this.chain.stepProgress -= 1;
                this.chain.steps += 1;
                const x = Math.round(this.x + this.chain.dx * this.chain.steps / 8);
                const y = Math.round(this.y + this.chain.dy * this.chain.steps / 8);
                const tile = game.getTile(x, y);
                if (tile.canGrapple) {
                    const destX = x - this.chain.dx;
                    const destY = y - this.chain.dy;
                    const destTile = game.getTile(destX, destY);
                    if (destTile.canWalk) {
                        this.pull = {
                            destX: destX,
                            destY: destY,
                            dx: this.chain.dx,
                            dy: this.chain.dy,
                            targetX: x,
                            targetY: y,
                            steps: this.chain.steps,
                            stepsDone: 0,
                            stepProgress: 0,
                            tighten: 1,
                            tiles: Math.abs(destX - this.x) + Math.abs(destY - this.y),
                            triggeredTile: false,
                        };
                        game.app.sound.play('pull');
                    } else {
                        game.app.sound.play('pull_fail');
                    }
                    this.chain = null;
                } else if (!tile.canFly) {
                    this.chain = null;
                    game.app.sound.play('pull_fail');
                }
            }
            realX = this.x;
            realY = this.y;
        } else if (this.moveLeft > 0) {
            this.moveLeft -= dt * 4;
            this.frame += dt * 8;
            if (this.moveLeft < 0) {
                this.moveLeft = 0;
                this.frame = Math.round(this.frame / 2) * 2;
            }
            realX = this.x + this.moveX * this.moveLeft;
            realY = this.y + this.moveY * this.moveLeft;
        } else if (this.y === game.height - 1) {
            game.won = true;
            realX = this.x;
            realY = this.y;
        } else if (this.hold !== null) {
            this.hold.time -= dt;
            if (this.hold.time <= 0) {
                this.hold = null;
            }
            realX = this.x;
            realY = this.y;
        } else {
            realX = this.x;
            realY = this.y;
        }
        for (const entity of game.entities) {
            const dist = Math.abs(realX - entity.x) + Math.abs(realY - entity.y);
            if (dist <= 0.4 && entity.isGem) {
                entity.isGem = false;
                entity.live = false;
                game.gemsCollected += 1;
                entity.pickedUp(game, this);
                game.app.sound.play('gem');
            }
        }
    }

    draw(renderer) {
        if (this.hold !== null && this.moveLeft <= 0) {
            renderer.draw(41, this.x, this.y);
            renderer.draw(this.hold.icon, this.x - 0.1, this.y, 1.8, true);
        } else if (this.pull !== null) {
            for (let i = this.pull.stepsDone + 1; i <= this.pull.steps; i++) {
                const v = Math.sin((i - this.pull.steps) * 0.5);
                const mul = this.pull.tighten * 0.1;
                const x = this.x + this.pull.dx * i / 8 + this.pull.dy * v * mul;
                const y = this.y + this.pull.dy * i / 8 + this.pull.dx * v * mul;
                const icon = i === this.pull.steps
                    ? 32 + this.dir
                    : 36;
                renderer.draw(icon, x, y, 0);
            }
            const delta = this.pull.stepsDone / this.pull.steps * this.pull.tiles;
            const offset = this.pull.tighten === 0 ? 0 : -4;
            renderer.draw(12 + offset + this.dir, this.x + this.pull.dx * delta, this.y + this.pull.dy * delta);
        } else if (this.chain !== null) {
            for (let i = 1; i <= this.chain.steps; i++) {
                const v = Math.sin((i - this.chain.steps) * 0.5);
                const x = this.x + this.chain.dx * i / 8 + this.chain.dy * v * 0.1;
                const y = this.y + this.chain.dy * i / 8 + this.chain.dx * v * 0.1;
                const icon = i === this.chain.steps
                    ? 32 + this.dir
                    : 36;
                renderer.draw(icon, x, y, 0);
            }
            renderer.draw(8 + this.dir, this.x, this.y);
        } else {
            const frame = Math.round(this.frame) % 4;
            renderer.draw(16 + this.dir * 4 + frame, this.x + this.moveX * this.moveLeft, this.y + this.moveY * this.moveLeft);
        }
    }
}

ld49.entities.Gem = class extends Entity {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.live = true;
        this.bob = 0;
        this.isGem = true;
    }

    update(game, dt) {
        this.bob += dt;
    }

    draw(renderer) {
        const bob = Math.sin(this.bob * 4);
        renderer.draw(37, this.x, this.y, bob * 0.2);
    }

    pickedUp(game) {}
}

ld49.entities.Trophy = class extends Entity {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.live = true;
        this.bob = 0;
        this.isGem = true;
    }

    update(game, dt) {
        this.bob += dt;
    }

    draw(renderer) {
        const bob = Math.sin(this.bob * 4);
        renderer.draw(38, this.x, this.y, bob * 0.2);
    }

    pickedUp(game, player) {
        game.winTimer = 1.5;
        player.hold = {
            icon: 38,
            time: 2,
        };
    }
}

ld49.entities.Egg = class extends Entity {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.live = true;
        this.bob = 0;
        this.isGem = true;
    }

    update(game, dt) {
        this.bob += dt;
    }

    draw(renderer) {
        const bob = Math.sin(this.bob * 4);
        renderer.draw(39, this.x, this.y, bob * 0.2);
    }

    pickedUp(game, player) {
        player.hold = {
            time: 1,
            icon: 39,
        };
    }
}
