define(function() {

    var Timer = Class({
        constructor: function(period, loop, run) {
            this.period = period;
            this.loop = loop;
            this.run = run;
            this.timer = 0;
            this.started = true;
        },
        update: function(delta) {
            if (this.started === false) return;
            this.timer += delta;
            if (this.timer >= this.period) {
                this.timer = 0;
                this.run();
                if (this.loop === false) this.started = false;
            }
        }
    });

    return Timer;

});