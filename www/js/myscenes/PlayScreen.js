var PlayScreen = (function () {
    "use strict";

    function PlayScreen(services) {
        this.stage = services.stage;
        this.events = services.events;
        this.timer = services.timer;
        this.tap = services.tap;
        this.device = services.device;
    }

    var BUBBLE_GUM = '#fdd9e7';
    var LEMONADE = '#fbf7d4';

    PlayScreen.prototype.show = function (next) {
        var self = this;
        var drawables = [];
        var buttons = [];

        drawClouds(this.stage).forEach(function (elem) {
            drawables.push(elem);
        });

        var pauseBtn = this.stage.drawFresh(Width.get(32, 2), Height.get(48, 2), 'pause');
        drawables.push(pauseBtn);

        var points = this.stage.drawText(Width.get(32, 28), Height.get(48, 3), '0', Font._15, 'GameFont', '#fc6da4');
        drawables.push(points);

        var left = this.stage.drawFresh(Width.get(32, 4), Height.get(48, 44), 'left', undefined, undefined, undefined,
            undefined, 3);
        drawables.push(left);
        var right = this.stage.drawFresh(Width.get(32, 28), Height.get(48, 44), 'right', undefined, undefined,
            undefined, undefined, 3);
        drawables.push(right);

        var radiusFn = Font._20;
        var outerCircle = this.stage.drawCircle(Width.HALF, Height.HALF, radiusFn, BUBBLE_GUM, false, Font._35);
        drawables.push(outerCircle);
        var innerCircle = this.stage.drawCircle(Width.HALF, Height.HALF, Font._30, LEMONADE, true);
        drawables.push(innerCircle);

        var topObstacles = {};
        var bottomObstacles = {};
        var world = PlayFactory.createWorld(this.stage, topObstacles, bottomObstacles);
        var playerController = PlayFactory.createPlayerController(world);
        world.addTwoCats();
        var worldListener = this.events.subscribe(Event.TICK_COLLISION, world.checkCollisions.bind(world));
        var levels = PlayFactory.createLevels(this.stage, topObstacles, bottomObstacles);
        var levelsListener = this.events.subscribe(Event.TICK_MOVE, levels.update.bind(levels));

        var playerListener = this.events.subscribe(Event.POINTER, function (pointer) {
            if (pointer.type == 'down') {
                if (pointer.x < Width.HALF(self.device.width)) {
                    playerController.turnLeft();
                } else {
                    playerController.turnRight();
                }
            }
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

    return PlayScreen;
})();