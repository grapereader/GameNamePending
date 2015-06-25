define(["text!lighting/shader.frag", "math/vector"], function(shader, Vector) {

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
                    value: {
                        x: gameManager.game.gameWidth,
                        y: gameManager.game.gameHeight
                    }
                },
                ambientColour: {
                    type: '4f',
                    value: [1.0, 0.2, 0.2, 0.2]
                },
                lightPos: {
                    type: '3f',
                    value: [0, 0, 1]
                },
                lightColour: {
                    type: '4f',
                    value: [1.0, 1.0, 1.0, 1.0]
                },
                lightFalloff: {
                    type: '3f',
                    value: [1, 5, 10]
                },
                lightSize: {
                    type: "1f",
                    value: 1024
                }
            });
        },
        setLight: function(x, y) {
            var lpos = this.filter.uniforms.lightPos.value;
            lpos[0] = x / this.gameManager.game.gameWidth;
            lpos[1] = y / this.gameManager.game.gameHeight;
        }
    });

    return LightingFilter;

});
