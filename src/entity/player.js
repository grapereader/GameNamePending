define(["entity"], function(Entity) {

    var Player = Class(Entity, {
        constructor: function(gameManager) {
            Player.$super.call(this, gameManager);
        },
        update: function() {
            Player.$superp.update.call(this);
        }
    });

    return Player;

});
