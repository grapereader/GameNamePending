define(function() {

    var Timer = Class({
        constructor: function(period, run) {
            this.period = period;
            this.run = run;
            this.timer = 0;
        },
        update: function(delta) {
            this.timer += delta;
            if (this.timer >= this.period) {
                this.timer = 0;
                this.run();
            }
        }
    });

    return Timer;

});
