var installPlayerKeyBoard = (function (Event, Key) {
    "use strict";

    function installPlayerKeyBoard(events, playerController) {
        var leftKeyPressed = false;
        var rightKeyPressed = false;

        return events.subscribe(Event.KEY_BOARD, function (keyBoard) {
            if (keyBoard[Key.LEFT] && !leftKeyPressed) {
                leftKeyPressed = true;
                playerController.turnLeft();
            } else if (!keyBoard[Key.LEFT] && leftKeyPressed) {
                leftKeyPressed = false;
            }

            if (keyBoard[Key.RIGHT] && !rightKeyPressed) {
                rightKeyPressed = true;
                playerController.turnRight();
            } else if (!keyBoard[Key.RIGHT] && rightKeyPressed) {
                rightKeyPressed = false;
            }
        });
    }

    return installPlayerKeyBoard;
})(Event, Key);