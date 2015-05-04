var PlayFactory = (function (World, Carousel, CarouselView, PlayerController, LevelGenerator) {
    "use strict";
    return {
        createWorld: function (stage, topObstacles, bottomObstacles) {
            return new World(new Carousel(), new CarouselView(stage), topObstacles, bottomObstacles);
        },
        createPlayerController: function (world) {
            return new PlayerController(world);
        },
        createLevels: function (stage, topObstacles, bottomObstacles) {
            return new LevelGenerator(stage, topObstacles, bottomObstacles);
        }
    }
})(World, Carousel, CarouselView, PlayerController, LevelGenerator);