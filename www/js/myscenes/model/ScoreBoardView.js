var ScoreBoardView = (function (Width, Height, Font, Transition) {
    "use strict";

    function ScoreBoardView(stage) {
        this.stage = stage;
        this.points = this.stage.drawText(Width.get(32, 28), Height.get(48, 3), '0', Font._15, 'GameFont', '#fc6da4');
    }

    ScoreBoardView.prototype.changeScore = function (score) {
        this.points.data.msg = score.toString();
        this.stage.animateScalePattern(this.points, [
            {
                value: 0.5,
                duration: 6,
                easing: Transition.LINEAR
            }, {
                value: 1,
                duration: 30,
                easing: Transition.EASE_OUT_ELASTIC
            }
        ]);
    };

    return ScoreBoardView;
})(Width, Height, Font, Transition);