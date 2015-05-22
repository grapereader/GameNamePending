define(["../view/viewobject"], function(ViewObject) {

    var Entity = Class(ViewObject, {
        constructor: function(scene) {
            Entity.$super.call(this, scene);

            this.dx = 0;
            this.dy = 0;
        },
        update: function() {
            Entity.$superp.update.call(this);

            //TODO Animations will be handled centrally right here
            //since players and enemies will probably share most animations.
        }
    });

    return Entity;

});
