'use strict';

ld49.loadLevel = function(game, level) {
    const levelData = ld49.app.data.levels.levels[level];
    // console.log(levelData);
    const tiles = [];
    const entities = [];
    const t = ld49.tiles;
    for (var y = 0; y < ld49.gameHeight; y++) {
        // console.log('row ' + y + ': ' + levelData[y]);
        tiles.push([]);
        for (let x = 0; x < ld49.gameWidth; x++) {
            let ch = levelData[y][x];
            let tile;
            if (ch === '.') {
                tile = new t.StableFloor(x, y);
                if (y === 0) {
                    entities.push(new ld49.entities.Player(x, y));
                }
            } else if (ch === '#') {
                tile = new t.Wall(x, y);
            } else if (ch === ' ') {
                tile = new t.Void(x, y);
            } else if (ch === 'x') {
                tile = new t.crackedFloors[1](x, y);
            } else if (ch === 'G') {
                tile = new t.StableFloor(x, y);
                entities.push(new ld49.entities.Gem(x, y));
            } else {
                throw new Error('bad tile at (' + x + '; ' + y + '), ch = ' + ch);
            }
            tiles[y].push(tile);
        }
    }
    game.tiles = tiles;
    game.entities = entities;
}
