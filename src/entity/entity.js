define(["view/viewobject", "util/animgroup"], function(ViewObject, AnimGroup) {

    var Entity = Class(ViewObject, {
        constructor: function(gameManager) {
            Entity.$super.call(this, gameManager.scene);
            this.gameManager = gameManager;

            this.dx = 0;
            this.dy = 0;

            this.animGroup = new AnimGroup();
        },
        update: function() {
            Entity.$superp.update.call(this);

            var delta = this.gameManager.game.deltaTime;

            this.animGroup.step(delta);

            var cx = this.dx * delta / 17;
            var cy = this.dy * delta / 17;

            var grid = this.gameManager.board.grid;

            var currentX = Math.round((this.x / 64));
            var currentY = Math.round((this.y / 64));
            var left = Math.ceil(this.x / 64)-1;
            var right = Math.floor(this.x / 64) + 1;
            var top = Math.ceil(this.y / 64) - 1;
            var bot = Math.floor(this.y / 64) + 1;
            //this.gameManager.board.removeChild(grid[currentX][currentY].tileSprite); USE THIS FOR DEBUGGING
            if (grid[currentX][top].clipping && cy < 0) cy = 0;
            if (grid[currentX][bot].clipping && cy > 0) cy = 0;
            if (grid[left][currentY].clipping && cx < 0) cx = 0;
            if (grid[right][currentY].clipping && cx > 0) cx = 0;

            this.x += cx;
            this.y += cy;

            this.tileX = Math.floor(this.x / 64);
            this.tileY = Math.floor(this.y / 64);
        },
        /**
            Preferred way to move the entity, since it sets the corresponding animation.
        */
        walk: function(dx, dy) {
            if (dx !== this.dx || dy !== this.dy) {
                if (dx === 0 && dy === 0) {
                    if (this.dx > 0 && this.dy === 0) this.animGroup.setAnimation("stand-right");
                    else if (this.dx < 0 && this.dy === 0) this.animGroup.setAnimation("stand-left");
                    else if (this.dy > 0) this.animGroup.setAnimation("stand-down");
                    else if (this.dy < 0) this.animGroup.setAnimation("stand-up");
                } else {
                    if (dx > 0 && dy === 0) this.animGroup.setAnimation("walk-right");
                    else if (dx < 0 && dy === 0) this.animGroup.setAnimation("walk-left");
                    else if (dy > 0) this.animGroup.setAnimation("walk-down");
                    else if (dy < 0) this.animGroup.setAnimation("walk-up");
                }
                this.dx = dx;
                this.dy = dy;
                //console.log("Moving " + dx + ", " + dy);
            }
        }
    });

    return Entity;

});
