define(["view/viewobject", "math/vector"], function(ViewObject, Vector) {

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

            var objects = [];
            for (var x = Math.max(0, tx - tr); x < Math.min(grid.length, tx + tr); x++) {
                for (var y = Math.max(0, ty - tr); y < Math.min(grid[x].length, ty + tr); y++) {
                    var o = grid[x][y];
                    if (o.tileType === "Wall" && o.clipping) objects.push(o);
                }
            }

            var sides = [];
            for (var k = 0; k < objects.length; k++) {
                var o = objects[k];
                sides.push({
                    a: {x: o.x, y: o.y},
                    dir: {x: o.width, y: 0},
                    ndir: {x: 1, y: 0}
                });
                sides.push({
                    a: {x: o.x + o.width, y: o.y + o.height},
                    dir: {x: -o.width, y: 0},
                    ndir: {x: -1, y: 0}
                });
                sides.push({
                    a: {x: o.x, y: o.y + o.height},
                    dir: {x: 0, y: -o.height},
                    ndir: {x: 0, y: -1}
                });
                sides.push({
                    a: {x: o.x + o.width, y: o.y},
                    dir: {x: 0, y: o.height},
                    ndir: {x: 0, y: 1}
                });
            }

            for (var k = 0; k < sides.length; k++) {
                var side = sides[k];
                var vec = new Vector(side.a.x - lx, side.a.y - ly);

                for (var e = -1; e <= 1; e++) {
                    if (e === 0) continue;

                    var rvec = Vector.fromAngle(vec.getAngle() + (e * 0.01), 1);
                    var line = {
                        x: lx,
                        y: ly,
                        dir: rvec,
                        ndir: rvec.normalize()
                    }

                    var int = this.getIntersections(sides, line);

                    if (int === false) {
                        int = line.ndir.multiply(this.range).add(new Vector(lx, ly));
                    }

                    var dir = new Vector(int.x - lx, int.y - ly);

                    var view = this.gameManager.scene.view;

                    int = {
                        x: int.x,
                        y: int.y,
                        sx: Math.floor(int.x - view.x),
                        sy: Math.floor(int.y - view.y),
                        angle: dir.getAngle()
                    }

                    intersects.push(int);
                }
            }

            intersects.sort(function(a, b) {
                return a.angle - b.angle;
            });


            this.polygon = [];
            var last = intersects[0];
            for (var i = 1; i < intersects.length; i++) {
                var curr = intersects[i % intersects.length];
                var next = intersects[(i + 1) % intersects.length];

                if (curr.x === last.x && curr.y === last.y) continue;
                if (curr.x === next.x && curr.y === next.y) continue;

                var lastAngle = new Vector(curr.x - last.x, curr.y - last.y).getAngle();
                var nextAngle = new Vector(next.x - curr.x, next.y - curr.y).getAngle();
                var diff = Math.abs(Math.abs(lastAngle) - Math.abs(nextAngle));

                if (diff > 0.1 && diff < (Math.PI * 2) - 0.2) {
                    var line = {
                        a: last,
                        b: curr
                    };
                    this.polygon.push(line);
                    last = curr;
                }
            }

            var line = {
                a: last,
                b: intersects[0]
            };
            this.polygon.push(line);



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

                if (this.gameManager.board.grid[tileX][tileY].clipping) return {x: cx, y: cy};
            }
            return false;
        },
        getIntersections: function(sides, line) {

            var last = false;

            for (var i = 0; i < sides.length; i++) {
                var int = this.getIntersection(sides[i], line);
                if (int !== false && (last === false || int.mag < last.mag)) last = int;
            }

            return last;
        },
        getIntersection: function(seg, line) {
            var lx = line.x;
            var ly = line.y;
            var ldx = line.dir.x;
            var ldy = line.dir.y;

            var sx = seg.a.x;
            var sy = seg.a.y;
            var sdx = seg.dir.x;
            var sdy = seg.dir.y;

            if (line.ndir.x === seg.ndir.x && line.ndir.y === seg.ndir.y) {
            	return false;
            }

            var t2 = (ldx * (sy - ly) + ldy * (lx - sx)) / (sdx * ldy - sdy * ldx);
            var t1 = (sx + sdx * t2 - lx) / ldx;

            if (t1 < 0) return false;
            if (t2 < 0 || t2 > 1) return false;

            return {
            	x: lx + ldx * t1,
            	y: ly + ldy * t1,
            	mag: t1
            };

        }
    });

    return Light;

});
