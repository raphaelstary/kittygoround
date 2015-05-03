var PlayerController = (function () {
    "use strict";

    function PlayerController(world) {
        this.world = world;

        this.turning = false;
    }

    PlayerController.prototype.turnLeft = function () {
        if (this.turning)
            return;
        this.turning = true;

        var self = this;
        this.world.turnCarouselLeft(function () {
            self.turning = false;
        });
    };

    PlayerController.prototype.turnRight = function () {
        if (this.turning)
            return;
        this.turning = true;

        var self = this;
        this.world.turnCarouselRight(function () {
            self.turning = false;
        });
    };

    return PlayerController;
})();