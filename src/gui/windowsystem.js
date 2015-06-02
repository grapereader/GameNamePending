define(function() {

    var WindowSystem = Class({
        constructor: function(eventElement) {
            this.container = new PIXI.Container();

            this.windows = [];

            var self = this;
            eventElement.addEventListener("contextmenu", function(e) {
                e.preventDefault();
                return false;
            });
        },
        update: function() {
            for (var i = 0; i < this.windows.length; i++) {
                this.windows[i].update();
            }
        },
        addWindow: function(window) {
            window.windowSystem = this;
            this.windows.push(window);
            this.container.addChild(window.container);
        },
        requestFocus(window) {
            this.container.removeChild(window.container);
            this.container.addChild(window.container);
        }
    });

    return WindowSystem;

})
