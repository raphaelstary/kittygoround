var EndScreen = (function (drawClouds, drawIcons, Width, Height, Font, drawButtons) {
    "use strict";

    function EndScreen(services) {
        this.stage = services.stage;
        this.storage = services.sceneStorage;
        this.buttons = services.buttons;
        this.messages = services.messages;
        this.timer = services.timer;
    }

    EndScreen.prototype.show = function (next) {
        var self = this;
        var drawables = [];
        var buttons = [];

        drawClouds(this.stage).forEach(function (elem) {
            drawables.push(elem);
        });
        drawIcons(this.stage).forEach(function (elem) {
            drawables.push(elem);
        });

        var score = this.stage.drawText(Width.HALF, Height.get(48, 12), this.storage.points.toString(), Font._15,
            'GameFont', '#fc6da4');
        drawables.push(score);
        var pointsTxt = this.stage.drawText(Width.HALF, Height.get(48, 15), 'points', Font._15, 'GameFont', '#fc6da4');
        drawables.push(pointsTxt);

        drawButtons(this.buttons, this.messages, this.timer, toNextScene).forEach(function (elem) {
            buttons.push(elem);
        });

        var itIsOver = false;

        function toNextScene() {
            if (itIsOver)
                return;
            itIsOver = true;

            drawables.forEach(self.stage.remove.bind(self.stage));
            buttons.forEach(self.buttons.remove.bind(self.buttons));

            next();
        }
    };

    return EndScreen;
})(drawClouds, drawIcons, Width, Height, Font, drawButtons);