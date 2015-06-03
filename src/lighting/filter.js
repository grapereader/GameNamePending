define(["lighting/fragshader", function(FragmentShader) {

            var LightingFilter = Class({
                constructor: function(texture) {
                    this.filter = new PIXI.AbstractFilter(null, FragmentShader, {
                        displacementMap: {
                            type: 'sampler2D',
                            value: texture
                        },
                        scale: {
                            type: '2f',
                            value: {
                                x: 15,
                                y: 15
                            }
                        },
                        offset: {
                            type: '2f',
                            value: {
                                x: 0,
                                y: 0
                            }
                        },
                        mapDimensions: {
                            type: '2f',
                            value: {
                                x: 1,
                                y: 1
                            }
                        },
                        dimensions: {
                            type: '4f',
                            value: [0, 0, 0, 0]
                        },
                        LightPos: {
                            type: '3f',
                            value: [0, 1, 0]
                        }
                    });
                }
            });

            return LightingFilter;

        });
