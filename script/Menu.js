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
            const x = 10 + i % 8 * 28;
            const y = 70 + Math.floor(i / 8) * 28;
            if (i < scores.length) {
                let levelIdx = i;
                buttons.push(new ld49.util.LevelButton(
                    x, y, i, scores[i],
                    () => startLevel(levelIdx),
                ));
            } else {
                buttons.push(new ld49.util.LockedLevelButton(
                    x, y
                ));
            }
        }
        buttons.push(new ld49.util.Panel(ld49.screenWidth / 2 - 100, 4, 200, 56, 0, 88));
        this.ui = new ld49.util.UI(buttons);
    }

    mousemove(data) {
        this.ui.mouseMove(data);
    }

    mousedown(data) {
        this.ui.click(data);
    }

    render() {
        this.app.layer.fillStyle(ld49.background).fillRect(0, 0, ld49.screenWidth, ld49.screenHeight);
        this.ui.draw(this.app);
    }
};