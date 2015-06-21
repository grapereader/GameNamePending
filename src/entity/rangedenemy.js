define(["entity/enemy", "math/vector", "entity/projectile"], function(Enemy, Vector, Projectile) {

    var RangedEnemy = Class(Enemy, {
        constructor: function(gameManager, homeX, homeY, level, data) {
            RangedEnemy.$super.call(this, gameManager, homeX, homeY, level, data);
        },
        canAttack: function() {
            var player = this.gameManager.player;
            var dist = this.getDistVector(player);
            if (dist.getMagnitude() > this.attackData.range) return false;
            return this.moveManager.trace(this.x, this.y, player.x, player.y, dist.normalize());
        },
        attackPlayer: function() {
            var projectileVector = this.getDistVector(this.gameManager.player).normalize().multiply(this.attackData.projectileSpeed);
            var projectile = new Projectile(this.gameManager, this.x, this.y, projectileVector, this.attackData.damage);
            this.gameManager.board.addEnemy(projectile);
        }
    });

    return RangedEnemy;

});
