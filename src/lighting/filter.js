define(["text!lighting/shader-multi.frag", "math/vector"], function(shader, Vector) {

    var MAX_LIGHTS = 1;
    var MAX_POLY = 72;

    var LightingFilter = Class({
        constructor: function(gameManager, normal) {
            this.gameManager = gameManager;
            this.filter = new PIXI.AbstractFilter(null, shader, {
                normalTexture: {
                    type: 'sampler2D',
                    value: normal
                },
                resolution: {
                    type: '2f',
                    value: [gameManager.game.gameWidth, gameManager.game.gameHeight]
                },
                ambientColour: {
                    type: '4f',
                    value: [0.2, 0.2, 0.2, 0.2]
                },
                lightCount: {
                    type: '1i',
                    value: 0
                },
                lightPositions: {
                    type: '2fv',
                    value: new Float32Array(2 * MAX_LIGHTS)
                },
                lightColours: {
                    type: '4fv',
                    value: new Float32Array(4 * MAX_LIGHTS)
                },
                lightFalloffs: {
                    type: '3fv',
                    value: new Float32Array(3 * MAX_LIGHTS)
                },
                lightSizes: {
                    type: '1fv',
                    value: new Float32Array(MAX_LIGHTS)
                },
                polygonLengths: {
                    type: '1iv',
                    value: new Int32Array(MAX_LIGHTS)
                },
                polygons: {
                    type: '2fv',
                    value: new Float32Array(2 * MAX_LIGHTS * MAX_POLY)
                }
            });
        },
        initializeLights: function(lightSystem) {
            var colours = [];
            var falloffs = [];
            var sizes = [];

            var uniforms = this.filter.uniforms;

            for (var i = 0; i < lightSystem.lights.length; i++) {
                var light = lightSystem.lights[i];
                var col = light.colour;
                for (var k = 0; k < 4; k++) uniforms.lightColours.value[i + k] = col[k];
                var falloff = [0, 1, 0];
                for (var k = 0; k < 3; k++) uniforms.lightFalloffs.value[i + k] = falloff[k];
                uniforms.lightSizes.value[i] = 256;
            }

            uniforms.lightCount.value = lightSystem.lights.length;

            this.updateLights(lightSystem);
        },
        updateLights: function(lightSystem) {
            var positions = [];
            var polygonLengths = [];
            var polygons = [];
            var uniforms = this.filter.uniforms;
            var polys = uniforms.polygons.value;

            var currPoly = 0;
            for (var i = 0; i < lightSystem.lights.length; i++) {
                var light = lightSystem.lights[i];
                var lpos = uniforms.lightPositions.value;
                lpos[i] = (light.sx + 32) / this.gameManager.game.gameWidth;
                lpos[i + 1] = 1 - ((light.sy + 32) / this.gameManager.game.gameHeight);

                uniforms.polygonLengths.value[i] = light.polygon.length;

                for (var p = 0; p < light.polygon.length; p++) {
                    var poly = light.polygon[p];
                    var pi = p * 2;
                    polys[currPoly + pi] = Math.floor(poly.sx);
                    polys[currPoly + pi + 1] = Math.floor(poly.sy);
                }

                currPoly += light.polygon.length * 2;
            }
            //console.log(currPoly);
        }
    });

    return LightingFilter;

});
