var Carousel = (function () {
    "use strict";

    function Carousel() {
        this.count = 0;
    }

    Carousel.prototype.turnLeft = function () {
        if (!this.top || !this.bottom)
            return;
        this.top = this.top.clockwise;
        this.bottom = this.bottom.clockwise;
    };

    Carousel.prototype.turnRight = function () {
        if (!this.top || !this.bottom)
            return;
        this.top = this.top.antiClockwise;
        this.bottom = this.bottom.antiClockwise;
    };

    Carousel.prototype.addTwo = function (one, oneColor, two, twoColor) {
        if (this.count >= 8)
            return;

        if (this.count == 0) {
            this.__init(one, oneColor, two, twoColor);

        } else {
            this.__add('top', one, oneColor);
            this.__add('bottom', two, twoColor);
        }
        this.count += 2;
    };

    Carousel.prototype.__init = function (top, topColor, bottom, bottomColor) {
        this.top = {
            drawable: top,
            color: topColor,
            antiClockwise: null,
            clockwise: null
        };
        this.bottom = {
            drawable: bottom,
            color: bottomColor,
            antiClockwise: this.top,
            clockwise: this.top
        };
        this.top.antiClockwise = this.bottom;
        this.top.clockwise = this.bottom;
    };

    Carousel.prototype.getTopColor = function () {
        return this.top.color;
    };

    Carousel.prototype.getBottomColor = function () {
        return this.bottom.color;
    };

    Carousel.prototype.getTopDrawable = function () {
        return this.top.drawable;
    };

    Carousel.prototype.getBottomDrawable = function () {
        return this.bottom.drawable;
    };

    Carousel.prototype.getNodesFromTopClockwise = function () {
        return this.__getNodes(this.top, 'drawable', 'clockwise');
    };

    Carousel.prototype.getNodesFromBottomClockwise = function () {
        return this.__getNodes(this.bottom, 'drawable', 'clockwise');
    };

    Carousel.prototype.getNodesFromTopAntiClockwise = function () {
        return this.__getNodes(this.top, 'drawable', 'antiClockwise');
    };

    Carousel.prototype.getNodesFromBottomAntiClockwise = function () {
        return this.__getNodes(this.bottom, 'drawable', 'antiClockwise');
    };

    Carousel.prototype.__getNodes = function (anchor, keyToExtract, direction) {
        var nodes = [];
        var tempPointer = anchor;
        for (var i = 0; i < this.count / 2; i++) {
            nodes.push(tempPointer[keyToExtract]);
            tempPointer = tempPointer[direction];
        }
        return nodes;
    };

    Carousel.prototype.getAllColors = function () {
        return this.__getNodes(this.top, 'color', 'clockwise').concat(this.__getNodes(this.bottom, 'color',
            'clockwise'));
    };

    Carousel.prototype.__add = function (anchorKey, drawableToAdd, colorToAdd) {
        var existingNode = this[anchorKey];
        this[anchorKey] = {
            drawable: drawableToAdd,
            color: colorToAdd,
            antiClockwise: existingNode.antiClockwise,
            clockwise: existingNode
        };
        existingNode.antiClockwise.clockwise = this[anchorKey];
        existingNode.antiClockwise = this[anchorKey];
    };

    return Carousel;
})();