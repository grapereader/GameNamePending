define(function() {
    /**
        View class which basically functions like a camera.

        It is the ViewObject's responsibility to translate itself in
        accordance with the values in this class.
    */
    var View = Class({
        constructor: function(game, x, y, width, height) {
            this.game = game;

            this.x = x;
            this.y = y;

            this.targetX = x;
            this.targetY = y;

            this.width = width;
            this.height = height;
        },
        /**
            Move the view to the specified x and y position
        */
        move: function(x, y) {
            this.targetX = x;
            this.targetY = y;
        },
        /**
            Forces the camera to specified x and y position
        */
        setLocation: function(x, y) {
            this.targetX = x;
            this.targetY = y;
            this.x = x;
            this.y = y;
        },
        /**
            This function, which should be called every loop from the Scene class' update,
            smoothly transitions the camera after it has been moved.
        */
        update: function() {
            //We expect, in ideal conditions at 60fps, that a frame should
            //happen every 16.6666 millis, so we try to keep the translation
            //at that speed, regardless of framerate. Note that I only chose
            //this value because my previous implementation used no delta
            //and I liked the speed it went :P
            var framePeriod = this.game.deltaTime / 17;

            var dx = (this.targetX - this.x) * framePeriod;
            var dy = (this.targetY - this.y) * framePeriod;

            this.x += dx / 40;
            this.y += dy / 40;
        }
    });

    return View;

});
