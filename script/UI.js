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
        if (this.contains(data.x, data.y) && this.click !== null) {
            ld49.app.sound.play('click');
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
        const number = this.index + 1;
        if (number >= 10) {
            const tens = Math.floor(number / 10);
            const ones = number % 10;
            app.layer.drawImage(app.images.icons, 8 * tens, 40, 8, 16, this.x + 3, this.y, 8, 16);
            app.layer.drawImage(app.images.icons, 8 * ones, 40, 8, 16, this.x + 13, this.y, 8, 16);
        } else {
            app.layer.drawImage(app.images.icons, 8 * number, 40, 8, 16, this.x + 8, this.y, 8, 16);
        }
        app.layer.drawImage(app.images.icons, 0, 56 + 8 * this.gems, 24, 8, this.x, this.y + 16, 24, 8);
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

ld49.util.GameButton = class extends ld49.util.Button {
    constructor(x, y, icon, onClick) {
        super(x, y, 16, 16, onClick);
        this.icon = icon;
    }

    draw(app) {
        const srcX = (this.icon * 32) + (this.hovered ? 16 : 0);
        app.layer.drawImage(app.images.icons, srcX, 24, 16, 16, this.x, this.y, 16, 16);
    }
};

ld49.util.Panel = class extends ld49.util.Button {
    constructor(x, y, w, h, sx, sy) {
        super(x, y, w, h, null);
        this.sx = sx;
        this.sy = sy;
    }

    draw(app) {
        app.layer.drawImage(
            app.images.icons,
            this.sx, this.sy, this.w, this.h,
            this.x, this.y, this.w, this.h);
    }
}

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
