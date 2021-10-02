'use strict';

window.ld49 = {
    states: {},
    tiles: {},
    entities: {},
    util: {},
    gameWidth: 12,
    gameHeight: 10,
    screenWidth: 240,
    screenHeight: 160,
};

ld49.util.unlockLevel = function(lvl) {
    if (lvl <= ld49.util.lastUnlocked) {
        return;
    }
    ld49.util.lastUnlocked = lvl;
    try {
        localStorage.setItem('lastUnlocked', lvl.toString());
    } catch(e) {}
}
ld49.onLoad = function() {
    ld49.util.lastUnlocked = 0;
    try {
        const unlock = parseInt(localStorage.getItem('lastUnlocked'));
        if (unlock >= 0) {
            ld49.util.lastUnlocked = unlock;
        }
    } catch(e) {}

    const container = document.getElementById('container');

    function setSize() {
        const width = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;

        const height = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;

        const widthScale = Math.floor(width / ld49.screenWidth);
        const heightScale = Math.floor((height - 40) / ld49.screenHeight);
        const scale = Math.max(1, Math.min(widthScale, heightScale));
        container.style.width = (scale * ld49.screenWidth) + 'px';
        container.style.height = (scale * ld49.screenHeight) + 'px';
        return scale;
    }

    const scale = setSize();
    window.addEventListener('resize', () => {
        console.log('resized');
        const newScale = setSize();
        ld49.app.scale = newScale;
    });

    ld49.app = new PLAYGROUND.Application({
        smoothing: false,
        scale: scale,
        width: ld49.screenWidth,
        height: ld49.screenHeight,
        container: '#container',

        create: function() {
            this.loadData('levels');
            this.loadImages('tiles');
            this.loadSounds('shoot');
        },

        ready: function() {
            // ld49.states.Game.currentLevel = 0;
            this.setState(new ld49.states.Game(0));
        }
    });
}
