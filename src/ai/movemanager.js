define(["math/vector"], function(Vector) {

    var MAX_FOLLOW = 1024;

    var MoveManager = Class({
        constructor: function(gameManager, entity) {
            this.gameManager = gameManager;
            this.entity = entity;
            this.path = false;
            this.prevTarget = false;
            this.nextPath = false;
        },
        getMovement: function(target) {
            var board = this.board = this.gameManager.board;

            var x = this.x = this.entity.x;
            var y = this.y = this.entity.y;

            target = {
                x: target.x,
                y: target.y,
                tileX: target.tileX,
                tileY: target.tileY
            }

            var homeX = this.entity.homeX * 64;
            var homeY = this.entity.homeY * 64;

            if ((Math.abs(x - target.x) > 5 * 64 || Math.abs(y - target.y) > 5 * 64) ||
                (Math.abs(x - homeX) > 20 * 64 || Math.abs(y - homeY) > 20 * 64)) {
                target = {
                    x: homeX,
                    y: homeY,
                    tileX: this.entity.homeX,
                    tileY: this.entity.homeY
                }
            }

            var movement = new Vector(0, 0);

            if (Math.abs(target.x - x) < 1 && Math.abs(target.y - y) < 1) return movement;

            var follow = this.follow(target);
            if (follow !== false) {
                movement.add(follow);
            } else {
                if (this.prevTarget === false || this.diffTile(target, this.prevTarget) || this.path === false) {
                    this.path = this.getPath(target);
                    this.nextPath = false;
                }

                if (this.path !== false) {
                    var walk = this.walkPath(this.path);
                    if (walk !== false) movement.add(walk);
                }

            }

            this.prevTarget = target;


            return movement.normalize();
        },
        diffTile: function(target1, target2) {
            return target1.tileX !== target2.tileX || target1.tileY !== target2.tileY;
        },
        follow: function(target) {
            var tx = target.x;
            var ty = target.y;
            var x = this.x;
            var y = this.y;

            var xDiff = tx - x;
            var yDiff = ty - y;

            var dist = Math.sqrt((xDiff * xDiff) + (yDiff * yDiff));

            if (dist > MAX_FOLLOW) return false;

            var follow = new Vector(xDiff, yDiff).normalize();

            if (!this.trace(x, y, tx, ty, follow)) return false;
            return follow;
        },
        trace: function(x, y, tx, ty, vec) {
            var cx = x;
            var cy = y;

            while (Math.abs(cx - tx) > 1 || Math.abs(cy - ty) > 1) {
                cx += vec.x;
                cy += vec.y;

                var tileX = Math.round(cx / 64);
                var tileY = Math.round(cy / 64);

                if (this.board.grid[tileX][tileY].clipping) return false;
            }

            return true;
        },
        getPath: function(target) {
            var path = false;

            var tileX = this.entity.tileX;
            var tileY = this.entity.tileY;

            if (target.tileX != tileX || target.tileY != tileY) {
                var finder = this.board.getPathfinder();
                path = finder.getPath(tileX, tileY, target.tileX, target.tileY);
            }

            return path;
        },
        walkPath: function(path) {
            var vec = false;
            for (var i = 0; i < path.length; i++) {
                var p = path[i];
                var target = {
                    x: p.x * 64,
                    y: p.y * 64
                }
                var follow = this.follow(target);
                if (follow === false) break;
                this.nextPath = target;
                vec = follow;
            }

            //Remove 1 less than i since it was the ith tile that wasn't in sight
            if (i > 1) path.splice(0, i - 1);

            if (follow === false && this.nextPath !== false) {
                vec = this.follow(this.nextPath);
            }

            return vec;
        }
    });

    return MoveManager;

});
