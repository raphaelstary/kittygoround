var EndScreen = (function (drawClouds, drawIcons, Width, Height, Font, drawButtons, loadInteger, localStorage,
    Transition) {
    "use strict";

    function EndScreen(services) {
        this.stage = services.stage;
        this.sceneStorage = services.sceneStorage;
        this.buttons = services.buttons;
        this.messages = services.messages;
        this.timer = services.timer;
        this.events = services.events;
        this.device = services.device;
        this.sounds = services.sounds;
        this.tap = services.tap;
    }

    var STORAGE_BEST = 'kitty_go_round-best';
    var WHITE = '#fff';
    var GOLD = '#ffd700';

    EndScreen.prototype.show = function (next) {
        var self = this;
        var drawables = [];
        var buttons = [];
        var taps = [];

        drawClouds(this.stage).forEach(function (elem) {
            drawables.push(elem);
        });
        var icons = drawIcons(self.stage, self.sceneStorage, self.events, self.buttons, self.messages, self.device,
            self.sounds, self.tap);

        icons.drawables.forEach(function (elem) {
            drawables.push(elem);
        });
        icons.taps.forEach(function (elem) {
            taps.push(elem);
        });

        var best = loadInteger(STORAGE_BEST);
        var points = this.sceneStorage.points;
        var newRecord = points > best;

        if (newRecord) {
            localStorage.setItem(STORAGE_BEST, points);
            best = points;
        }

        var scoreTxt = this.stage.drawText(Width.HALF, Height.get(48, 12), this.messages.get('end', 'score'), Font._15,
            'GameFont', '#fc6da4');
        drawables.push(scoreTxt);
        var scoreValueTxt = this.stage.drawText(Width.HALF, Height.get(48, 15), points.toString(), Font._15, 'GameFont',
            '#fc6da4');
        drawables.push(scoreValueTxt);
        var bestTxt = this.stage.drawText(Width.HALF, Height.get(48, 20), this.messages.get('end', 'best'), Font._15,
            'GameFont', '#fc6da4');
        drawables.push(bestTxt);
        var bestValueTxt = this.stage.drawText(Width.HALF, Height.get(48, 23), best.toString(), Font._15,
            'GameFont', '#fc6da4');
        drawables.push(bestValueTxt);

        function getNewDistanceX() {
            return bestTxt.getEndX() + bestTxt.getWidthHalf();
        }

        if (newRecord) {
            var newScore = self.stage.drawText(getNewDistanceX, Height.get(48, 23),
                self.messages.get('end', 'new_record'), Font._15, 'GameFont', GOLD, 3, [bestTxt]);
            var newScoreHighlight = self.stage.drawText(getNewDistanceX, Height.get(48, 23),
                self.messages.get('end', 'new_record'), Font._15, 'GameFont', WHITE, 4, [bestTxt]);
            self.stage.animateAlphaPattern(newScoreHighlight, [
                {
                    value: 1,
                    duration: 30,
                    easing: Transition.LINEAR
                }, {
                    value: 0,
                    duration: 30,
                    easing: Transition.LINEAR
                }
            ], true);
            drawables.push(newScore, newScoreHighlight);
        }

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
            taps.forEach(self.tap.remove.bind(self.tap));

            next();
        }
    };

    return EndScreen;
})(drawClouds, drawIcons, Width, Height, Font, drawButtons, loadInteger, lclStorage, Transition);