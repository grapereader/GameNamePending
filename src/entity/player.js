define(["entity/entity", "util/helpers", "util/anim", "inv/inventory"], function(Entity, Helpers, Animation, Inventory) {

    var Player = Class(Entity, {
        constructor: function(gameManager, saveData) {
            Player.$super.call(this, gameManager);

            this.inventory = new Inventory(16, saveData.inventory, {});

            this.sprites = {
                "base": this.createSprite(),
                "hands": this.createSprite(),
                "legs": this.createSprite(),
                "chest": this.createSprite(),
                "head": this.createSprite(),
                "feet": this.createSprite(),
                "item": this.createSprite()
            };

            this.x = 64;
            this.y = 64;

            for (s in this.sprites) {
                this.addChild(this.sprites[s]);
            }
            this.setSize(64, 64);

            this.walkSpeed = 4;

            var standSpeed = 2;
            var actionSpeed = 5;

            var anims = {
                "stand-left": Helpers.animBuilder("stand-left", 2, standSpeed),
                "stand-right": {flip: "stand-left"},
                "stand-up" : Helpers.animBuilder("stand-up", 2, standSpeed),
                "stand-down": Helpers.animBuilder("stand-down", 2, standSpeed),

                "use-left": Helpers.animBuilder("use-left", 4, actionSpeed),
                "use-right": {flip: "use-left"},
                "use-up": Helpers.animBuilder("use-up", 4, actionSpeed),
                "use-down": Helpers.animBuilder("use-down", 4, actionSpeed),

                "walk-left" : Helpers.animBuilder("walk-left", 4, actionSpeed),
                "walk-right" : {flip: "walk-left"},
                "walk-up" : Helpers.animBuilder("walk-up", 4, actionSpeed),
                "walk-down" : Helpers.animBuilder("walk-down", 4, actionSpeed)
            };

            var testWeapon = gameManager.itemManager.generateWeapon();
            this.animGroup.addAnimationLayer(new Animation(testWeapon.framesNamespace, anims, this.sprites["item"]));

            for (var i = 0; i < this.inventory.items.length; i++) {
                this.inventory.items[i] = testWeapon;
            }

            this.animGroup.addAnimationLayer(new Animation("male-race-1", anims, this.sprites["base"]));
            this.animGroup.setAnimation("stand-down");
        },
        update: function() {
            Player.$superp.update.call(this);

            var kb = this.gameManager.game.keyboard;
            var dx = 0;
            var dy = 0;
            if (kb.isKeyDown("KeyW")) dy = -this.walkSpeed;
            if (kb.isKeyDown("KeyS")) dy = this.walkSpeed;
            if (kb.isKeyDown("KeyA")) dx = -this.walkSpeed;
            if (kb.isKeyDown("KeyD")) dx = this.walkSpeed;
            this.walk(dx, dy);

            this.gameManager.scene.view.move(
                this.x + (this.width / 2) - this.gameManager.game.gameWidth / 2,
                this.y + (this.height / 2) - this.gameManager.game.gameHeight / 2
            );
        },
        createSprite: function() {
            var sprite = new PIXI.Sprite(PIXI.utils.TextureCache[Helpers.sprite("blank.png")]);
            sprite.scale.x = 2;
            sprite.scale.y = 2;
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;

            sprite.x = 32;
            sprite.y = 32;

            return sprite;
        }
    });

    return Player;

});
