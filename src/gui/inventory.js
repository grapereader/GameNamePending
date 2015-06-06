define(["util/helpers", "gui/windowobject"], function(Helpers, WindowObject) {

    var InventoryItem = Class(WindowObject, {
        constructor: function(gameManager, item, invId, tileX, tileY) {
            InventoryItem.$super.call(this, gameManager);

            this.item = item;
            this.invId = invId;

            this.sprite = new PIXI.Sprite(PIXI.utils.TextureCache[item.framesNamespace]["inventory"]);
            this.sprite.scale.x = 2;
            this.sprite.scale.y = 2;

            this.tileX = tileX;
            this.tileY = tileY;

            this.sprite.x = tileX * 32;
            this.sprite.y = tileY * 32;

            this.addDoubleClickListener(function(e) {
                console.log(item.name + " double clicked");
            });

            this.addChild(this.sprite);
        },
        update: function() {
            InventoryItem.$superp.update.call(this);
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

    var InventoryScreen = Class(WindowObject, {
        constructor: function(gameManager, inventory) {
            InventoryScreen.$super.call(this, gameManager);

            this.inventory = inventory;

            //These seem useless right now, but may be useful later...
            this.width = Math.min(inventory.items.length, 4);
            this.height = Math.ceil(inventory.items.length / 4);

            for (var i = 0; i < inventory.items.length; i++) {
                if (inventory.items[i] === false) continue;
                var x = i % 4;
                var y = Math.floor(i / 4);
                var item = new InventoryItem(gameManager, inventory.items[i], i, 0, 0);
                this.addChild(item);
                //Move to instead of set so we get a swaggin animnation on open.
                //This could be really bad for functionality. :P We shall see
                item.moveTo(x, y);
            }

            var overlay = new PIXI.Graphics();
            this.container.addChild(overlay);

            var tooltip = new PIXI.Container();
            tooltip.visible = false;

            var tooltipGraphics = new PIXI.Graphics();
            tooltip.addChild(tooltipGraphics);

            var tooltipTitle = new PIXI.Text("", {
                font: Helpers.getFont(16),
                fill: "white"
            });
            tooltip.addChild(tooltipTitle);

            var tooltipDesc = new PIXI.Text("", {
                font: Helpers.getFont(14),
                fill: "white",
                wordWrap: true,
                wordWrapWidth: 150
            });
            tooltipDesc.y = 20;
            tooltip.addChild(tooltipDesc);

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
                var mx = pos.x;
                var my = pos.y;
                tooltip.x = mx + 15;
                tooltip.y = my + 15;
                var item = self.getItemAt(mx, my);
                if (item !== false) {
                    tooltipTitle.text = item.item.name;
                    tooltipDesc.text = item.item.description;
                }
                if (tooltip.visible) {
                    tooltipGraphics.clear();
                    tooltipGraphics.beginFill(0x000000, 0.5);
                    var pad = 2;
                    tooltipGraphics.drawRect(-pad, -pad, Math.max(150, tooltip.width + (2 * pad)), tooltip.height + (2 * pad));
                    tooltipGraphics.endFill();
                }
            });
        },
        getItemAt: function(x, y) {
            var tileX = Math.floor(x / 32);
            var tileY = Math.floor(y / 32);
            for (var i = 0; i < this.children.length; i++) {
                var item = this.children[i];
                if (item.tileX === tileX && item.tileY === tileY) return item;
            }
            return false;
        }
    });

    return InventoryScreen;

});
