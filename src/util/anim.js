define(function() {

    var Animation = Class({
        /**
            Relatively extensible animation framework

            namespace - Namespace of spritesheet (see sheetparser)
            animFrames - Big data structure containing the frames and fps of each animation
                Best explained by example:
                {
                    "ranged-right": {flip: "ranged-left"}, <- Flipping other animations horizontally is allowed
                    "ranged-left": {
                        "frames": ["ranged-left-0", "ranged-left-1", "ranged-left-2", "ranged-left-3"], <- These are frames in the namespace
                        "fps": 5 <- Each animation has its own fps
                    }
                }
                Note: The animBuilder inside "helpers" makes this quicker and less painful.
                --> "ranged-left": Helpers.animBuilder("ranged-left", frameCount, fps)

            sprite - The sprite that gets anim textures applied to it
        */
        constructor: function(namespace, animFrames, sprite) {
            this.elapsed = 0;
            this.animFrames = animFrames;
            this.activeFrame = 0;
            this.activeAnimation = "";
            this.changed = false;
            this.sprite = sprite;
            this.finished = false;

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
                this.animData[anim].loop = this.animFrames[source].loop;
                for (var i = 0; i < this.animFrames[source].frames.length; i++) {
                    this.animData[anim].textures[i] = PIXI.utils.TextureCache[namespace][this.animFrames[source].frames[i]];
                }
            }
        },
        /**
            Set the current animation, as defined in the animFrames object
        */
        setAnimation: function(animId) {
            if (this.activeAnimation !== animId) {
                this.activeAnimation = animId;
                this.reset();
            }
        },
        reset: function() {
            this.elapsed = 0;
            this.activeFrame = 0;
            this.changed = true;
            this.finished = false;
        },
        /**
            Must be called every frame for the animation to work.
            Returns the texture currently applied to the sprite.
        */
        stepAnimation: function(deltaTime) {
            if (this.paused === true) return false;
            this.elapsed += deltaTime;
            if (this.elapsed > this.animData[this.activeAnimation].speed) {
                this.elapsed = 0;
                this.changed = true;
                this.activeFrame++;

                if (this.activeFrame >= this.animData[this.activeAnimation].textures.length) {
                    if (this.animData[this.activeAnimation].loop) {
                        this.activeFrame = 0;
                    } else {
                        this.finished = true;
                    }
                }
            }

            if (!this.finished) {
                var animData = this.animData[this.activeAnimation];
                var texture = animData.textures[this.activeFrame];
                if (this.changed) {
                    this.sprite.texture = texture;
                    this.sprite.scale.x = (animData.flip ? -1 : 1) * Math.abs(this.sprite.scale.x);
                    this.changed = false;
                }
                return texture;
            }
            return false;
        }

    });

    return Animation;

});
