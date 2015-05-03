var World = (function (CatGenerator) {
    "use strict";

    function World(carouselStore, carouselView) {
        this.carouselStore = carouselStore;
        this.carouselView = carouselView;
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

    return World;
})(CatGenerator);