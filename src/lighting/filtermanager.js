define(["lighting/filter"], function(LightFilter) {

    var filters = [];
    var gameManager = false;
    var uidCounter = 0;

    return {
        init: function(gm) {
            gameManager = gm;
        },
        getFilter: function(normalMap) {
            if (normalMap.uid === undefined) {
                normalMap.uid = uidCounter++;
                var filter = new LightFilter(gameManager, normalMap);
                filters.push(filter);
                return filter;
            } else {
                return filters[normalMap.uid];
            }
        },
        updateFilters: function() {
            var lightSrc = gameManager.player;
            for (var i = 0; i < filters.length; i++) {
                filters[i].setLight(lightSrc.sx + 32, lightSrc.sy + 32);
            }
        }
    }

});
