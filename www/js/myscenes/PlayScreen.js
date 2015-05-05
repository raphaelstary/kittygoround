var PlayScreen = (function (drawClouds, Width, Height, Font, Event, PlayFactory, installPlayerKeyBoard,
    installPlayerPointer, showMenu) {
    "use strict";

    function PlayScreen(services) {
        this.stage = services.stage;
        this.events = services.events;
        this.timer = services.timer;
        this.tap = services.tap;
        this.device = services.device;
        this.storage = services.sceneStorage;
        this.buttons = services.buttons;
    }

    var BUBBLE_GUM = '#fdd9e7';
    var LEMONADE = '#fbf7d4';

    PlayScreen.prototype.show = function (next) {
        var self = this;
        var drawables = [];
        var buttons = [];
        var listener = [];

        drawClouds(this.stage).forEach(function (elem) {
            drawables.push(elem);
        });

        var pauseBtn = this.stage.drawFresh(Width.get(32, 2), Height.get(48, 2), 'pause');

        var left = this.stage.drawFresh(Width.get(32, 4), Height.get(48, 44), 'left', undefined, undefined, undefined,
            undefined, 3);
        drawables.push(left);
        var right = this.stage.drawFresh(Width.get(32, 28), Height.get(48, 44), 'right', undefined, undefined,
            undefined, undefined, 3);
        drawables.push(right);

        var radiusFn = Font._10;
        var outerCircle = this.stage.drawCircle(Width.HALF, Height.HALF, radiusFn, BUBBLE_GUM, false, Font._35);
        drawables.push(outerCircle);
        var innerCircle = this.stage.drawCircle(Width.HALF, Height.HALF, Font._30, LEMONADE, true);
        drawables.push(innerCircle);

        var world = PlayFactory.createWorld(this.stage, this.events, toNextScene);

        world.addTwoCats();
        listener.push(this.events.subscribe(Event.TICK_COLLISION, world.checkCollisions.bind(world)));
        listener.push(this.events.subscribe(Event.TICK_MOVE, world.update.bind(world)));

        var playerController = PlayFactory.createPlayerController(world);
        var keyBoardListener;
        var pointerListener;

        function registerPlayerInput() {
            keyBoardListener = installPlayerKeyBoard(self.events, playerController);
            pointerListener = installPlayerPointer(self.events, self.device, playerController);
        }

        registerPlayerInput();

        var goFs = false;
        listener.push(self.events.subscribe(Event.SHOW_GO_FULL_SCREEN, function () {
            goFs = true;
        }));

        listener.push(self.events.subscribe(Event.REMOVE_GO_FULL_SCREEN, function () {
            goFs = false;
        }));
        var rotation = false;
        listener.push(self.events.subscribe(Event.SHOW_ROTATE_DEVICE, function () {
            rotation = true;
        }));

        listener.push(self.events.subscribe(Event.REMOVE_ROTATE_DEVICE, function () {
            rotation = false;
        }));

        listener.push(self.events.subscribe(Event.PAGE_VISIBILITY, function (hidden) {
            if (hidden) {
                if (!isPaused)
                    self.storage.shouldShowMenu = true;
            } else {
                self.timer.doLater(function () {
                    if (self.storage.shouldShowMenu && !goFs && !rotation) {
                        self.storage.shouldShowMenu = false;
                        doThePause();
                    }
                }, 2);
            }
        }));

        listener.push(self.events.subscribe(Event.RESUME, registerPlayerInput));
        listener.push(self.events.subscribe(Event.PAUSE, function () {
            self.events.unsubscribe(pointerListener);
            self.events.unsubscribe(keyBoardListener);
        }));

        var isPaused = false;

        function pause() {
            isPaused = true;
        }

        function resume() {
            pauseButton.used = false;
            isPaused = false;
        }

        function doThePause() {
            pause();
            self.events.fireSync(Event.PAUSE);
            self.storage.menuScene = 'pause_menu';
            showMenu(self.stage, self.buttons, self.messages, self.events, self.sceneStorage, self.device, self.sounds,
                resume);
        }

        var itIsOver = false;

        function toNextScene(points) {
            if (itIsOver)
                return;
            itIsOver = true;

            drawables.forEach(self.stage.remove.bind(self.stage));
            buttons.forEach(self.buttons.remove.bind(self.buttons));
            listener.forEach(self.events.unsubscribe.bind(self.events));
            self.events.unsubscribe(keyBoardListener);
            self.events.unsubscribe(pointerListener);
            self.stage.remove(pauseBtn);
            world.terminate();

            self.storage.points = points;
            next();
        }
    };

    return PlayScreen;
})(drawClouds, Width, Height, Font, Event, PlayFactory, installPlayerKeyBoard, installPlayerPointer, showMenu);