define(["entity"], function(Entity) {

    var Enemy = Class(Entity, {
        constructor: function(scene) {
            Enemy.$super.call(this, scene);
        },
        update: function() {
            Enemy.$superp.update.call(this);
        }
    });

    return Enemy;

});
