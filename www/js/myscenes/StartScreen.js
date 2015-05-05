var StartScreen = (function (drawClouds, drawIcons, Width, Height, Font, drawButtons, document, installOneTimeTap,
    Event, window, Orientation) {
    "use strict";

    function StartScreen(services) {
        this.stage = services.stage;
        this.storage = services.sceneStorage;
        this.buttons = services.buttons;
        this.messages = services.messages;
        this.timer = services.timer;
        this.device = services.device;
        this.loop = services.loop;
        this.events = services.events;
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
        var logoGoRound = this.stage.drawText(Width.HALF, Height.get(48, 15), 'go round', Font._15, 'GameFont',
            '#fc6da4');
        drawables.push(logoGoRound);

        // full screen hack for IE11, it accepts only calls from some DOM elements like button, link or div NOT canvas
        var screenElement = document.getElementsByTagName('canvas')[0];
        var parent = screenElement.parentNode;
        var wrapper = document.createElement('div');
        parent.replaceChild(wrapper, screenElement);
        wrapper.appendChild(screenElement);

        var startButton = self.buttons.createPrimaryButton(Width.HALF, Height.THREE_QUARTER,
            self.messages.get('start', 'start'), function () {
                // sadly not working on IE11
            }, 3);

        installOneTimeTap(wrapper, function () {

            wrapper.parentNode.replaceChild(screenElement, wrapper);
            goFullScreen();
        });

        function goFullScreen() {
            self.buttons.remove(startButton);
            self.timer.doLater(function () {
                drawButtons(self.buttons, self.messages, self.timer, toNextScene).forEach(function (elem) {
                    buttons.push(elem);
                });
            }, 6);

            var goFsScreen = false;
            var shouldShowGoFsScreen = false;
            var rotateScreen = false;
            var shouldShowRotateScreen = false;

            var usedOnce = false;
            self.events.subscribe(Event.FULL_SCREEN, function (isFullScreen) {
                if (isFullScreen) {
                    if (!usedOnce) {
                        usedOnce = true;
                        return;
                    }
                    goFsScreen = false;
                    self.events.fire(Event.REMOVE_GO_FULL_SCREEN);
                    if (!rotateScreen && !shouldShowRotateScreen) {
                        if (self.storage.menuOn) {
                            self.events.fire(Event.RESUME_MENU);
                        } else if (self.storage.shouldShowMenu) {
                            self.storage.shouldShowMenu = false;
                            self.events.fire(Event.SHOW_MENU);
                        } else {
                            self.events.fire(Event.RESUME);
                        }
                    } else if (shouldShowRotateScreen) {
                        shouldShowRotateScreen = false;
                        rotateScreen = true;
                        self.events.fire(Event.SHOW_ROTATE_DEVICE);
                    }
                } else {
                    if (!rotateScreen) {
                        self.events.fireSync(Event.PAUSE);
                        goFsScreen = true;
                        self.events.fire(Event.SHOW_GO_FULL_SCREEN);
                    } else {
                        shouldShowGoFsScreen = true;
                    }
                }
            });

            var isFs = self.device.requestFullScreen();
            var locked = self.device.lockOrientation('portrait-primary');

            if (!locked && self.device.isMobile) {

                self.events.subscribe(Event.SCREEN_ORIENTATION, function (orientation) {
                    if (orientation === Orientation.PORTRAIT) {
                        rotateScreen = false;
                        self.events.fire(Event.REMOVE_ROTATE_DEVICE);
                        if (!goFsScreen && !shouldShowGoFsScreen) {
                            if (self.storage.menuOn) {
                                self.events.fire(Event.RESUME_MENU);
                            } else if (self.storage.shouldShowMenu) {
                                self.storage.shouldShowMenu = false;
                                self.events.fire(Event.SHOW_MENU);
                            } else {
                                self.events.fire(Event.RESUME);
                            }
                        } else if (shouldShowGoFsScreen) {
                            shouldShowGoFsScreen = false;
                            goFsScreen = true;
                            self.events.fire(Event.SHOW_GO_FULL_SCREEN);
                        }
                    } else {
                        if (!goFsScreen) {
                            self.events.fireSync(Event.PAUSE);
                            rotateScreen = true;
                            self.events.fire(Event.SHOW_ROTATE_DEVICE);
                        } else {
                            shouldShowRotateScreen = true;
                        }
                    }
                });

                var currentOrientation = self.device.orientation;
                if (currentOrientation === Orientation.LANDSCAPE) {
                    var nextScene = self.events.subscribe(Event.RESUME, function () {
                        self.events.unsubscribe(nextScene);
                        self.timer.doLater(next, 6);
                    });
                    self.events.fireSync(Event.PAUSE);
                    self.events.fire(Event.SHOW_ROTATE_DEVICE);

                }
            }
            if (!isFs && self.device.isMobile) {
                // do black magic
                window.scrollTo(0, 1); //maybe scrolling with larger screen element on newer browsers
            }
            //if (!self.device.isMobile || locked || currentOrientation === Orientation.PORTRAIT) {
            //    self.timer.doLater(next, 6);
            //}
        }

        self.events.subscribe(Event.PAGE_VISIBILITY, function (hidden) {
            //if (hidden && self.storage.sfxOn) {
            //    self.sounds.muteAll();
            //} else if (!hidden && self.storage.sfxOn) {
            //    self.sounds.unmuteAll();
            //}
        });

        self.events.subscribe(Event.PAUSE, function () {
            self.stage.pauseAll();
            self.buttons.disableAll();
            self.timer.pause();
            self.loop.disableMove();
            self.loop.disableCollision();
        });

        self.events.subscribe(Event.RESUME, function () {
            self.stage.playAll();
            self.buttons.enableAll();
            self.timer.resume();
            self.loop.enableMove();
            self.loop.enableCollision();
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
})(drawClouds, drawIcons, Width, Height, Font, drawButtons, window.document, installOneTimeTap, Event, window,
    Orientation);