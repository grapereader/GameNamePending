define(["gui/doubleclick"], function(DoubleClick) {

    var WindowObject = Class({
        constructor: function(gameManager) {
            this.gameManager = gameManager;
            this.children = [];
            this.container = new PIXI.Container();

            this.windowObject = true;

            this.doubleClickListeners = [];
        },
        addDoubleClickListener: function(handle) {
            this.container.interactive = true;
            this.doubleClickListeners.push(new DoubleClick(this.container, handle));
        },
        addChild: function(child) {
            if (child.windowObject) {
                this.children.push(child);
                this.container.addChild(child.container);
            } else {
                this.container.addChild(child);
            }
        },
        update: function() {
            var delta = this.gameManager.game.deltaTime;
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].update();
            }

            for (var i = 0; i < this.doubleClickListeners.length; i++) {
                this.doubleClickListeners[i].update(delta);
            }
        },
        setPosition: function(x, y) {
            this.container.x = x;
            this.container.y = y;
        }
    });

    return WindowObject;

});
