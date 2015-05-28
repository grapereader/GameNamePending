define(function() {
    /**
        All objects designed to translate around the view must extend
        this class.
    */
    var ViewObject = Class({
        constructor: function(scene) {
            this.scene = scene;

            this.x = 0;
            this.y = 0;

            this.sx = 0;
            this.sy = 0;

            this.container = new PIXI.Container();

            this.autoResize = false;
        },
        /**
            This function must be called every frame for view translation
            to work. It is the parent object's responsibility to call
            this function; no system currently exists to automate this.
        */
        update: function() {
            this.container.x = this.sx = this.x - this.scene.view.x;
            this.container.y = this.sy = this.y - this.scene.view.y;

            if (this.sx > this.scene.view.width || this.sx + this.width < 0 || this.sy > this.scene.view.height || this.sy + this.height < 0) {
                this.container.visible = false;
            } else {
                this.container.visible = true;
            }
        },
        /**
            Sets the ViewObject's size values, but not the container's.
            Setting these has no effect on graphics, but is required for
            transformation.

            These properties are a way to avoid calling the container's
            getters for its properties, as they tend to be significantly slower.
        */
        updateSize: function(w, h) {
            this.width = w;
            this.height = h;
        },
        /**
            Sets both the ViewObject's size, and the container's.
            This is the preferred method of setting ViewObject size.
        */
        setSize: function(w, h) {
            this.container.width = w;
            this.container.height = h;
            this.updateSize(w, h);
        },
        /**
            Add a GraphicsObject to this ViewObject's container.

            Will automatically update the ViewObject's size properties
            if autoResize is set (false by default)
        */
        addChild: function(child) {
            this.container.addChild(child);
            if (this.autoResize) this.updateSize(this.container.width, this.container.height);
        },

        removeChild: function(child){
            this.container.removeChild(child);
        }
    });

    return ViewObject;

});
