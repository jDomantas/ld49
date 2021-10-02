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
        this.chain = null;
        this.pull = null;
    }

    input(game, key) {
        if (this.moveLeft > 0 || this.chain !== null || this.pull !== null) {
            return;
        }
        if (key === 'space') {
            this.shootChain();
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
            // game.app.sound.play('shoot');
            return;
        }
        game.tiles[this.y][this.x].walked(game);
        this.moveX = this.x - destX;
        this.moveY = this.y - destY;
        this.moveLeft = 1;
        this.x = destX;
        this.y = destY;
    }

    shootChain() {
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
    }

    update(game, dt) {
        if (this.pull !== null) {
            if (this.pull.tighten >= 0) {
                this.pull.tighten -= dt * 10;
            }
            if (this.pull.tighten <= 0) {
                this.pull.tighten = 0;
                this.pull.stepProgress += dt * 120;
                while (this.pull !== null && this.pull.stepProgress >= 1) {
                    this.pull.stepProgress -= 1;
                    this.pull.stepsDone += 1;
                    if (this.pull.stepsDone >= this.pull.steps) {
                        this.x = this.pull.destX;
                        this.y = this.pull.destY;
                        this.pull = null;
                    }
                }
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
                            steps: this.chain.steps,
                            stepsDone: 0,
                            stepProgress: 0,
                            tighten: 1,
                            tiles: Math.abs(destX - this.x) + Math.abs(destY - this.y),
                        };
                        // TODO: cling sound for successful grapple
                    } else {
                        // TODO: chain fail sound
                    }
                    this.chain = null;
                } else if (!tile.canFly) {
                    this.chain = null;
                    // TODO: chain fail sound
                }
            }
        }
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
        if (this.pull !== null) {
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
            renderer.draw(16 + this.dir * 4, this.x + this.pull.dx * delta, this.y + this.pull.dy * delta);
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
            renderer.draw(16 + this.dir * 4, this.x, this.y);
        } else {
            const frame = Math.round(this.frame) % 4;
            renderer.draw(16 + this.dir * 4 + frame, this.x + this.moveX * this.moveLeft, this.y + this.moveY * this.moveLeft);
        }
    }
}
