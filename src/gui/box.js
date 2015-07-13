define(["gui/windowobject"], function(WindowObject) {
    
    var Box = Class(WindowObject, {
        constructor: function(gameManager, x, y, width, height) {
            Box.$super.call(this, gameManager);

            var g = new PIXI.Graphics();
            g.lineStyle(2, 0x0, 1);

            g.moveTo(5, 2);
            g.lineTo(width - 4, 2);

            g.moveTo(width - 4, 4);
            g.lineTo(width - 2, 4);

            g.moveTo(width - 1, 5);
            g.lineTo(width - 1, height - 4);

            g.moveTo(width - 4, height - 3);
            g.lineTo(width - 2, height - 3);

            g.moveTo(width - 4, height - 1);
            g.lineTo(5, height - 1);

            g.moveTo(3, height - 3);
            g.lineTo(5, height - 3);

            g.moveTo(2, height - 4);
            g.lineTo(2, 5);

            g.moveTo(3, 4);
            g.lineTo(5, 4);

            g.lineStyle(2, 0xF2C960, 1);

            g.moveTo(5, 4);
            g.lineTo(width - 4, 4);

            g.moveTo(width - 3, 5);
            g.lineTo(width - 3, height - 4);

            g.moveTo(width - 4, height - 3);
            g.lineTo(5, height - 3);

            g.moveTo(4, height - 4);
            g.lineTo(4, 5);

            g.lineStyle(0, 0, 0);
            g.beginFill(0x8E7348, 1);
            g.drawRect(5, 5, width - 9, height - 9);
            g.endFill();


            this.addChild(g);

            this.setPosition(x, y);
        }
    });

    return Box;
});
