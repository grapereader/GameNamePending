define(function() {

    var Cullable = Class({
        cull: function() {
            if (this.container !== undefined) {
                if (this.sx > this.scene.view.width || this.sx + this.width < 0 || this.sy > this.scene.view.height || this.sy + this.height < 0) {
                    this.container.visible = false;
                } else {
                    this.container.visible = true;
                }
            }
        }
    });

    return Cullable;

})
