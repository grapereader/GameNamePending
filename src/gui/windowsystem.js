define(["gui/windowobject"], function(WindowObject) {

    var WindowSystem = Class(WindowObject, {
        constructor: function(gameManager, eventElement) {
            WindowSystem.$super.call(this, gameManager);
            var self = this;
            eventElement.addEventListener("contextmenu", function(e) {
                e.preventDefault();
                return false;
            });
        },
        addChild: function(child) {
            child.windowSystem = this;
            WindowSystem.$superp.addChild.call(this, child);
        },
        requestFocus(window) {
            this.container.removeChild(window.container);
            this.container.addChild(window.container);
        }
    });

    return WindowSystem;

})
