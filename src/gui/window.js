define(["util/helpers"], function(Helpers) {

    var Window = Class({
        constructor: function(width, height, title) {
            this.rootContainer = new PIXI.Container();
            this.container = new PIXI.Container();

            var titleContainer = new PIXI.Container();
            var titleGraphics = new PIXI.Graphics();
            titleContainer.addChild(titleGraphics);

            var titleText = new PIXI.Text(title, {
                font: Helpers.getFont(16)
            });
            titleContainer.addChild(titleText);
            titleGraphics.beginFill(0xFFFFFF, 0.8);
            titleGraphics.drawRect(0, 0, width, titleText.height);
            titleGraphics.endFill();

            this.rootContainer.addChild(this.container);
            this.rootContainer.addChild(titleContainer);

            this.container.y = titleContainer.height;

            var self = this;
            var down = false;
            var offset = 0;
            titleContainer.interactive = true;
            titleContainer.on("mousedown", function(e) {
                down = true;
                offset = e.data.global.x - self.rootContainer.x;
            });
            titleContainer.on("mouseup", function() {
                down = false;
            });

            titleContainer.on("mousemove", function(e) {
                if (down) {
                    self.rootContainer.x = e.data.global.x - offset;
                    self.rootContainer.y = e.data.global.y - 2;
                }
            });
        }
    });

    return Window;

});