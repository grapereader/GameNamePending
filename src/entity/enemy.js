define(["entity/entity"], function(Entity) {

    var Enemy = Class(Entity, {
        constructor: function(gameManager, damage, attackSpeed, walkSpeed, dropMap) {
            Enemy.$super.call(this, gameManager);
            this.damage = damage;
            this.attackSpeed = attackSpeed;
            this.walkSpeed = walkSpeed;
            this.dropMap = dropMap;
        },
        update: function() {
            Enemy.$superp.update.call(this);
        }
    });

    return Enemy;

});
