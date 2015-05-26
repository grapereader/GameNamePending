define(function() {

    var KEY_CODES = {
        "Digit0": 0x30,
        "Digit1": 0x31,
        "Digit2": 0x32,
        "Digit3": 0x33,
        "Digit4": 0x34,
        "Digit5": 0x35,
        "Digit6": 0x36,
        "Digit7": 0x37,
        "Digit8": 0x38,
        "Digit9": 0x39,
        "KeyA": 0x41,
        "KeyB": 0x42,
        "KeyC": 0x43,
        "KeyD": 0x44,
        "KeyE": 0x45,
        "KeyF": 0x46,
        "KeyG": 0x47,
        "KeyH": 0x48,
        "KeyI": 0x49,
        "KeyJ": 0x4A,
        "KeyK": 0x4B,
        "KeyL": 0x4C,
        "KeyM": 0x4D,
        "KeyN": 0x4E,
        "KeyO": 0x4F,
        "KeyP": 0x50,
        "KeyQ": 0x51,
        "KeyR": 0x52,
        "KeyS": 0x53,
        "KeyT": 0x54,
        "KeyU": 0x55,
        "KeyV": 0x56,
        "KeyW": 0x57,
        "KeyX": 0x58,
        "KeyY": 0x59,
        "KeyZ": 0x5A
    };

    var KeyboardInput = Class({
        /**
            Attach keyboard listener to specified element
        */
        constructor: function(element) {
            this.keys = [];

            var self = this;

            //This needs to be expanded to use the 'key' property when available
            //since "apparently" keyCode is deprecated. Unfortunately, we still need to
            //be able to fall back to keyCode since the key property is pretty
            //young and not supported everywhere...
            //This will work for now though.

            element.addEventListener("keydown", function(e) {
                var k = self.getCode(e);
                if (self.keys.indexOf(k) == -1) self.keys.push(k);
            });

            element.addEventListener("keyup", function(e) {
                var k = self.getCode(e);
                self.keys.splice(self.keys.indexOf(k), 1);
            });
        },
        getCode: function(keyEvent) {
            if (keyEvent.code === undefined || !(keyEvent.code in KEY_CODES)) {
                return keyEvent.keyCode;
            } else {
                return KEY_CODES[keyEvent.code];
            }
        },
        isKeyDown: function(key) {
            if (key in KEY_CODES) return this.keys.indexOf(KEY_CODES[key]) != -1;
            return this.keys.indexOf(key) != -1;
        }
    });

    return KeyboardInput;

});
