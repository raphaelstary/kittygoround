var installPlayerPointer = (function (Event) {
    "use strict";

    function installPlayerPointer(events, device, playerController) {
        return events.subscribe(Event.POINTER, function (pointer) {
            if (pointer.type == 'down') {
                if (pointer.x < device.width / 2) {
                    playerController.turnLeft();
                } else {
                    playerController.turnRight();
                }
            }
        });
    }

    return installPlayerPointer;
})(Event);