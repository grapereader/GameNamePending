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
        addAnimationLayer: function(animation) {
            this.animations.push(animation);
        },
        removeAnimationLayer: function(animation) {
            this.animations.splice(this.animations.indexOf(animation), 1);
        },
        setAnimation: function(anim) {
            for (var i = 0; i < this.animations.length; i++) {
                this.animations[i].setAnimation(anim);
            }
        }
    });

    return AnimGroup;

});
