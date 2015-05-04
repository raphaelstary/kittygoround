var installPlayerPointer = (function (Event, Width) {
    "use strict";

    function installPlayerPointer(events, device, playerController) {
        return events.subscribe(Event.POINTER, function (pointer) {
            if (pointer.type == 'down') {
                if (pointer.x < Width.HALF(device.width)) {
                    playerController.turnLeft();
                } else {
                    playerController.turnRight();
                }
            }
        });
    }

    return installPlayerPointer;
})(Event, Width);