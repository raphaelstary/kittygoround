var ObstaclesView = (function (range, calcScreenConst, Width, Height, Transition) {
    "use strict";

    function ObstaclesView(stage, colors, topObstacles, bottomObstacles) {
        this.stage = stage;
        this.colors = colors;
        this.topObstacles = topObstacles;
        this.bottomObstacles = bottomObstacles;
    }

    ObstaclesView.prototype.randomKittyFromTop = function (speed) {
        var self = this;

        function getStartY(catHeightHalfFn) {
            return function () {
                return -catHeightHalfFn();
            }
        }

        var kitty = this.__randomKitty(speed, getStartY);
        this.topObstacles[kitty.id] = kitty;
    };

    ObstaclesView.prototype.randomKittyFromBottom = function (speed) {
        var self = this;

        function getStartY(catHeightHalfFn) {
            return function (height) {
                return Height.FULL(height) + catHeightHalfFn();
            }
        }

        var kitty = this.__randomKitty(speed, getStartY);
        this.bottomObstacles[kitty.id] = kitty;
    };

    ObstaclesView.prototype.__randomKitty = function (speed, startYFn) {
        var catId = range(0, this.colors.length - 1);
        var catColor = this.colors[catId];
        var self = this;

        function catHeightHalfFn() {
            return calcScreenConst(self.stage.getImageHeight(catColor), 2);
        }

        var kitty = this.stage.moveFresh(Width.HALF, startYFn(catHeightHalfFn), catColor, Width.HALF, Height.HALF,
            speed, Transition.LINEAR, false, function () {
                self.stage.remove(kitty.drawable);
            }, undefined, undefined, undefined, undefined, 0.8);

        this.stage.animateScalePattern(kitty.drawable, [
            {
                value: 1,
                duration: 15,
                easing: Transition.LINEAR
            }, {
                value: 0.8,
                duration: 15,
                easing: Transition.LINEAR
            }
        ], true);

        return kitty.drawable;
    };

    return ObstaclesView;
})(range, calcScreenConst, Width, Height, Transition);