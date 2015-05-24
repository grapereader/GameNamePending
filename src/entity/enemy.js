define(["entity"], function(Entity) {

    var Enemy = Class(Entity, {
        constructor: function(gameManager) {
            Enemy.$super.call(this, gameManager);
        },
        update: function() {
            Enemy.$superp.update.call(this);
        }
    });

    return Enemy;

});
