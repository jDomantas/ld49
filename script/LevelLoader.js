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
                tile = new t.SmoothWall(x, y);
            } else if (ch === '$') {
                tile = new t.CobbleWall(x, y);
            } else if (ch === '&') {
                tile = new t.FragileWall(x, y);
            } else if (ch === ' ') {
                tile = new t.Void(x, y);
            } else if (ch === 'x') {
                tile = new t.crackedFloors[1](x, y);
            } else if (ch === 'X') {
                tile = new t.crackedFloors[0](x, y);
            } else if (ch === '@') {
                tile = new t.FragileWall(x, y);
            } else if (ch === 'G') {
                tile = new t.StableFloor(x, y);
                entities.push(new ld49.entities.Gem(x, y));
            } else if (ch === 'g') {
                tile = new t.Void(x, y);
                entities.push(new ld49.entities.Gem(x, y));
            } else {
                throw new Error('bad tile at (' + x + '; ' + y + '), ch = ' + ch);
            }
            tiles[y].push(tile);
        }
    }
    game.tiles = tiles;
    game.entities = entities;
    if (level === 0) {
        game.ui.buttons.push(new ld49.util.Panel(
            ld49.screenWidth - 48 - 4, ld49.screenHeight - 4 - 4 - 32 - 32, 48, 32, 80, 0));
        game.ui.buttons.push(new ld49.util.Panel(
            ld49.screenWidth - 48 - 4, ld49.screenHeight - 4 - 32, 48, 32, 80, 32));
    } else if (level === 8) {
        game.ui.buttons.push(new ld49.util.Panel(
            ld49.screenWidth - 56 - 4, ld49.screenHeight - 4 - 16, 56, 16, 72, 64));
    } else if (level === 23) {
        game.entities.push(new ld49.entities.Trophy(5, 5));
        game.entities.push(new ld49.entities.Egg(8, 1));
        let totalGems = 0;
        for (const val of ld49.util.getScores()) {
            totalGems += val;
        }
        console.log('total: ' + totalGems);
        if (totalGems >= 69) {
            game.tiles[7][7] = new t.LockFloor(7, 7);
        } else {
            game.tiles[7][7] = new t.LockWall(7, 7);
        }
    }
}
