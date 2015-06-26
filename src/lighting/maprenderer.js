/**
    System for rendering all normal maps to a RenderTexture
    then giving that texture to a single normal map filter.

    Doesn't work. Keeping just in case...
*/

define(["lighting/filter"], function(LightFilter) {

    var container = new PIXI.Container();
    var gameManager = false;
    var mapTexture = false;
    var filter = false;

    return {
        init: function(gm) {
            gameManager = gm;

            var game = gameManager.game;
            mapTexture = new PIXI.RenderTexture(game.renderer, game.gameWidth, game.gameHeight);

            filter = new LightFilter(gameManager, mapTexture);
            gameManager.scene.root.filters = [filter.filter];
        },
        addObject: function(object) {
            container.addChild(object);
        },
        removeObject: function(object) {
            container.removeChild(object);
        },
        renderMap: function() {
            mapTexture.render(container);
        },
        updateFilter: function() {
            var lightSrc = gameManager.player;
            filter.setLight(lightSrc.sx + 32, lightSrc.sy + 32);
        }
    }

});
