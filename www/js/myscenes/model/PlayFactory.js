var PlayFactory = (function (World, Carousel, CarouselView, PlayerController) {
    "use strict";
    return {
        createWorld: function (stage) {
            return new World(new Carousel(), new CarouselView(stage));
        },
        createPlayerController: function (world) {
            return new PlayerController(world);
        }
    }
})(World, Carousel, CarouselView, PlayerController);