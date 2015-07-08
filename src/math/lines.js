define(["math/vector"], function(Vector) {
    return {
        getIntersection: function(seg, line) {
            var ldx = line.dir.x;
            var ldy = line.dir.y;

            var sax = seg.a.x;
            var say = seg.a.y;

            var sbx = seg.b.x;
            var sby = seg.b.y;

            var sdx = seg.dir.x;
            var sdy = seg.dir.y;

            if (sax > line.x && sbx > line.x && ldx < 0) return false;
            if (sax < line.x && sbx < line.x && ldx > 0) return false;
            if (say > line.y && sby > line.y && ldy < 0) return false;
            if (say < line.y && sby < line.y && ldy > 0) return false;

            if (line.ndir.x === seg.ndir.x && line.ndir.y === seg.ndir.y) {
                return false;
            }

            var t2 = (ldx * (say - line.y) + ldy * (line.x - sax)) / (sdx * ldy - sdy * ldx);
            var t1 = (sax + sdx * t2 - line.x) / ldx;

            if (t1 < 0) return false;
            if (t2 < 0 || t2 > 1) return false;

            return {
                x: line.x + ldx * t1,
                y: line.y + ldy * t1,
                mag: t1
            };

        },
        createLine: function(x1, y1, width, height) {
            var vec = new Vector(width, height);
            return {
                a: {x: x1, y: y1},
                b: {x: x1 + width, y: y1 + height},
                dir: vec,
                ndir: vec.normalize()
            };
        }
    };
});
