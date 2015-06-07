define(function() {

    var AnimGroup = Class({
        constructor: function() {
            this.animations = [];
        },
        step: function(delta) {
            for (var i = 0; i < this.animations.length; i++) {
                this.animations[i].stepAnimation(delta);
            }
        },
        setPaused: function(paused) {
            for (var i = 0; i < this.animations.length; i++) {
                this.animations[i].paused = paused;
            }
        },
        addAnimationLayer: function(animation) {
            this.animations.push(animation);
            this.setAnimation(this.active);
            this.reset();
        },
        removeAnimationLayer: function(animation) {
            this.animations.splice(this.animations.indexOf(animation), 1);
        },
        setSpeed: function(anim, speed) {
            for (var i = 0; i < this.animations.length; i++) {
                this.animations[i].animData[anim].speed = speed;
            }
        },
        setAnimation: function(anim) {
            if (this.locked === true) return;
            this.active = anim;
            for (var i = 0; i < this.animations.length; i++) {
                this.animations[i].setAnimation(anim);
            }
        },
        isFinished: function() {
            for (var i = 0; i < this.animations.length; i++) {
                if (this.animations[i].finished === false) return false;
            }
            return true;
        },
        reset: function() {
            for (var i = 0; i < this.animations.length; i++) {
                this.animations[i].reset();
            }
        }
    });

    return AnimGroup;

});
