var LevelGenerator = (function (range) {
    "use strict";

    function LevelGenerator(obstaclesView, events) {
        this.obstaclesView = obstaclesView;
        this.events = events;

        this.levels = [
            {
                id: 0,
                maxObstacles: 100,

                timeToFirst: 180,
                percentageForTop: 50,

                kittySpeed: 180,
                pauseAfterKitty: 60,
                maxTimeToNextKitty: 90
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