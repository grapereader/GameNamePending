define(function() {
    /**
        Random helper functions
    */

    var spriteDir = "assets/sprites/";

    var Helpers = {
        animBuilder: function(name, frameCount, fps, loop) {
            var frames = [];
            for (var i = 0; i < frameCount; i++) {
                frames.push(name + "-" + i);
            }
            return {
                frames: frames,
                fps: fps,
                loop: (loop === undefined ? true : loop)
            };
        },
        sprite: function(name) {
            return spriteDir + name;
        },
        item: function(name) {
            return Helpers.sprite("items/" + name + "/" + name + ".sheet");
        },
        getFileNameFromPath: function(path) {
            return path.replace(/^.*[\\\/]/, '');
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
        },
        getFont: function(size) {
            return (size) + "px TheFont";
        }
    };

    return Helpers;
});
