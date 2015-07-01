define(["view/cullable", "util/helpers", "util/animgroup", "lighting/lightable"], function(Cullable, Helpers, AnimGroup, Lightable) {

    var Tile = Class([Cullable, Lightable], {
        constructor: function(gameManager) {
            this.gameManager = gameManager;
            this.scene = gameManager.scene;
            this.clipping = true;
            this.tileType = "Empty";
            this.tileX = 0;
            this.tileY = 0;
            this.x = 0;
            this.y = 0;
            this.width = 64;
            this.height = 64;
            this.animGroup = new AnimGroup();

            this.objects = [];
        },
        update: function() {
            for (var i = 0; i < this.objects.length; i++) {
                this.objects[i].update();
            }

            if (this.test !== undefined) {
                this.test = true;
                var text = new PIXI.Text(this.tileType, {
                    font: Helpers.getFont(16),
                    fill: "white"
                });
                this.container.addChild(text);
            }

            this.sx = this.x - this.scene.view.x;
            this.sy = this.y - this.scene.view.y;
            this.cull();
        },
        getNeighbors: function(board) {
            var n = {
                left: "Wall",
                right: "Wall",
                bot: "Wall",
                top: "Wall",
                tiles: {
                    left: false,
                    right: false,
                    bot: false,
                    top: false
                }
            }

            if (this.tileX > 0) {
                n.tiles.left = board.grid[this.tileX - 1][this.tileY];
                n.left = n.tiles.left.tileType;
            }

            if (this.tileX < board.gridWidth - 1) {
                n.tiles.right = board.grid[this.tileX + 1][this.tileY];
                n.right = n.tiles.right.tileType;
            }

            if (this.tileY > 0) {
                n.tiles.top = board.grid[this.tileX][this.tileY - 1];
                n.top = n.tiles.top.tileType;
            }

            if (this.tileY < board.gridHeight - 1) {
                n.tiles.bot = board.grid[this.tileX][this.tileY + 1];
                n.bot = n.tiles.bot.tileType;
            }

            return n;
        },
        setSprite: function(board) {},
        addObject: function(object) {
            this.objects.push(object);
            if (this.container !== undefined) this.container.addChild(object.container);
        },
        hasObject: function(tileType) {
            for (var i = 0; i < this.objects.length; i++) {
                if (this.objects[i].tileType === tileType) return true;
            }
            return false;
        },
        createSprite: function(spriteLocation, sheet) {
            var sprite = new PIXI.Sprite(PIXI.utils.TextureCache[sheet !== undefined ? sheet : this.gameManager.levelTheme][spriteLocation]);
            sprite.scale.x = 2;
            sprite.scale.y = 2;

            return sprite;
        },
        setPosition: function(tileX, tileY) {
            if (this.container !== undefined) {
                this.container.x = this.x = tileX * 64;
                this.container.y = this.y = tileY * 64;
            }
            this.tileX = tileX;
            this.tileY = tileY;
            return this;
        },
        translate: function(x, y) {
            this.setPosition(this.tileX + x, this.tileY + y);
            return this;
        },
        toData: function() {
            var data = {
                type: this.tileType,
                x: this.tileX,
                y: this.tileY,
            };
            return data;
        },
        fromData: function(data) {
            this.setPosition(data.x, data.y);
        }

    });

    return Tile;

});
