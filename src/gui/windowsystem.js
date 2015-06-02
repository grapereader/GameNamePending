define(function() {

    var WindowSystem = Class({
        constructor: function() {
            this.container = new PIXI.Container();

            this.windows = [];
        },
        update: function() {
            for (var i = 0; i < this.windows.length; i++) {
                this.windows[i].update();
            }
        },
        addWindow: function(window) {
            window.windowSystem = this;
            this.windows.push(window);
            this.container.addChild(window.rootContainer);
        },
        requestFocus(window) {
            this.container.removeChild(window.rootContainer);
            this.container.addChild(window.rootContainer);
        }
    });

    return WindowSystem;

})
