'use strict';

ld49.util.Renderer = class {
    constructor(buffer, tiles, transform) {
        this.buffer = buffer;
        this.tiles = tiles;
        this.drawings = [];
        this.transform = transform ?? ((x, y, z) => [x, y, z]);
    }

    draw(icon, x, y, z, onTop) {
        z = z ?? 0;
        [x, y, z] = this.transform(x, y, z);
        let depth = y - x - z * 0.8;
        if (onTop) {
            depth -= 100000000;
        }
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
            const destX = Math.round(drawing.x * 15 + drawing.y * 6);
            const destY = 108 + Math.round(drawing.x * 3 - drawing.y * 13 - drawing.z * 10);
            this.buffer.drawImage(
                this.tiles,
                srcX, srcY, 22, 33,
                destX, destY, 22, 33
            );
        }
    }
}
