define(function() {

    var Vector = Class({
        constructor: function(x, y) {
            this.x = x;
            this.y = y;
        },
        normalize: function() {
            if (this.x === 0 && this.y === 0) return this;
            var len = Math.sqrt((this.x * this.x) + (this.y * this.y));
            this.x /= len;
            this.y /= len;
            return this;
        },
        add: function(vec) {
            this.x += vec.x;
            this.y += vec.y;
            return this;
        },
        multiply: function(num) {
            this.x *= num;
            this.y *= num;
            return this;
        }
    });

    return Vector;

});
