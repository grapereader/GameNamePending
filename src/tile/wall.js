define(["tile/tile", "util/helpers", "util/anim", "math/lines", "math/vector"], function(Tile, Helpers, Animation, Lines, Vector) {

    var Wall = Class(Tile, {
        constructor: function(gameManager) {
            Wall.$super.call(this, gameManager);
            this.clipping = true;
            this.container = new PIXI.Container();
            this.tileType = "Wall";

            this.lightCollision = [];

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

            if (layers.indexOf("wall-left") !== -1) {}

            if (layers.indexOf("wall-right") !== -1) {}

            if (layers.indexOf("wall-middle") !== -1 || layers.indexOf("wall-bottom-corner-left") !== -1 || layers.indexOf("wall-bottom-corner-right") !== -1 || layers.indexOf("wall-top") !== -1) {}

            for (var i = 0; i < layers.length; i++) {
                this.container.addChild(this.createSprite(layers[i]));
            }


            this.lightCollision = [{
                a: {x: this.x, y: this.y},
                b: {x: this.x + this.width, y: this.y},
                dir: {x: this.width, y: 0},
                ndir: {x: 1, y: 0}
            }, {
                a: {x: this.x + this.width, y: this.y + this.height},
                b: {x: this.x, y: this.y + this.height},
                dir: {x: -this.width, y: 0},
                ndir: {x: -1, y: 0}
            }, {
                a: {x: this.x, y: this.y + this.height},
                b: {x: this.x, y: this.y},
                dir: {x: 0, y: -this.height},
                ndir: {x: 0, y: -1}
            }, {
                a: {x: this.x + this.width, y: this.y},
                b: {x: this.x + this.width, y: this.y + this.height},
                dir: {x: 0, y: this.height},
                ndir: {x: 0, y: 1}
            }];
        },
        update: function() {
            Wall.$superp.update.call(this);
        }
    });

    return Wall;

});
