'use strict';

window.ld39 = {
    states: {},
    tiles: {},
    entities: {},
    util: {},
    gameWidth: 12,
    gameHeight: 10,
    screenWidth: 240,
    screenHeight: 160,
};

ld39.util.unlockLevel = function(lvl) {
    if (lvl <= ld39.util.lastUnlocked)
        return;
    ld39.util.lastUnlocked = lvl;
    try {
        localStorage.setItem('lastUnlocked', lvl.toString());
    } catch(e) {}
}
ld39.onLoad = function() {
    ld39.util.lastUnlocked = 0;
    try {
        const unlock = parseInt(localStorage.getItem('lastUnlocked'));
        if (unlock >= 0) {
            ld39.util.lastUnlocked = unlock;
        }
    } catch(e) {}

    const width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

    const height = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;

    const container = document.getElementById('container');

    const widthScale = Math.floor(width / ld39.screenWidth);
    const heightScale = Math.floor((height - 40) / ld39.screenHeight);
    const scale = Math.max(1, Math.min(widthScale, heightScale));
    container.style.width = (scale * ld39.screenWidth) + 'px';
    container.style.height = (scale * ld39.screenHeight) + 'px';

    ld39.app = new PLAYGROUND.Application({
        smoothing: false,
        scale: scale,
        width: ld39.screenWidth,
        height: ld39.screenHeight,
        container: '#container',

        create: function() {
            this.loadData('levels');
            this.loadImages('tiles');
            this.loadSounds('shoot');
        },

        ready: function() {
            // ld39.states.Game.currentLevel = 0;
            this.setState(new ld39.states.Game(0));
        }
    });
}
