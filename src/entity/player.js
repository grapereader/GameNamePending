define(["entity/entity", "util/helpers", "util/anim"], function(Entity, Helpers, Animation) {

    var Player = Class(Entity, {
        constructor: function(gameManager) {
            Player.$super.call(this, gameManager);

            this.baseSprite = this.createSprite();
            this.handsSprite = this.createSprite();
            this.legsSprite = this.createSprite();
            this.chestSprite = this.createSprite();
            this.headSprite = this.createSprite();
            this.feetSprite = this.createSprite();
            this.itemSprite = this.createSprite();

            this.addChild(this.baseSprite);
            this.addChild(this.handsSprite);
            this.addChild(this.legsSprite);
            this.addChild(this.feetSprite);
            this.addChild(this.chestSprite);
            this.addChild(this.headSprite);
            this.addChild(this.itemSprite);
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

            this.addAnimationLayer(new Animation("male-race-1", anims, this.baseSprite));
            this.setAnimation("stand-down");
        },
        update: function() {
            Player.$superp.update.call(this);

            var kb = this.gameManager.game.keyboard;
            var dx = 0;
            var dy = 0;
            if (kb.isKeyDown(0x57)) dy = -this.walkSpeed;
            if (kb.isKeyDown(0x53)) dy = this.walkSpeed;
            if (kb.isKeyDown(0x41)) dx = -this.walkSpeed;
            if (kb.isKeyDown(0x44)) dx = this.walkSpeed;
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
