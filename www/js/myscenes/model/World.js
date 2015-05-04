var World = (function (CatGenerator, Object) {
    "use strict";

    function World(stage, carouselStore, carouselView, levels, colors, topObstacles, bottomObstacles, gameOver) {
        this.stage = stage;
        this.carouselStore = carouselStore;
        this.carouselView = carouselView;
        this.levels = levels;

        this.colors = colors;
        this.topObstacles = topObstacles;
        this.bottomObstacles = bottomObstacles;

        this.gameOver = gameOver;
    }

    World.prototype.addTwoCats = function () {
        var newCats = CatGenerator.getTwoCats(this.carouselStore.getAllColors());
        var self = this;
        newCats.forEach(function (cat) {
            self.colors.push(cat);
        });
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
        function isHit(cat, obstacle) {
            return cat.getEndX() > obstacle.getCornerX() && cat.getCornerX() < obstacle.getEndX() &&
                cat.getEndY() > obstacle.getCornerY() && cat.getCornerY() < obstacle.getEndY()
        }

        Object.keys(this.topObstacles).forEach(function (key) {
            var obstacleWrapper = this.topObstacles[key];
            var cat = this.carouselStore.getTopDrawable();
            if (isHit(cat, obstacleWrapper.drawable)) {

                if (obstacleWrapper.color == this.carouselStore.getTopColor()) {
                    console.log("good collision");
                } else {
                    console.log("bad collision");
                }
                this.stage.remove(obstacleWrapper.drawable);
                delete this.topObstacles[key];
            }
        }, this);

        Object.keys(this.bottomObstacles).forEach(function (key) {
            var obstacleWrapper = this.bottomObstacles[key];
            var cat = this.carouselStore.getBottomDrawable();
            if (isHit(cat, obstacleWrapper.drawable)) {

                if (obstacleWrapper.color == this.carouselStore.getBottomColor()) {
                    console.log("good collision");
                } else {
                    console.log("bad collision");
                }
                this.stage.remove(obstacleWrapper.drawable);
                delete this.bottomObstacles[key];
            }
        }, this);
    };

    World.prototype.update = function () {
        this.levels.update();
    };

    return World;
})(CatGenerator, Object);