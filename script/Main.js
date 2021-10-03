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
    background: '#444449',
};

class State {
    step(dt) {}
    mousedown(data) {}
    keydown(data) {}
    keyup(data) {}
    render() {}
}

PLAYGROUND.Transitions.nop = function(app, progress, screenshot) {};

ld49.util.scores = [0];
ld49.util.finishedLevel = (index, gems) => {
    // add 0 for next level to unlock it
    while (index + 1 >= ld49.util.scores.length) {
        ld49.util.scores.push(0);
    }
    if (ld49.util.scores[index] < gems) {
        ld49.util.scores[index] = gems;
    }
    try {
        localStorage.setItem('levelScores', JSON.stringify(ld49.util.scores));
    } catch(e) {}
}
ld49.util.getScores = () => {
    return ld49.util.scores;
};
ld49.util.resetScores = () => {
    localStorage.setItem('levelScores', JSON.stringify(null));
};

ld49.onLoad = function() {
    try {
        const scores = JSON.parse(localStorage.getItem('levelScores'));
        if (typeof scores === 'object' && scores !== null) {
            ld49.util.scores = scores;
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
        const newScale = setSize();
        ld49.app.scale = newScale;
    });

    ld49.app = new PLAYGROUND.Application({
        smoothing: false,
        scale: scale,
        width: ld49.screenWidth,
        height: ld49.screenHeight,
        container: '#container',
        transition: 'nop',
        transitionDuration: 0.000001,

        create: function() {
            this.loadData('levels');
            this.loadImages('tiles', 'icons');
            this.loadSounds('gem', 'pull', 'pull_fail', 'throw', 'click');
        },

        ready: function() {
            this.setState(new ld49.states.Menu());
        },
    });
}
