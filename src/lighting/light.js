define(["view/viewobject", "math/vector", "math/lines"], function(ViewObject, Vector, Lines) {

    var POLY_SIMPLIFY = 0.05;

    var Light = Class(ViewObject, {
        constructor: function(gameManager, colour, range) {
            Light.$super.call(this, gameManager.scene);
            this.gameManager = gameManager;

            this.colour = colour;
            this.range = range;

            this.baked = false;

            this.polygon = [];
        },
        update: function() {
            Light.$superp.update.call(this);

            if (!this.baked) this.recalc();
        },
        bake: function() {
            this.recalc();
            this.baked = true;
        },
        recalc: function() {
            var intersects = [];

            var grid = this.gameManager.board.grid;

            var lx = this.x + 32;
            var ly = this.y + 32;
            var tx = Math.round(lx / 64);
            var ty = Math.round(ly / 64);

            var tr = Math.round(this.range / 64);

            var sides = [];

            for (var x = Math.max(0, tx - tr); x < Math.min(grid.length, tx + tr); x++) {
                for (var y = Math.max(0, ty - tr); y < Math.min(grid[x].length, ty + tr); y++) {
                    var o = grid[x][y];
                    if (o.tileType === "Wall" && o.clipping) sides.push(o.lightCollision);
                }
            }

            var self = this;
            var intersect = function(line) {
                var int = self.getIntersections(sides, line);

                if (int === false) {
                    int = line.ndir.multiply(self.range).add(new Vector(lx, ly));
                }

                var dir = new Vector(int.x - lx, int.y - ly);

                var view = self.gameManager.scene.view;

                int = {
                    x: int.x,
                    y: int.y,
                    sx: Math.floor(int.x - view.x),
                    sy: Math.floor(int.y - view.y),
                    angle: dir.getAngle()
                };

                return int;
            };

            var calcSide = function(vec) {
                for (var e = -1; e <= 1; e++) {
                    if (e === 0) continue;

                    var rvec = Vector.fromAngle(vec.getAngle() + (e * 0.01), 1);
                    var line = {
                        x: lx,
                        y: ly,
                        dir: rvec,
                        ndir: rvec.normalize()
                    };

                    intersects.push(intersect(line));
                }
            };

            for (var k = 0; k < sides.length; k++) {
                for (var i = 0; i < sides[k].length; i++) {
                    var side = sides[k][i];
                    calcSide(new Vector(side.a.x - lx, side.a.y - ly));
                }
            }

            for (var k = 0; k < Math.PI * 2; k += Math.PI / 15) {
                var vec = Vector.fromAngle(k, this.range);
                var line = {
                    x: lx,
                    y: ly,
                    dir: vec,
                    ndir: vec.normalize()
                };
                intersects.push(intersect(line));
            }

            intersects.sort(function(a, b) {
                return a.angle - b.angle;
            });

            //console.log(this.polygon);

            this.polygon = [];
            this.polygon.push(intersects[0]);
            var last = intersects[0];
            for (var i = 1; i < intersects.length; i++) {
                var curr = intersects[i % intersects.length];
                var next = intersects[(i + 1) % intersects.length];

                if (curr.x === last.x && curr.y === last.y) continue;
                if (curr.x === next.x && curr.y === next.y) continue;

                var lastAngle = new Vector(curr.x - last.x, curr.y - last.y).getAngle();
                var nextAngle = new Vector(next.x - curr.x, next.y - curr.y).getAngle();
                var diff = Math.abs(Math.abs(lastAngle) - Math.abs(nextAngle));

                if (diff > POLY_SIMPLIFY && diff < (Math.PI * 2) - POLY_SIMPLIFY) {
                    this.polygon.push(curr);
                    last = curr;
                }
            }
            this.polygon.push(intersects[0]);

            /*
            this.sx += 32;
            this.sy += 32;

            this.polygon = [];
            var last = false;
            for (var i = 0; i < 2 * Math.PI; i += (Math.random() * Math.PI / 4) + Math.PI / 16) {
                var vec = Vector.fromAngle(i, 200);
                if (last !== false) {
                    this.polygon.push({
                        a: {sx: this.sx + vec.x, sy: this.sy + vec.y},
                        b: {sx: this.sx + last.x, sy: this.sy + last.y}
                    });
                }
                last = vec;
            }
            */


        },
        getIntersectionsFast: function(line) {
            var cx = line.x;
            var cy = line.y;

            while (new Vector(cx - (this.x + 32), cy - (this.y + 32)).getMagnitude() < this.range) {
                cx += line.ndir.x;
                cy += line.ndir.y;

                var tileX = Math.floor(cx / 64);
                var tileY = Math.floor(cy / 64);

                if (this.gameManager.board.grid[tileX][tileY].clipping) return {
                    x: cx,
                    y: cy
                };
            }
            return false;
        },
        getIntersections: function(sides, line) {

            var last = false;

            for (var i = 0; i < sides.length; i++) {
                for (var k = 0; k < sides[i].length; k++) {
                    var side = sides[i][k];
                    var int = Lines.getIntersection(side, line);
                    if (int !== false && (last === false || int.mag < last.mag)) last = int;
                }
            }

            return last;
        }
    });

    return Light;

});
