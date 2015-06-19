define(function() {

    var Vector = Class({
        constructor: function(x, y) {
            this.x = x;
            this.y = y;
        },
        normalize: function() {
            if (this.x === 0 && this.y === 0) return new Vector(this.x, this.y);
            var len = this.getMagnitude();
            return new Vector(this.x / len, this.y / len);
        },
        add: function(vec) {
            return new Vector(this.x + vec.x, this.y + vec.y);
        },
        multiply: function(num) {
            return new Vector(this.x * num, this.y * num);
        },
        getAngle: function() {
            var angle = Math.atan(this.y / this.x);
            if (this.x < 0) angle += Math.PI;
            else if (this.x > 0 && this.y < 0) angle += Math.PI * 2;
            return angle;
        },
        getMagnitude: function() {
            return Math.sqrt((this.x * this.x) + (this.y * this.y));
        }
    });

    Vector.fromAngle = function(angle, magnitude) {
        var x = magnitude * Math.sin(angle);
        var y = magnitude * Math.cos(angle);
        return new Vector(x, y);
    }

    return Vector;

});
