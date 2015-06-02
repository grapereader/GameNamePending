define(["util/helpers", "gui/windowobject"], function(Helpers, WindowObject) {

    var Window = Class(WindowObject, {
        constructor: function(gameManager, width, height, titleString) {
            Window.$super.call(this, gameManager);

            this.content = new WindowObject(gameManager);
            var title = new WindowObject(gameManager);

            var titleGraphics = new PIXI.Graphics();
            title.addChild(titleGraphics);

            var titleText = new PIXI.Text(titleString, {
                font: Helpers.getFont(16)
            });
            title.addChild(titleText);
            titleGraphics.beginFill(0xFFFFFF, 0.8);
            titleGraphics.drawRect(0, 0, width, titleText.height);
            titleGraphics.endFill();

            Window.$superp.addChild.call(this, this.content);
            Window.$superp.addChild.call(this, title);

            this.content.container.y = title.container.height;

            var self = this;
            var down = false;
            var offset = 0;
            title.container.interactive = true;
            title.container.on("mousedown", function(e) {
                if (self.windowSystem !== undefined) {
                    self.windowSystem.requestFocus(self);
                }
                down = true;
                offset = e.data.global.x - self.container.x;
            });
            title.container.on("mouseup", function() {
                down = false;
            });

            title.container.on("mousemove", function(e) {
                if (down) {
                    self.container.x = e.data.global.x - offset;
                    self.container.y = e.data.global.y - 2;
                }
            });
        },
        addChild: function(child) {
            this.content.addChild(child);
        },
        update: function() {
            Window.$superp.update.call(this);
        }
    });

    return Window;

});
