define(function() {

    var KEY_CODES = {};

    for (var k = 0x30; k <= 0x39; k++) {
        KEY_CODES["Digit" + String.fromCharCode(k)] = k;
    }

    for (var k = 0x41; k <= 0x5A; k++) {
        KEY_CODES["Key" + String.fromCharCode(k)] = k;
    }

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
