define(["tile/tile", "util/helpers", "util/anim", "math/lines", "math/vector"], function(Tile, Helpers, Animation, Lines, Vector) {

    var topBound = 9;
    var sideBound = 12;

    var commonSides = {
        topCornerLeft: [
            Lines.createLine(sideBound, topBound, 0, 64 - topBound),
            Lines.createLine(sideBound, topBound, 64 - sideBound, 0)
        ],
        topCornerRight: [
            Lines.createLine(0, topBound, 64 - sideBound, 0),
            Lines.createLine(64 - sideBound, topBound, 0, 64 - topBound)
        ]
    };

    var collisionTypes = [
        {
            include: ["wall-middle", "wall-top"],
            exclude: [],
            options: {
                include: {
                    min: 1,
                    max: 1
                },
                onlyIncludes: true
            },
            lines: [
                Lines.createLine(0, topBound, 64, 0)
            ]
        },
        {
            include: ["wall-middle", "wall-top"],
            exclude: [],
            options: {
                include: {
                    min: 2,
                    max: 2
                },
                onlyIncludes: false
            },
            lines: [
                Lines.createLine(0, topBound, 64, 0)
            ]
        },
        {
            include: ["wall-left"],
            allowed: ["wall-top-corner-left-stub", "wall-right"],
            exclude: [],
            options: {
                onlyIncludes: true
            },
            lines: [
                Lines.createLine(sideBound, 0, 0, 64)
            ]
        },
        {
            include: ["wall-right"],
            allowed: ["wall-top-corner-right-stub", "wall-left"],
            exclude: [],
            options: {
                onlyIncludes: true
            },
            lines: [
                Lines.createLine(64 - sideBound, 0, 0, 64)
            ]
        },
        {
            include: ["wall-top-corner-left-stub"],
            exclude: [],
            options: {
                onlyIncludes: false
            },
            lines: [
                Lines.createLine(64 - sideBound, topBound, 0, 64 - topBound),
                Lines.createLine(64 - sideBound, topBound, sideBound, 0)
            ]
        },
        {
            include: ["wall-top-corner-right-stub"],
            exclude: [],
            options: {
                onlyIncludes: false
            },
            lines: [
                Lines.createLine(sideBound, topBound, 0, 64 - topBound),
                Lines.createLine(0, topBound, sideBound, 0)
            ]
        },
        {
            include: ["wall-bottom-corner-knob-left"],
            exclude: [],
            options: {
                onlyIncludes: false
            },
            lines: [
                Lines.createLine(64 - sideBound, 0, 0, topBound),
                Lines.createLine(64 - sideBound, topBound, sideBound, 0)
            ]
        },
        {
            include: ["wall-bottom-corner-knob-right"],
            exclude: [],
            options: {
                onlyIncludes: false
            },
            lines: [
                Lines.createLine(sideBound, 0, 0, topBound),
                Lines.createLine(0, topBound, sideBound, 0)
            ]
        },
        {
            include: ["wall-bottom-corner-left"],
            exclude: ["wall-right"],
            options: {
                onlyIncludes: false
            },
            lines: [
                Lines.createLine(sideBound, 0, 0, topBound),
                Lines.createLine(sideBound, topBound, 64 - sideBound, 0)
            ]
        },
        {
            include: ["wall-bottom-corner-right"],
            exclude: ["wall-left"],
            options: {
                onlyIncludes: false
            },
            lines: [
                Lines.createLine(64 - sideBound, 0, 0, topBound),
                Lines.createLine(0, topBound, 64 - sideBound, 0)
            ]
        },
        {
            include: ["wall-bottom-corner-left", "wall-right"],
            exclude: [],
            options: {
                include: {
                    min: 2,
                    max: 2
                },
                onlyIncludes: false
            },
            lines: [
                Lines.createLine(sideBound, 0, 0, topBound),
                Lines.createLine(64 - sideBound, 0, 0, topBound),
                Lines.createLine(sideBound, topBound, 64 - (2 * sideBound), 0)
            ]
        },
        {
            include: ["wall-top-corner-left"],
            exclude: ["wall-right"],
            options: {
                onlyIncludes: false
            },
            lines: commonSides.topCornerLeft
        },
        {
            include: ["wall-top", "wall-left"],
            exclude: [],
            options: {
                include: {
                    min: 2,
                    max: 2
                },
                onlyIncludes: true
            },
            lines: commonSides.topCornerLeft
        },
        {
            include: ["wall-top-corner-right"],
            exclude: ["wall-left"],
            options: {
                onlyIncludes: false
            },
            lines: commonSides.topCornerRight
        },
        {
            include: ["wall-top", "wall-right"],
            exclude: [],
            options: {
                include: {
                    min: 2,
                    max: 2
                },
                onlyIncludes: true
            },
            lines: commonSides.topCornerRight
        },
        {
            include: ["wall-top-corner-right", "wall-left"],
            exclude: [],
            options: {
                include: {
                    min: 2,
                    max: 2
                },
                onlyIncludes: false
            },
            lines: [
                Lines.createLine(sideBound, topBound, 64 - (2 * sideBound), 0),
                Lines.createLine(64 - sideBound, topBound, 0, 64 - topBound),
                Lines.createLine(sideBound, topBound, 0, 64 - topBound)
            ]
        },
        {
            include: ["wall-top-corner-left", "wall-right"],
            exclude: [],
            options: {
                include: {
                    min: 2,
                    max: 2
                },
                onlyIncludes: false
            },
            lines: [
                Lines.createLine(sideBound, topBound, 64 - (2 * sideBound), 0),
                Lines.createLine(64 - sideBound, topBound, 0, 64 - topBound),
                Lines.createLine(sideBound, topBound, 0, 64 - topBound)
            ]
        }
    ];

    var Wall = Class(Tile, {
        constructor: function(gameManager) {
            Wall.$super.call(this, gameManager);
            this.clipping = true;
            this.container = new PIXI.Container();
            this.tileType = "Wall";

            this.lightCollision = [];

            //I don't know what I'm going to do about these layered textures. Might have to apply this on the sprite level :/
            this.enableLighting(PIXI.utils.TextureCache[this.gameManager.levelTheme + "-normals"]["wall-middle"]);
        },
        setSprite: function(board) {
            this.lightCollision = [];

            var n = this.getNeighbors(board);
            var left = n.left;
            var right = n.right;
            var top = n.top;
            var bot = n.bot;

            //var nTop = n.tiles.top.getNeighbors(board);
            //var nBot = n.tiles.bot.getNeighbors(board);
            var nLeft = n.tiles.left.getNeighbors(board);
            var nRight = n.tiles.right.getNeighbors(board);

            var layers = [];

            if (bot === "Empty" && top === "Path") layers.push("wall-top");

            if (left === "Path") {
                layers.push("wall-left");
            }

            if (right === "Path") {
                layers.push("wall-right");
            }

            if (top === "Wall") {
                if (left === "Wall" && nLeft.top === "Path") {
                    layers.push("wall-bottom-corner-knob-right");
                }

                if (right === "Wall" && nRight.top === "Path") {
                    layers.push("wall-bottom-corner-knob-left");
                }
            }

            if (bot !== "Path" && top === "Path") {
                if (right === "Path") {
                    layers.push("wall-top-corner-right");
                } else if (left === "Path") {
                    layers.push("wall-top-corner-left");
                } else {
                    layers.push("wall-top");
                }
            }

            if (top === "Wall" && left === "Path" && right === "Path" && bot === "Path") {
                layers.push("wall-bottom-corner-left");
            }

            if (bot === "Path" && top === "Empty") {
                if (left === "Wall" && right === "Wall") layers.push("wall-middle");
            }

            if (top === "Path" && bot === "Path") {
                layers.push("wall-top");
                layers.push("wall-middle");
            }

            if (right !== "Path" && top !== "Path" && left === "Path" && bot === "Path") {
                layers.push("wall-bottom-corner-left");
            } else if (left !== "Path" && top !== "Path" && right === "Path" && bot === "Path") {
                layers.push("wall-bottom-corner-right");
            } else if (bot === "Path" && top !== "Path") {
                layers.push("wall-middle");
            }

            if (right === "Wall" && bot === "Wall") {
                if (nRight.bot === "Path") {
                    if (nRight.top === "Path") {
                        layers.push("wall-right");
                    } else {
                        layers.push("wall-top-corner-left-stub");
                    }
                }
            }

            if (left === "Wall" && bot === "Wall") {
                if (nLeft.bot === "Path") {
                    if (nLeft.top === "Path") {
                        layers.push("wall-left");
                    } else {
                        layers.push("wall-top-corner-right-stub");
                    }
                }
            }

            if (layers.indexOf("wall-left") !== -1) {
            }

            if (layers.indexOf("wall-right") !== -1) {
            }

            if (layers.indexOf("wall-middle") !== -1
             || layers.indexOf("wall-bottom-corner-left") !== -1
             || layers.indexOf("wall-bottom-corner-right") !== -1
             || layers.indexOf("wall-top") !== -1) {
            }

            colTypes:
            for (var c = 0; c < collisionTypes.length; c++) {
                var col = collisionTypes[c];
                var has = 0;
                for (var i = 0; i < col.include.length; i++) {
                    var inc = col.include[i];
                    if (layers.indexOf(inc) !== -1) has++;
                }
                if (col.options !== undefined) {
                    if (col.options.include !== undefined) {
                        if (has < col.options.include.min || has > col.options.include.max) {
                            continue;
                        }
                    }

                    if (col.options.onlyIncludes === true) {
                        for (var i = 0; i < layers.length; i++) {
                            if (col.include.indexOf(layers[i]) === -1 && (col.allowed === undefined || col.allowed.indexOf(layers[i]) === -1)) continue colTypes;
                        }
                    }
                }
                if (has === 0) continue;
                for (var i = 0; i < col.exclude.length; i++) {
                    var ex = col.exclude[i];
                    if (layers.indexOf(ex) !== -1) continue colTypes;
                }

                for (var i = 0; i < col.lines.length; i++) {
                    var l = col.lines[i];
                    this.lightCollision.push({
                        a: {x: l.a.x + this.x, y: l.a.y + this.y},
                        b: {x: l.b.x + this.x, y: l.b.y + this.y},
                        dir: l.dir,
                        ndir: l.ndir
                    });
                }
            }

            for (var i = 0; i < layers.length; i++) {
                this.container.addChild(this.createSprite(layers[i]));
            }

            var g = new PIXI.Graphics();
            this.container.addChild(g);

            g.lineStyle(1, 0x0000FF, 1);

            for (var i = 0; i < this.lightCollision.length; i++) {
                var l = this.lightCollision[i];
                g.moveTo(l.a.x - this.x, l.a.y - this.y);
                g.lineTo(l.b.x - this.x, l.b.y - this.y);
            }

            /*
            this.lightCollision = [{
                a: {x: this.x, y: this.y},
                b: {x: this.x + this.width, y: this.y},
                dir: {x: this.width, y: 0},
                ndir: {x: 1, y: 0},
            },
            {
                a: {x: this.x + this.width, y: this.y + this.height},
                b: {x: this.x, y: this.y + this.height},
                dir: {x: -this.width, y: 0},
                ndir: {x: -1, y: 0},
            },
            {
                a: {x: this.x, y: this.y + this.height},
                b: {x: this.x, y: this.y},
                dir: {x: 0, y: -this.height},
                ndir: {x: 0, y: -1},
            },
            {
                a: {x: this.x + this.width, y: this.y},
                b: {x: this.x + this.width, y: this.y + this.height},
                dir: {x: 0, y: this.height},
                ndir: {x: 0, y: 1},
            }];
            */

        },
        update: function() {
            Wall.$superp.update.call(this);
        }
    });

    return Wall;

});
