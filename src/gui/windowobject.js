define(function() {

    var WindowObject = Class({
        constructor: function(gameManager) {
            this.gameManager = gameManager;
            this.children = [];
            this.container = new PIXI.Container();

            this.windowObject = true;
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
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].update();
            }
        },
        setPosition: function(x, y) {
            this.container.x = x;
            this.container.y = y;
        }
    });

    return WindowObject;

});
