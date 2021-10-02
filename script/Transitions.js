'use strict';

ld49.states.TransitionInto = class extends State {
    constructor(to) {
        super();
        this.to = to;
        this.progress = 0;
        this.buffer = cq(ld49.screenWidth, ld49.screenHeight);
    }

    step(dt) {
        this.progress += dt;
        if (this.progress >= 1) {
            this.app.setState(this.to);
        }
    }

    render() {
        this.buffer
            .fillStyle('#222')
            .fillRect(0, 0, ld49.screenWidth, ld49.screenHeight);
        const renderer = new ld49.util.Renderer(
            this.buffer,
            this.app.images.tiles,
            (x, y, z) => {
                let delta = -10 - y * 2 + this.progress * 30 + Math.sin(x + y * 0.3);
                if (delta > 0) {
                    delta = 0;
                }
                return [x, y, z + delta];
            });
        this.to.draw(renderer);
        renderer.finishDrawing();
        this.app.layer.drawImage(this.buffer.canvas, 0, 0, ld49.screenWidth, ld49.screenHeight);
    }
};

ld49.states.TransitionBetween = class extends State {
    constructor(from, to) {
        super();
        this.from = from;
        this.to = to;
        this.progress = 0;
        this.buffer = cq(ld49.screenWidth, ld49.screenHeight);
    }

    step(dt) {
        this.progress += dt * 0.7;
        if (this.progress >= 1) {
            this.app.setState(this.to);
        }
    }

    render() {
        this.buffer
            .fillStyle('#222')
            .fillRect(0, 0, ld49.screenWidth, ld49.screenHeight);
        const renderer = new ld49.util.Renderer(
            this.buffer,
            this.app.images.tiles,
            (x, y, z) => {
                const dist = this.from.height - 1 - y;
                const startedFall = (this.from.height + 2 - dist + (dist === 0 ? 0 : Math.sin(x + y * 0.3) - 1)) / (this.from.height + 2);
                const fallSpeed = 4 * (this.from.height + 2);
                let delta = 0;
                if (this.progress > startedFall) {
                    delta = -(this.progress - startedFall) * fallSpeed;
                }
                y -= this.progress * (this.from.height - 1);
                return [x, y, z + delta];
            });
        this.from.draw(renderer);
        renderer.transform = (x, y, z) => {
            const dist = y;
            const endedFall = (dist + (dist === 0 ? 0 : Math.sin(x + y * 0.3) + 2)) / (this.from.height + 2);
            const fallSpeed = 4 * (this.to.height + 2);
            let delta = 0;
            if (this.progress < endedFall) {
                delta = (endedFall - this.progress) * fallSpeed;
            }
            y += (1 - this.progress) * (this.from.height - 1);
            return [x, y, z + delta];
        };
        this.to.draw(renderer);
        renderer.finishDrawing();
        this.app.layer.drawImage(this.buffer.canvas, 0, 0, ld49.screenWidth, ld49.screenHeight);
    }
};
