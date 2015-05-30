define(function() {

    var InventoryItem = Class({
        constructor: function(gameManager, item, invId, tileX, tileY) {
            this.gameManager = gameManager;

            this.item = item;
            this.invId = invId;

            this.sprite = new PIXI.Sprite(PIXI.utils.TextureCache[item.framesNamespace]["inventory"]);
            this.sprite.scale.x = 2;
            this.sprite.scale.y = 2;

            this.tileX = tileX;
            this.tileY = tileY;

            this.sprite.x = tileX * 32;
            this.sprite.y = tileY * 32;
        },
        update: function() {
            //Similar transition as the View's on item move
            var period = this.gameManager.game.deltaTime / 17;

            var dx = (this.tileX * 32 - this.sprite.x) * period;
            var dy = (this.tileY * 32 - this.sprite.y) * period;

            this.sprite.x += dx / 20;
            this.sprite.y += dy / 20;
        },
        moveTo: function(tileX, tileY) {
            this.tileX = tileX;
            this.tileY = tileY;
        }
    });

    var InventoryScreen = Class({
        constructor: function(gameManager, inventory) {
            this.container = new PIXI.Container();

            this.inventory = inventory;
            this.items = [];

            //These seem useless right now, but may be useful later...
            this.width = Math.min(inventory.items.length, 4);
            this.height = Math.ceil(inventory.items.length / 4);

            for (var i = 0; i < inventory.items.length; i++) {
                if (inventory.items[i] === false) continue;
                var x = i % 4;
                var y = Math.floor(i / 4);
                var item = new InventoryItem(gameManager, inventory.items[i], i, 0, 0);
                this.container.addChild(item.sprite);
                this.items.push(item);
                //Move to instead of set so we get a swaggin animnation on open.
                //This could be really bad for functionality. :P We shall see
                item.moveTo(x, y);
            }

            var overlay = new PIXI.Graphics();
            this.container.addChild(overlay);

            var tooltip = new PIXI.Text("Test", {font: "14px Arial", fill: "white"});
            tooltip.visible = false;
            this.container.addChild(tooltip);

            var self = this;
            this.container.interactive = true;
            var over = false;
            this.container.on("mouseover", function(e) {
                tooltip.visible = true;
            })
            this.container.on("mouseout", function(e) {
                tooltip.visible = false;
                overlay.clear();
            })
            this.container.on("mousemove", function(e) {
                var pos = e.data.getLocalPosition(self.container);
                var mx = pos.x + 15;
                var my = pos.y + 15;
                tooltip.x = mx;
                tooltip.y = my;
                var item = self.getItemAt(mx, my);
                if (item !== false) tooltip.text = item.item.name;

                if (tooltip.visible) {
                    overlay.clear();
                    overlay.beginFill(0x000000, 0.5);
                    var pad = 2;
                    overlay.drawRect(tooltip.x - pad, tooltip.y - pad, tooltip.width + (2 * pad), tooltip.height + (2 * pad));
                    overlay.endFill();
                }
            });
        },
        getItemAt: function(x, y) {
            var tileX = Math.floor(x / 32);
            var tileY = Math.floor(y / 32);
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                if (item.tileX === tileX && item.tileY === tileY) return item;
            }
            return false;
        },
        update: function() {
            for (var i = 0; i < this.items.length; i++) {
                this.items[i].update();
            }
        }
    });

    return InventoryScreen;

});
