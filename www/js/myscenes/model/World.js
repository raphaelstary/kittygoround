var World = (function (CatGenerator) {
    "use strict";

    function World(carouselStore, carouselView, topObstacles, bottomObstacles) {
        this.carouselStore = carouselStore;
        this.carouselView = carouselView;

        this.topObstacles = topObstacles;
        this.bottomObstacles = bottomObstacles;
    }

    World.prototype.addTwoCats = function () {
        var newCats = CatGenerator.getTwoCats(this.carouselStore.getAllColors());
        var newDrawables = this.carouselView.addTwo(newCats[0], this.carouselStore.getNodesFromTopClockwise(),
            newCats[1], this.carouselStore.getNodesFromBottomClockwise());
        this.carouselStore.addTwo(newDrawables.top, newCats[0], newDrawables.bottom, newCats[1]);
    };

    World.prototype.turnCarouselLeft = function (callback) {
        this.carouselView.turnLeft(this.carouselStore.getNodesFromTopAntiClockwise(),
            this.carouselStore.getNodesFromBottomAntiClockwise(), callback);
        this.carouselStore.turnLeft();
    };

    World.prototype.turnCarouselRight = function (callback) {
        this.carouselView.turnRight(this.carouselStore.getNodesFromTopClockwise(),
            this.carouselStore.getNodesFromBottomClockwise(), callback);
        this.carouselStore.turnRight();
    };

    World.prototype.checkCollisions = function () {

    };

    return World;
})(CatGenerator);