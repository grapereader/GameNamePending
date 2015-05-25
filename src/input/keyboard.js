define(function() {

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
                if (self.keys.indexOf(e.keyCode) == -1) self.keys.push(e.keyCode);
            });

            element.addEventListener("keyup", function(e) {
                self.keys.splice(self.keys.indexOf(e.keyCode), 1);
            });
        },
        isKeyDown: function(keyCode) {
            return this.keys.indexOf(keyCode) != -1;
        }
    });

    return KeyboardInput;

});
