ld49.states.Menu = class extends State {
    constructor() {
        super();
        const startLevel = (level) => {
            const game = new ld49.states.Game(level);
            const transition = new ld49.states.TransitionInto(game);
            ld49.app.setState(transition);
        }
        const buttons = [];
        const scores = ld49.util.getScores();
        for (let i = 0; i < ld49.app.data.levels.levels.length; i++) {
            if (i < scores.length) {
                let levelIdx = i;
                buttons.push(new ld49.util.LevelButton(
                    28 + i % 5 * 40, 28 + Math.floor(i / 5) * 40, i, scores[i],
                    () => startLevel(levelIdx),
                ));
            } else {
                buttons.push(new ld49.util.LockedLevelButton(
                    28 + i % 5 * 40, 28 + Math.floor(i / 5) * 40
                ));
            }
        }
        this.ui = new ld49.util.UI(buttons);
    }

    mousemove(data) {
        this.ui.mouseMove(data);
    }

    mousedown(data) {
        this.ui.click(data);
    }

    render() {
        this.app.layer.fillStyle('#222').fillRect(0, 0, ld49.screenWidth, ld49.screenHeight);
        this.ui.draw(this.app);
    }
};