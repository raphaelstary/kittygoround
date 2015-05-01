var drawIcons = (function () {
    "use strict";

    function drawIcons(stage) {
        var drawables = [];

        var goFS = stage.drawFresh(Width.get(32, 2), Height.get(48, 2), 'go_fullscreen');
        drawables.push(goFS);
        var soundOn = stage.drawFresh(Width.get(32, 2), Height.get(48, 5), 'unmute');
        drawables.push(soundOn);
        var info = stage.drawTextWithInput(Width.get(32, 2), Height.get(48, 8), 'i', Font._30, 'GameFont',
            '#283032').drawable;
        drawables.push(info);

        return drawables;
    }

    return drawIcons;
})();