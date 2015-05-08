define(function() {
    /**
        Random helper functions
    */

    var spriteDir = "assets/sprites/";

    return {
        animBuilder: function(name, frameCount, fps) {
            var frames = [];
            for (var i = 0; i < frameCount; i++) {
                frames.push(name + "-" + i);
            }
            return {
                frames: frames,
                fps: fps
            };
        },
        sprite: function(name) {
            return spriteDir + name;
        }
    };
});
