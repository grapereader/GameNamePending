define(function() {

    //Using the control and alt keys seems to be a pretty bad idea
    //Browser doesn't like it too much, and preventDefault won't
    //disable the browser's default actions some of the time with these
    //keys
    var KEY_CODES = {
        "AltLeft": 0x12,
        "AltRight": 0x12,
        "ControlLeft": 0x11,
        "ControlRight": 0x11,
        "ShiftLeft": 0x10,
        "ShiftRight": 0x10
    };

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

            element.addEventListener("keydown", function(e) {
                var k = self.getCode(e);
                if (self.keys.indexOf(k) == -1) self.keys.push(k);
                if (!(k === 0x74 || k === 0x7B)) e.preventDefault(); //Allow F5 & F12 refresh, but nothing else
            });

            element.addEventListener("keyup", function(e) {
                var k = self.getCode(e);
                self.keys.splice(self.keys.indexOf(k), 1);
                if (!(k === 0x74 || k === 0x7B)) e.preventDefault(); //Allow F5 & F12, but nothing else
            });

            element.addEventListener("blur", function(e) {
                self.keys = [];
            });

            element.addEventListener("focusout", function(e) {
                self.keys = [];
            })
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
