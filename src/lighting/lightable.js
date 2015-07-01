define(["lighting/filter", "lighting/filtermanager"], function(LightFilter, FilterManager) {

    var Lightable = Class({
        enableLighting: function(normalMap) {
            this.lightFilter = FilterManager.getFilter(normalMap);
            this.container.filters = [this.lightFilter.filter];
            this.lightingEnabled = true;
        }
    });

    return Lightable;

})
