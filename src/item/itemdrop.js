define(["view/viewobject"], function(ViewObject) {

    var ItemDrop = Class(ViewObject, {
        constructor: function(gameManager, item, from, to) {
            ItemDrop.$super.call(this, gameManager.scene);

            this.gameManager = gameManager;
            this.item = item;

            this.to = to;

            this.sprite = new PIXI.Sprite(PIXI.utils.TextureCache[item.framesNamespace]["ground"]);
            this.sprite.scale.x = 2;
            this.sprite.scale.y = 2;
            this.sprite.anchor.x = 0.5;
            this.sprite.anchor.y = 0.5;
            this.sprite.x = 32;
            this.sprite.y = 32;

            this.addChild(this.sprite);

            this.x = from.x;
            this.y = from.y;

            this.dropped = false;

            this.timer = 0;

            this.oscOffset = Math.random() * Math.PI * 2;
        },
        update: function() {
            ItemDrop.$superp.update.call(this);
            var delta = this.gameManager.game.deltaTime;

            this.timer += delta;

            if (!this.dropped) {
                var x = this.timer / 100;
                this.sprite.width = Math.sin(x) * 64;
                this.sprite.height = Math.cos(x) * 64;

                this.x += (this.to.x - this.x) / 15 * (delta / 17);
                this.y += (this.to.y - this.y) / 15 * (delta / 17);

                if (Math.abs(this.x - this.to.x) < 5 && Math.abs(this.y - this.to.y) < 5) {
                    this.x = this.to.x;
                    this.y = this.to.y;
                    this.dropped = true;
                    this.sprite.width = 64;
                    this.sprite.height = 64;
                }
            } else {
                var x = (this.timer / 500) + this.oscOffset;
                this.y = this.to.y + (Math.sin(x) * 10);
            }
        }
    });

    return ItemDrop;

});
