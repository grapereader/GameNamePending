define(["save/storage"], function(Storage) {

    /**
        Key mapping class allows configuring keys to actions
    */
    var KeyMap = Class({
        constructor: function(keyboard) {
            this.keyboard = keyboard;

            if (Storage.hasObject("keymap")) {
                this.map = Storage.getObject("keymap");
            } else {
                this.map = {
                    "move": {
                        "left": "KeyA",
                        "right": "KeyD",
                        "up": "KeyW",
                        "down": "KeyS"
                    },
                    "attack": "KeyJ"
                }
            }
        },
        isKeyDown: function(key) {
            var parts = key.split(".");
            var entry = this.map;
            for (var i = 0; i < parts.length; i++) {
                entry = entry[parts[i]];
            }
            return this.keyboard.isKeyDown(entry);
        }
    });

    return KeyMap;

});
