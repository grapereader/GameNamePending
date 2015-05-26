define(function() {

    var InventoryItem = Class({
        constructor: function(gameManager, item, tileX, tileY) {
            this.gameManager = gameManager;

            this.sprite = new PIXI.Sprite(PIXI.utils.TextureCache[item.framesNamespace]["inventory"]);
            this.sprite.scale.x = 2;
            this.sprite.scale.y = 2;

            this.targetX = tileX;
            this.targetY = tileY;

            this.sprite.x = tileX * 32;
            this.sprite.y = tileY * 32;
        },
        update: function() {
            //Similar transition as the View's on item move
            var period = this.gameManager.game.deltaTime / 17;

            var dx = (this.targetX * 32 - this.sprite.x) * period;
            var dy = (this.targetY * 32 - this.sprite.y) * period;

            this.sprite.x += dx / 20;
            this.sprite.y += dy / 20;
        },
        moveTo: function(tileX, tileY) {
            this.targetX = tileX;
            this.targetY = tileY;
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
                var item = new Item(gameManager, inventory.items[i], 0, 0);
                this.container.addChild(item);
                this.items.push(item);
                //Move to instead of set so we get a swaggin animnation on open.
                //This could be really bad for functionality. :P We shall see
                item.moveTo(x, y);
            }
        },
        update: function() {
            for (var i = 0; i < this.items.length; i++) {
                this.items[i].update();
            }
        }
    });

    return InventoryScreen;

});
