define(function() {

    var RATE = 200;

    var DoubleClick = Class({
        constructor: function(container, handle) {
            this.timer = RATE;

            var self = this;
            container.interactive = true;
            container.on("mousedown", function(e) {
                if (self.timer < RATE) {
                    self.timer = RATE;
                    handle(e);
                } else {
                    self.timer = 0;
                }
            });
        },
        update: function(delta) {
            if (this.timer < RATE) this.timer += delta;
        }
    });

    return DoubleClick;

});
