define(["view/viewobject", "math/vector", "lighting/filtermanager"], function(ViewObject, Vector, FilterManager) {

    var LightSystem = Class({
        constructor: function(gameManager) {
            this.gameManager = gameManager;

            this.container = new PIXI.Container();

            this.graphics = new PIXI.Graphics();
            this.container.addChild(this.graphics);

            this.lights = [];
        },
        update: function() {
            this.graphics.clear();

            for (var i = 0; i < this.lights.length; i++) {
                this.lights[i].update();
            }

            for (var i = 0; i < this.lights.length; i++) {
                //this.debug(this.lights[i].polygon);
            }
        },
        addLight: function(light) {
            this.lights.push(light);
            FilterManager.initializeFilters();
        },
        debug: function(polygon, offs) {
            var alt = 0;
            for (var p = 0; p < polygon.length - 1; p++) {
                var poly = polygon[p];
                var npoly = polygon[p + 1];

                alt = alt % 3;
                switch(alt) {
                    case 0:
                        var width = 3;
                        var colour = 0xFFFFFF;
                        break;
                    case 1:
                        var width = 4;
                        var colour = 0xFF0000;
                        break;
                    case 2:
                        var width = 5;
                        var colour = 0x00FF00;
                        break;
                }

                if (offs === undefined) offs = 0;

                this.graphics.lineStyle(1, colour, 1);
                this.graphics.moveTo(poly.sx + offs, poly.sy + offs);
                this.graphics.lineTo(npoly.sx + offs, npoly.sy + offs);
                this.graphics.drawRect(npoly.sx - (width / 2) + offs, npoly.sy - (width / 2) + offs, width, width);
                alt++;
            }
        }
    });

    return LightSystem;

});
