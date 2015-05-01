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

        var cloud1 = this.stage.drawFresh(Width.THIRD, Height.QUARTER, 'cloud1', 2);
        drawables.push(cloud1);
        var cloud2 = this.stage.drawFresh(Width.THREE_QUARTER, Height.THIRD, 'cloud2', 2);
        drawables.push(cloud2);
        var cloud3 = this.stage.drawFresh(Width.QUARTER, Height.TWO_THIRD, 'cloud3', 2);
        drawables.push(cloud3);
        var cloud4 = this.stage.drawFresh(Width.TWO_THIRD, Height.THREE_QUARTER, 'cloud4', 2);
        drawables.push(cloud4);

        var goFS = this.stage.drawFresh(Width.get(32, 2), Height.get(48, 2), 'go_fullscreen');
        drawables.push(goFS);
        var soundOn = this.stage.drawFresh(Width.get(32, 2), Height.get(48, 5), 'unmute');
        drawables.push(soundOn);
        var info = this.stage.drawTextWithInput(Width.get(32, 2), Height.get(48, 8), 'i', Font._30, 'GameFont', '#283032');
        drawables.push(info);

        var logoKitty = this.stage.drawText(Width.HALF, Height.get(48, 12), 'Kitty', Font._15, 'GameFont', '#fc6da4');
        drawables.push(logoKitty);
        var logoGoRound = this.stage.drawText(Width.HALF, Height.get(48, 15), 'go round', Font._15, 'GameFont', '#fc6da4');
        drawables.push(logoGoRound);

        var start = this.buttons.createPrimaryButton(Width.HALF, Height.get(48,36), this.messages.get('start', 'play'), function () {
            self.timer.doLater(toNextScene, 6);
        }, 3);
        buttons.push(start);
        var moreGames = this.buttons.createPrimaryButton(Width.HALF, Height.get(48, 40), this.messages.get('start', 'more_games'), function () {
            window.location.href = window.moreGamesLink;
        }, 3);
        buttons.push(moreGames);

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