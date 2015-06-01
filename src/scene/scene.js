define(["view/view"], function(View) {
    /**
        Scene class which allows arbitrary numbers of layers, and
        supports moving objects from layer to layer, much like a z-index.

        Renders from 0-n layers, with the nth layer on top.
    */
    var Scene = Class({
        constructor: function(game, layers) {
            this.game = game;

            this.root = new PIXI.Container();
            for (var i = 0; i < layers; i++) {
                this.root.addChild(new PIXI.Container());
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
            this.root.getChildAt(toLayer).addChild(object);

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
                var layer = root.getChildAt(object.layer);
                layer.removeChild(object);
            }
        },
        /**
            Render all layers with the renderer
        */
        render: function(renderer) {
            renderer.render(this.root);
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