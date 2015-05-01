var installMyScenes = (function (SceneManager) {
    "use strict";

    var BLACK = '#283032';
    var WHITE = '#fff';
    var FONT = 'GameFont';

    function installMyScenes(sceneServices) {

        var tap = new TapManager();
        sceneServices.events.subscribe(Event.POINTER, tap.inputChanged.bind(tap));

        sceneServices.buttons = new ButtonFactory(sceneServices.stage, tap, sceneServices.timer, FONT, function () {
            //sceneServices.sounds.play(CLICK);
        }, WHITE, BLACK, Font._30, 3, WHITE, WHITE, Font._40, 2);

        var sceneManager = new SceneManager();
        var startScreen = new StartScreen(sceneServices);
        var playScreen = new PlayScreen(sceneServices);
        sceneManager.add(startScreen.show.bind(startScreen), true);
        sceneManager.add(playScreen.show.bind(playScreen));

        return sceneManager;
    }

    return installMyScenes;
})(SceneManager);