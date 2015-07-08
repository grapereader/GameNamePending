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
                filter.initializeLights(gameManager.lightSystem);
                return filter;
            } else {
                return filters[normalMap.uid];
            }
        },
        updateFilters: function() {
            var lightSrc = gameManager.player;
            for (var i = 0; i < filters.length; i++) {
                filters[i].updateLights(gameManager.lightSystem);
            }
        },
        initializeFilters: function() {
            for (var i = 0; i < filters.length; i++) {
                filters[i].initializeLights(gameManager.lightSystem);
            }
        }
    };

});
