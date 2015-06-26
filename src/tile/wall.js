define(["tile/tile", "util/helpers", "util/anim"], function(Tile, Helpers, Animation) {
    var Wall = Class(Tile, {
        constructor: function(gameManager) {
            Wall.$super.call(this, gameManager);
            this.clipping = true;
            this.container = new PIXI.Container();
            this.tileType = "Wall";

            //I don't know what I'm going to do about these layered textures. Might have to apply this on the sprite level :/
            this.enableLighting(PIXI.utils.TextureCache[this.gameManager.levelTheme + "-normals"]["wall-middle"]);
        },
        setSprite: function(board) {
            var n = this.getNeighbors(board);
            var left = n.left;
            var right = n.right;
            var top = n.top;
            var bot = n.bot;

            var nTop = n.tiles.top.getNeighbors(board);
            var nBot = n.tiles.bot.getNeighbors(board);
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

            for (var i = 0; i < layers.length; i++) {
                this.container.addChild(this.createSprite(layers[i]));
            }

        },
        update: function() {
            Wall.$superp.update.call(this);
        },
    });

    return Wall;

});
