define(["view/view"], function(View) {
    /**
        Scene class which allows arbitrary numbers of layers, and
        supports moving objects from layer to layer, much like a z-index.

        Renders from 0-n layers, with the nth layer on top.
    */
    var Scene = Class({
        constructor: function(game, layers) {
            this.game = game;

            this.layers = [];
            for (var i = 0; i < layers; i++) {
                this.layers.push([]);
            }

            this.view = new View(game, 0, 0, game.gameWidth, game.gameHeight);

            console.log("Created new scene with " + layers + " layers");
        },
        /**
            Move the object to the given layer.
            If the object is not yet in a layer, sets the object's layer.
        */
        setLayer: function(object, toLayer) {
            this.removeObject(object);
            object.layer = toLayer;
            this.layers[toLayer].push(object);

        },
        /**
            Function that does the same thing to communicate intent.
            Should be preferred over setLayer when adding an object.
        */
        addObject: function(object, layer) {
            this.setLayer(object, layer);
        },
        /**
            Remove the object from the scene, regardless of the layer it is in.
        */
        removeObject: function(object) {
            if (object.layer !== undefined) {
                var layer = this.layers[object.layer];
                layer.splice(layer.indexOf(object), 1);
            }
        },
        /**
            Render all layers with the renderer
        */
        render: function(renderer) {
            var len = this.layers.length;
            for (var i = 0; i < len; i++) {
                var len2 = this.layers[i].length;
                for (var j = 0; j < len2; j++) {
                    renderer.render(this.layers[i][j]);
                }
            }
        },
        /**
            Should be called every loop to update the View object.
        */
        update: function() {
            this.view.update();
        }
    });
    return Scene;
});
