var World = (function (CatGenerator, Object, iterateEntries) {
    "use strict";

    function World(stage, carouselStore, carouselView, levels, scoreBoardView, colors, topObstacles, bottomObstacles,
        gameOver) {
        this.stage = stage;
        this.carouselStore = carouselStore;
        this.carouselView = carouselView;
        this.levels = levels;
        this.scoreBoardView = scoreBoardView;

        this.colors = colors;
        this.topObstacles = topObstacles;
        this.bottomObstacles = bottomObstacles;

        this.gameOver = gameOver;

        this.points = 0;
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

        function iterateOverObstacles(obstacles, cat, catColor) {
            return function (key) {
                var obstacleWrapper = obstacles[key];
                if (isHit(cat, obstacleWrapper.drawable)) {

                    if (obstacleWrapper.color == catColor) {
                        this.increaseScore();
                    } else {
                        this.gameOver(this.points);
                    }
                    this.stage.remove(obstacleWrapper.drawable);
                    delete obstacles[key];
                }
            };
        }

        Object.keys(this.topObstacles).forEach(iterateOverObstacles(this.topObstacles,
            this.carouselStore.getTopDrawable(), this.carouselStore.getTopColor()), this);

        Object.keys(this.bottomObstacles).forEach(iterateOverObstacles(this.bottomObstacles,
            this.carouselStore.getBottomDrawable(), this.carouselStore.getBottomColor()), this);
    };

    World.prototype.increaseScore = function () {
        this.scoreBoardView.changeScore(++this.points);
        if (this.points % 10 == 0) {
            this.addTwoCats();
        }
    };

    World.prototype.update = function () {
        this.levels.update();
    };

    World.prototype.terminate = function () {
        this.stage.remove(this.scoreBoardView.points);
        iterateEntries(this.topObstacles, function (obstacleWrapper) {
            this.stage.remove(obstacleWrapper.drawable);
        }, this);
        iterateEntries(this.bottomObstacles, function (obstacleWrapper) {
            this.stage.remove(obstacleWrapper.drawable);
        }, this);
        this.carouselStore.getNodesFromTopClockwise().forEach(this.stage.remove.bind(this.stage));
        this.carouselStore.getNodesFromBottomClockwise().forEach(this.stage.remove.bind(this.stage));
    };

    return World;
})(CatGenerator, Object, iterateEntries);