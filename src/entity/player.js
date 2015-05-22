define(["entity"], function(Entity) {

    var Player = Class(Entity, {
        constructor: function(scene) {
            Player.$super.call(this, scene);
        },
        update: function() {
            Player.$superp.update.call(this);
        }
    });

    return Player;

});
