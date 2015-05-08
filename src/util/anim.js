define(function() {

    var Animation = Class({
        constructor: function(namespace, animFrames, sprite) {
            this.elapsed = 0;
            this.animFrames = animFrames;
            this.activeFrame = 0;
            this.activeAnimation = "";
            this.changed = false;
            this.sprite = sprite;

            this.animData = {};

            for (var anim in this.animFrames) {
                this.animData[anim] = {};
                this.animData[anim].textures = [];
                this.animData[anim].flip = false;
                var source = anim;
                if (this.animFrames[anim].flip !== undefined) {
                    source = this.animFrames[anim].flip;
                    this.animData[anim].flip = true;
                }
                this.animData[anim].speed = 1000 / this.animFrames[source].fps;
                for (var i = 0; i < this.animFrames[source].frames.length; i++) {
                    this.animData[anim].textures[i] = PIXI.TextureCache[namespace][this.animFrames[source].frames[i]];
                }
            }
        },

        setAnimation: function(animId) {
            if (this.activeAnimation !== animId) {
                this.activeAnimation = animId;
                this.activeFrame = 0;
                this.changed = true;
            }
        },

        stepAnimation: function(deltaTime) {
            this.elapsed += deltaTime;
            this.changed = false;

            if (this.elapsed > this.animData[this.activeAnimation].speed) {
                this.elapsed = 0;
                this.changed = true;
                this.activeFrame++;

                if (this.activeFrame >= this.animData[this.activeAnimation].textures.length) {
                    this.activeFrame = 0;
                }
            }

            var animData = this.animData[this.activeAnimation];
            var texture = animData.textures[this.activeFrame];
            if (this.changed) {
                this.sprite.setTexture(texture);
                this.sprite.scale.x = (animData.flip ? -1 : 1) * Math.abs(this.sprite.scale.x);
            }
            return texture;
        }

    });

    return Animation;

});
