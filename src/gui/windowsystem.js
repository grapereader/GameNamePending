define(["gui/windowobject"], function(WindowObject) {

    var WindowSystem = Class(WindowObject, {
        constructor: function(eventElement) {
            WindowSystem.$super.call(this);
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
