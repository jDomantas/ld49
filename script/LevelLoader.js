'use strict';

ld49.loadLevel = function(game, level) {
    function drawNumber(x, y, number) {
        if (number >= 10) {
            x = drawNumber(x, y, Math.floor(number / 10));
        }
        game.tiles[y][x] = new ld49.tiles.Digit(x, y, number % 10);
        return x + 1;
    }
    var levelData = ld49.app.data.levels.levels[level];
    // console.log(levelData);
    var tiles = [];
    var t = ld49.tiles;
    for (var y = 0; y < ld49.gameHeight; y++) {
        // console.log('row ' + y + ': ' + levelData[y]);
        tiles.push([]);
        for (var x = 0; x < ld49.gameWidth; x++) {
            var ch = levelData[y][x];
            var tile;
            if (ch === '.') {
                tile = new t.Floor(x, y);
            } else if (ch === '#') {
                let walls = 0;
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        let xx = x + dx;
                        let yy = y + dy;
                        if (xx < 0 || yy < 0 || xx >= ld49.gameWidth || yy >= ld49.gameHeight) {
                            walls += 1;
                            continue;
                        }
                        // console.log(yy + ', ' + xx);
                        if (levelData[yy][xx] == '#') {
                            walls += 1;
                        }
                    }
                }
                if (walls == 9) {
                    tile = new t.Void(x, y);
                } else {
                    tile = new t.Wall(x, y);
                }
            } else if (ch === '@') {
                tile = new t.Floor(x, y);
                game.entities.push(new ld49.entities.Player(x, y));
            } else {
                console.log('bad tile at (' + x + '; ' + y + '), ch = ' + ch);
                tile = new t.Floor(x, y);
            }
            tiles[y].push(tile);
        }
    }
    game.tiles = tiles;
    drawNumber(1, 1, 800815);
}
