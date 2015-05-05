var LevelGenerator = (function (range) {
    "use strict";

    function LevelGenerator(obstaclesView, events) {
        this.obstaclesView = obstaclesView;
        this.events = events;

        this.levels = [
            {
                id: 0,
                maxObstacles: 10,

                timeToFirst: 60,
                percentageForTop: 50,

                kittySpeed: 60 + 15,
                pauseAfterKitty: 40,
                maxTimeToNextKitty: 60
            }, {
                id: 1,
                maxObstacles: 10,

                timeToFirst: 120,
                percentageForTop: 50,

                kittySpeed: 60 + 15,
                pauseAfterKitty: 90,
                maxTimeToNextKitty: 120
            }, {
                id: 2,
                maxObstacles: 10,

                timeToFirst: 120,
                percentageForTop: 50,

                kittySpeed: 90 + 15,
                pauseAfterKitty: 120,
                maxTimeToNextKitty: 150
            }, {
                id: 3,
                maxObstacles: 10000,

                timeToFirst: 120,
                percentageForTop: 50,

                kittySpeed: 120 + 15,
                pauseAfterKitty: 150,
                maxTimeToNextKitty: 180
            }
        ];

        this.initLevel(this.levels.shift());
    }

    LevelGenerator.prototype.initLevel = function (level) {
        this.level = level;

        this.obstaclesCount = 0;
        this.counter = 0;
        this.nextCount = this.level.timeToFirst;
    };

    LevelGenerator.prototype.update = function () {
        if (++this.counter <= this.nextCount)
            return;
        this.counter = 0;

        if (range(1, 100) <= this.level.percentageForTop) {
            this.obstaclesView.randomKittyFromTop(this.level.kittySpeed);
        } else {
            this.obstaclesView.randomKittyFromBottom(this.level.kittySpeed);
        }
        this.obstaclesCount++;
        this.nextCount = this.level.pauseAfterKitty + range(0, this.level.maxTimeToNextKitty);

        if (this.obstaclesCount >= this.level.maxObstacles)
            this.initLevel(this.levels.shift());
    };

    return LevelGenerator;
})(range);