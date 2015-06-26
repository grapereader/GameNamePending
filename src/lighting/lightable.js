define(["lighting/filter", "lighting/filtermanager"], function(LightFilter, FilterManager) {

    var Lightable = Class({
        updateLighting: function() {
            if (this.lightingEnabled === true) {
                var lightSrc = this.gameManager.player;
                this.lightFilter.setLight(lightSrc.sx + 32, lightSrc.sy + 32);
            }
        },
        enableLighting: function(normalMap) {
            this.lightFilter = FilterManager.getFilter(normalMap);
            this.container.filters = [this.lightFilter.filter];
            this.lightingEnabled = true;
        }
    });

    return Lightable;

})
