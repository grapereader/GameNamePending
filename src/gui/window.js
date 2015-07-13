define(["util/helpers", "gui/windowobject", "gui/box"], function(Helpers, WindowObject, Box) {

    var Window = Class(WindowObject, {
        constructor: function(gameManager, width, height, titleString) {
            Window.$super.call(this, gameManager);

            this.content = new WindowObject(gameManager);
            var title = new WindowObject(gameManager);

            //var titleGraphics = new PIXI.Graphics();
            //title.addChild(titleGraphics);

            var titleText = new PIXI.Text(titleString, {
                font: Helpers.getFont(16)
            });

            var padY = 6;

            titleText.x = 6;
            titleText.y = padY / 2;

            title.addChild(new Box(gameManager, 0, 0, width, titleText.height + padY));
            title.addChild(titleText);
            /*
            titleGraphics.beginFill(0xFFFFFF, 0.8);
            titleGraphics.drawRect(0, 0, width, titleText.height);
            titleGraphics.endFill();
*/
            Window.$superp.addChild.call(this, this.content);
            Window.$superp.addChild.call(this, title);

            this.content.container.y = title.container.height;

            var self = this;
            var down = false;
            var offsetX = 0;
            var offsetY = 0;
            title.container.interactive = true;
            title.container.on("mousedown", function(e) {
                if (self.windowSystem !== undefined) {
                    self.windowSystem.requestFocus(self);
                }
                down = true;
                offsetX = e.data.global.x - self.container.x;
                offsetY = e.data.global.y - self.container.y;
            });
            title.container.on("mouseup", function() {
                down = false;
            });

            title.container.on("mousemove", function(e) {
                if (down) {
                    self.container.x = e.data.global.x - offsetX;
                    self.container.y = e.data.global.y - offsetY;
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
