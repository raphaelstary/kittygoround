var PlayerController = (function () {
    "use strict";

    function PlayerController(world, leftDrawable, rightDrawable) {
        this.world = world;

        this.leftDrawable = leftDrawable;
        this.rightDrawable = rightDrawable;
    }

    PlayerController.prototype.turnLeft = function () {
        this.world.turnCarouselLeft();
    };

    PlayerController.prototype.turnRight = function () {
        this.world.turnCarouselRight();
    };

    return PlayerController;
})();