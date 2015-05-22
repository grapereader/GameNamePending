define(["../lib/heap"], function(Heap) {

    var Node = Class({
        constructor: function(x, y, c) {
            this.x = x;
            this.y = y;
            this.c = c;
            this.opened = false;
        }
    });

    var Grid = Class({
        constructor: function(baseGrid) {
            this.baseGrid = baseGrid;

            this.nodes = new Array(baseGrid.length);

            for (var y = 0; y < baseGrid.length; y++) {
                this.nodes[y] = new Array(baseGrid[y].length);
                for (var x = 0; x < baseGrid[y].length; x++) {
                    this.nodes[y][x] = new Node(x, y, baseGrid[y][x]);
                }
            }
        },
        getNodeAt: function(x, y) {
            return this.nodes[y][x];
        },
        walkableAt: function(x, y) {
            if (y >= this.nodes.length || y < 0 || x >= this.nodes[y].length || x < 0) return false;
            return !this.getNodeAt(x, y).c;
        },
        getNeighbors: function(x, y) {
            //console.log("Get neighbors " + x + ", " + y);
            var n = [];

            var down = false;
            var left = false;
            var up = false;
            var right = false;

            if (this.walkableAt(x, y + 1)) {
                n.push(this.getNodeAt(x, y + 1));
                down = true;
            }

            if (this.walkableAt(x, y - 1)) {
                n.push(this.getNodeAt(x, y - 1));
                up = true;
            }

            if (this.walkableAt(x + 1, y)) {
                n.push(this.getNodeAt(x + 1, y));
                right = true;
            }

            if (this.walkableAt(x - 1, y)) {
                n.push(this.getNodeAt(x - 1, y));
                left = true;
            }

            if (up && right && this.walkableAt(x + 1, y - 1)) {
                n.push(this.getNodeAt(x + 1, y - 1));
            }

            if (up && left && this.walkableAt(x - 1, y - 1)) {
                n.push(this.getNodeAt(x - 1, y - 1));
            }

            if (down && right && this.walkableAt(x + 1, y + 1)) {
                n.push(this.getNodeAt(x + 1, y + 1));
            }

            if (down && left && this.walkableAt(x - 1, y + 1)) {
                n.push(this.getNodeAt(x - 1, y + 1));
            }

            return n;
        }
    });

    var Finder = Class({
        constructor: function() {

        },
        getPath: function(x, y, dx, dy, baseGrid) {
            var open = new Heap(function(a, b) {
                return a.f - b.f;
            });
            var grid = new Grid(baseGrid);
            var start = grid.getNodeAt(x, y);
            var dest = grid.getNodeAt(dx, dy);

            start.g = 0;
            start.f = this.heuristic(x, y, dx, dy);

            open.push(start);
            start.opened = true;


            while (!open.empty()) {
                var c = open.pop();
                c.closed = true;

                if (c === dest) {
                    return this.reconstruct(c);
                }

                var nbs = grid.getNeighbors(c.x, c.y);
                for (var i = 0; i < nbs.length; i++) {
                    var n = nbs[i];
                    if (n.closed) continue;

                    //Quick way of finding H on 45deg right ang tri
                    g = c.g + ((n.x === c.x || n.y === c.y) ? 1 : Math.SQRT2);

                    if (!n.opened || g < n.g) {
                        n.parent = c;
                        n.g = g;
                        n.f = g + this.heuristic(n.x, n.y, dx, dy);

                        if (!n.opened) {
                            open.push(n);
                            n.opened = true;
                        }
                    }

                }
            }

            return false;

        },
        reconstruct: function(node) {
            var path = [[node.x, node.y]];
            while (node.parent) {
                node = node.parent;
                path.push([node.x, node.y]);
            }
            return path.reverse();
        },
        heuristic: function(x1, y1, x2, y2) {
            var dx = Math.abs(x1 - x2);
            var dy = Math.abs(y1 - y2);
            var F = Math.SQRT2 - 1;
            return (dx < dy) ? F * dx + dy : F * dy + dx;
        }
    });

    return Finder;

});
