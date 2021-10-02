'use strict';

ld49.util.Renderer = class {
    constructor(buffer, tiles) {
        this.buffer = buffer;
        this.tiles = tiles;
        this.drawings = [];
    }

    draw(icon, x, y, z) {
        z = z ?? 0;
        const depth = y - x - z;
        this.drawings.push({
            icon,
            x,
            y,
            z,
            depth,
        })
    }

    finishDrawing() {
        this.drawings.sort((a, b) => b.depth - a.depth);
        for (const drawing of this.drawings) {
            const row = Math.floor(drawing.icon / 8);
            const col = drawing.icon % 8;
            const srcX = col * 23 + 1;
            const srcY = row * 34 + 1;
            const destX = 10 + Math.round(drawing.x * 15 + drawing.y * 6);
            const destY = 100 + Math.round(drawing.x * 3 - drawing.y * 13 - drawing.z * 10);
            this.buffer.drawImage(
                this.tiles,
                srcX, srcY, 22, 33,
                destX, destY, 22, 33
            );
        }
    }
}
