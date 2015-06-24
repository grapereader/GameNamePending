define(["view/viewobject", "math/vector"], function(ViewObject, Vector) {

    var LightSystem = Class(ViewObject, {
        constructor: function(gameManager) {
            LightSystem.$super.call(this, gameManager.scene);
            this.gameManager = gameManager;

            this.graphics = new PIXI.Graphics();
            this.addChild(this.graphics);

            this.lights = [
                {
                    point: this.gameManager.player,
                    range: 512
                }
            ];
        },
        update: function() {
            LightSystem.$superp.update.call(this);

            this.recalc();
        },
        recalc: function() {
            this.graphics.clear();
            this.graphics.lineStyle(1, 0xFFFFFF, 1);

            var grid = this.gameManager.board.grid;

            for (var i = 0; i < this.lights.length; i++) {
                var light = this.lights[i];
                var lx = light.point.x + 32;
                var ly = light.point.y + 32;
                var tx = Math.round(lx / 64);
                var ty = Math.round(ly / 64);

                var tr = Math.round(light.range / 64);

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
                        a: {x: o.x, y: o.y + o.height},
                        dir: {x: o.width, y: 0},
                        ndir: {x: 1, y: 0}
                    });
                    sides.push({
                        a: {x: o.x, y: o.y},
                        dir: {x: 0, y: o.height},
                        ndir: {x: 0, y: 1}
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
                            int = line.ndir.multiply(light.range).add(new Vector(lx, ly));
                        }

                        this.graphics.moveTo(light.point.x + 32, light.point.y + 32);
                        this.graphics.lineTo(int.x, int.y);
                    }
                }
            }
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

    return LightSystem;

});
