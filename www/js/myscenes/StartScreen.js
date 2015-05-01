var StartScreen = (function () {
    "use strict";

    function StartScreen(services) {
        this.stage = services.stage;
        this.storage = services.sceneStorage;
        this.buttons = services.buttons;
        this.messages = services.messages;
        this.timer = services.timer;
    }

    StartScreen.prototype.show = function (next) {
        var self = this;
        var drawables = [];
        var buttons = [];

        drawClouds(this.stage).forEach(function (elem) {
            drawables.push(elem);
        });
        drawIcons(this.stage).forEach(function (elem) {
            drawables.push(elem);
        });

        var logoKitty = this.stage.drawText(Width.HALF, Height.get(48, 12), 'Kitty', Font._15, 'GameFont', '#fc6da4');
        drawables.push(logoKitty);
        var logoGoRound = this.stage.drawText(Width.HALF, Height.get(48, 15), 'go round', Font._15, 'GameFont', '#fc6da4');
        drawables.push(logoGoRound);

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

    return StartScreen;
})();