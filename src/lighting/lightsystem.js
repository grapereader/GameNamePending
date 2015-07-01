define(["view/viewobject", "math/vector", "lighting/filtermanager"], function(ViewObject, Vector, FilterManager) {

    var LightSystem = Class({
        constructor: function(gameManager) {
            //LightSystem.$super.call(this, gameManager.scene);
            this.gameManager = gameManager;

            this.container = new PIXI.Container();

            this.graphics = new PIXI.Graphics();
            this.container.addChild(this.graphics);

            this.lights = [];
        },
        update: function() {
            //LightSystem.$superp.update.call(this);

            for (var i = 0; i < this.lights.length; i++) {
                this.lights[i].update();
            }

            this.debug();
        },
        addLight: function(light) {
            this.lights.push(light);
            FilterManager.initializeFilters();
        },
        debug: function() {
            this.graphics.clear();
            var alt = false;
            for (var i = 0; i < this.lights.length; i++) {
                //console.log(this.lights[i].polygon);
                for (var p = 0; p < this.lights[i].polygon.length; p++) {
                    var poly = this.lights[i].polygon[p];
                    this.graphics.lineStyle(1, 0xFFFFFF, 1);
                    this.graphics.moveTo(poly.a.sx, poly.a.sy);
                    this.graphics.lineTo(poly.b.sx, poly.b.sy);

                    this.graphics.lineStyle(1, alt ? 0xFFFFFF : 0xFF0000, 1);
                    alt = ! alt;
                    if (alt) {
                        this.graphics.drawRect(poly.b.sx - 1, poly.b.sy - 1, 3, 3);
                    } else {
                        this.graphics.drawRect(poly.b.sx - 2, poly.b.sy - 2, 4, 4);
                    }
                }
            }
        }
    });

    return LightSystem;

});
