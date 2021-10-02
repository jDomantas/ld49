ld49.util.Button = class {
    constructor(x, y, w, h, onClick) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.onClick = onClick;
        this.hovered = false;
    }

    contains(x, y) {
        return this.x <= x && x < this.x + this.w && this.y <= y && y < this.y + this.h;
    }

    mouseMove(data) {
        this.hovered = this.contains(data.x, data.y);
    }

    click(data) {
        if (this.contains(data.x, data.y)) {
            this.onClick();
        }
    }

    draw(app) {
        throw new Error('must override draw()');
    }
};

ld49.util.LevelButton = class extends ld49.util.Button {
    constructor(x, y, index, gems, onClick) {
        super(x, y, 24, 24, onClick);
        this.index = index;
        this.gems = gems;
    }

    draw(app) {
        const srcX = this.hovered ? 24 : 0;
        app.layer.drawImage(app.images.icons, srcX, 0, 24, 24, this.x, this.y, 24, 24);
        app.layer.drawImage(app.images.icons, 72, 16 * this.index, 24, 16, this.x, this.y, 24, 16);
        app.layer.drawImage(app.images.icons, 0, 40 + 8 * this.gems, 24, 8, this.x, this.y + 16, 24, 8);
    }
};

ld49.util.LockedLevelButton = class extends ld49.util.Button {
    constructor(x, y) {
        super(x, y, 24, 24, () => {});
    }

    draw(app) {
        const srcX = this.hovered ? 24 : 0;
        app.layer.drawImage(app.images.icons, srcX, 0, 24, 24, this.x, this.y, 24, 24);
        app.layer.drawImage(app.images.icons, 48, 0, 24, 24, this.x, this.y, 24, 24);
    }
};

ld49.util.ResetButton = class extends ld49.util.Button {
    constructor(x, y, onClick) {
        super(x, y, 16, 16, onClick);
    }

    draw(app) {
        const srcX = this.hovered ? 16 : 0;
        app.layer.drawImage(app.images.icons, srcX, 24, 16, 16, this.x, this.y, 16, 16);
        app.layer.drawImage(app.images.icons, 32, 24, 16, 16, this.x, this.y, 16, 16);
    }
};

ld49.util.UI = class {
    constructor(buttons) {
        this.buttons = buttons;
    }

    mouseMove(data) {
        for (const button of this.buttons) {
            button.mouseMove(data);
        }
    }

    click(data) {
        for (const button of this.buttons) {
            button.click(data);
        }
    }

    draw(app) {
        for (const button of this.buttons) {
            button.draw(app);
        }
    }
};
