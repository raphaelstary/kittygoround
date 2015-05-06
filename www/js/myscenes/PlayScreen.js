var PlayScreen = (function (drawClouds, Width, Height, Font, Event, PlayFactory, installPlayerKeyBoard,
    installPlayerPointer, showMenu, drawIcons) {
    "use strict";

    function PlayScreen(services) {
        this.stage = services.stage;
        this.events = services.events;
        this.timer = services.timer;
        this.tap = services.tap;
        this.device = services.device;
        this.sceneStorage = services.sceneStorage;
        this.buttons = services.buttons;
        this.messages = services.messages;
        this.sounds = services.sounds;
        this.tap = services.tap;
    }

    var BUBBLE_GUM = '#fdd9e7';
    var LEMONADE = '#fbf7d4';

    PlayScreen.prototype.show = function (next) {
        var self = this;
        var drawables = [];
        var buttons = [];
        var listener = [];
        var taps = [];

        drawClouds(this.stage).forEach(function (elem) {
            drawables.push(elem);
        });

        var icons = drawIcons(self.stage, self.sceneStorage, self.events, self.buttons, self.messages, self.device,
            self.sounds, self.tap, true);

        icons.drawables.forEach(function (elem) {
            drawables.push(elem);
        });
        icons.taps.forEach(function (elem) {
            taps.push(elem);
        });

        var left = this.stage.drawFresh(Width.get(32, 4), Height.get(48, 44), 'left');
        drawables.push(left);
        var right = this.stage.drawFresh(Width.get(32, 28), Height.get(48, 44), 'right');
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
                    self.sceneStorage.shouldShowMenu = true;
            } else {
                self.timer.doLater(function () {
                    if (self.sceneStorage.shouldShowMenu && !goFs && !rotation) {
                        self.sceneStorage.shouldShowMenu = false;
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
            isPaused = false;
        }

        function doThePause() {
            pause();
            self.events.fireSync(Event.PAUSE);
            self.sceneStorage.menuScene = 'settings';
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
            taps.forEach(self.tap.remove.bind(self.tap));
            listener.forEach(self.events.unsubscribe.bind(self.events));
            self.events.unsubscribe(keyBoardListener);
            self.events.unsubscribe(pointerListener);
            world.terminate();

            self.sceneStorage.points = points;
            next();
        }
    };

    return PlayScreen;
})(drawClouds, Width, Height, Font, Event, PlayFactory, installPlayerKeyBoard, installPlayerPointer, showMenu,
    drawIcons);