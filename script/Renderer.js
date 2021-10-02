'use strict';

ld39.util.Renderer = class {
    constructor(buffer, tiles) {
        this.buffer = buffer;
        this.tiles = tiles;
    }

    draw(icon, x, y, z) {
        z = z ?? 0;
        const row = Math.floor(icon / 4);
        const col = icon % 4;
        const srcX = col * 23 + 1;
        const srcY = row * 34 + 1;
        const destX = 10 + Math.round(x * 15 + y * 6);
        const destY = 100 + Math.round(x * 3 - y * 13 - z * 10);
        this.buffer.drawImage(
            this.tiles,
            srcX, srcY, 22, 33,
            destX, destY, 22, 33
        );
    }
}
