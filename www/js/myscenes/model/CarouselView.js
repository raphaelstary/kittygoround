var CarouselView = (function (Width, Height, Math, Transition, add, subtract) {
    "use strict";

    function CarouselView(stage) {
        this.stage = stage;
    }

    var radiusFn = Font._10;
    var speed = 15;

    CarouselView.prototype.addTwo = function (one, topList, two, bottomList) {
        function getHeight(height, width) {
            return radiusFn(width, height);
        }

        var topCat = this.stage.drawFresh(Width.HALF, subtract(Height.HALF, getHeight), one, 4);
        topList.forEach(this.stage.remove.bind(this.stage));
        this.__turn(topList, -Math.PI / 2, Math.PI / 2, undefined, topList.length + 1);

        var bottomCat = this.stage.drawFresh(Width.HALF, add(Height.HALF, getHeight), two, 4);
        bottomList.forEach(this.stage.remove.bind(this.stage));
        this.__turn(bottomList, Math.PI / 2, Math.PI / 2 * 3, undefined, bottomList.length + 1);

        return {
            top: topCat,
            bottom: bottomCat
        }
    };

    CarouselView.prototype.turnLeft = function (topList, bottomList, callback) {
        var callbacks = 0;

        callbacks += this.__turn(topList, Math.PI / 2 * 3, Math.PI / 2, endTurn);
        callbacks += this.__turn(bottomList, Math.PI / 2, -Math.PI / 2, endTurn);

        function endTurn() {
            callbacks--;
            if (callbacks <= 0) {
                callback();
            }
        }
    };

    CarouselView.prototype.turnRight = function (topList, bottomList, callback) {
        var callbacks = 0;

        callbacks += this.__turn(topList, -Math.PI / 2, Math.PI / 2, endTurn);
        callbacks += this.__turn(bottomList, Math.PI / 2, Math.PI / 2 * 3, endTurn);

        function endTurn() {
            callbacks--;
            if (callbacks <= 0) {
                callback();
            }
        }
    };

    CarouselView.prototype.__turn = function (nodes, startAngle, endAngle, callback, customCount) {
        var callbackCount = 0;
        var count = customCount || nodes.length;
        var arc = getLength(startAngle, endAngle);
        var arcPart = arc / count;

        for (var i = 0; i < nodes.length; i++) {
            this.stage.moveCircular(nodes[i], Width.HALF, Height.HALF, radiusFn, startAngle + arcPart * i,
                startAngle + arcPart * (i + 1), speed, Transition.EASE_OUT_EXPO, false, callback);
            callbackCount++;
        }

        return callbackCount;
    };

    function getLength(startValue, endValue) {
        var length = Math.abs(startValue - endValue);
        if (endValue < startValue) {
            length = -length;
        }
        return length;
    }

    return CarouselView;
})(Width, Height, Math, Transition, add, subtract);