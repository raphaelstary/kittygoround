var PlayFactory = (function (World, Carousel, CarouselView, PlayerController, LevelGenerator, ObstaclesView,
    ScoreBoardView) {

    "use strict";
    return {
        createWorld: function (stage, events, gameOver) {
            var colors = [];
            var topObstacles = {};
            var bottomObstacles = {};

            var levels = new LevelGenerator(new ObstaclesView(stage, colors, topObstacles, bottomObstacles), events);

            return new World(stage, new Carousel(), new CarouselView(stage), levels, new ScoreBoardView(stage), colors,
                topObstacles, bottomObstacles, gameOver);
        },
        createPlayerController: function (world) {
            return new PlayerController(world);
        }
    }
})(World, Carousel, CarouselView, PlayerController, LevelGenerator, ObstaclesView, ScoreBoardView);