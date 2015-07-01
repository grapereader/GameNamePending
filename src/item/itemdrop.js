define(["view/viewobject", "util/helpers", "lighting/lightable"], function(ViewObject, Helpers, Lightable) {

    var ItemDrop = Class([ViewObject, Lightable], {
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
            this.sprite.x = 16;
            this.sprite.y = 16;

            this.addChild(this.sprite);

            this.nameContainer = new PIXI.Container();
            this.nameContainer.visible = false;

            var text = new PIXI.Text(item.name, {
                font: Helpers.getFont(16),
                fill: "white"
            });

            var textBack = new PIXI.Graphics();
            textBack.beginFill(0x0, 0.5);
            textBack.drawRect(0, 0, text.width, text.height);
            textBack.endFill();

            this.nameContainer.addChild(textBack);
            this.nameContainer.addChild(text);

            this.nameContainer.x = -(text.width / 2) + 16;

            this.addChild(this.nameContainer);

            this.x = from.x;
            this.y = from.y;

            this.dropped = false;

            this.timer = 0;

            this.oscOffset = Math.random() * Math.PI * 2;

            this.enableLighting(PIXI.utils.TextureCache[Helpers.sprite("blank-normals.png")]);
        },
        update: function() {
            ItemDrop.$superp.update.call(this);
            var delta = this.gameManager.game.deltaTime;

            this.timer += delta;

            if (this.gameManager.game.keymap.isKeyDown("view.drops")) {
                this.nameContainer.visible = true;
            } else {
                this.nameContainer.visible = false;
            }

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
                this.sprite.y = 32 + 10 + (Math.sin(x) * 10);
            }
        }
    });

    return ItemDrop;

});
