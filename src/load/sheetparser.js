/*
    Original SpriteSheetParser by Chad Engler
    Modified May 1 2015 Seth Traverse
    Now uses namespaces in the global texture cache to group frames to the resource

    Namespace is just the .sheet file name without the extension.
*/
define(["../util/helpers"], function(Helpers) {

    return function (resource, next)
    {
        // skip if no data, its not json, or it isn't spritesheet data
        if (!resource.data || resource.name.indexOf(".sheet") === -1)
        {
            return next();
        }
        console.log("SheetParser: Parsing " + resource.name);
        var json = JSON.parse(resource.data);

        var loadOptions = {
            crossOrigin: resource.crossOrigin,
            loadType: PIXI.loaders.Resource.LOAD_TYPE.IMAGE
        };

        var route = resource.url.replace(this.baseUrl, '').replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '');

        var resolution = PIXI.utils.getResolutionOfUrl(resource.url);

        // load the image for this sheet
        this.add(resource.name.replace(".sheet", "") + '_image', route + '/' + json.meta.image, loadOptions, function (res) {
            resource.textures = {};

            var frames = json.frames;

            //Create namespace for this spritesheet
            var namespace = Helpers.getFileNameFromPath(resource.name).replace(".sheet", "");
            PIXI.utils.TextureCache[namespace] = {};

            for (var i in frames)
            {
                var rect = frames[i].frame;

                if (rect)
                {
                    var size = null;
                    var trim = null;

                    if (frames[i].rotated) {
                        size = new PIXI.math.Rectangle(rect.x, rect.y, rect.h, rect.w);
                    }
                    else {
                        size = new PIXI.math.Rectangle(rect.x, rect.y, rect.w, rect.h);
                    }

                    //  Check to see if the sprite is trimmed
                    if (frames[i].trimmed)
                    {
                        trim = new PIXI.math.Rectangle(
                            frames[i].spriteSourceSize.x / resolution,
                            frames[i].spriteSourceSize.y / resolution,
                            frames[i].sourceSize.w / resolution,
                            frames[i].sourceSize.h / resolution
                         );
                    }

                    // flip the width and height!
                    if (frames[i].rotated)
                    {
                        var temp = size.width;
                        size.width = size.height;
                        size.height = temp;
                    }

                    size.x /= resolution;
                    size.y /= resolution;
                    size.width /= resolution;
                    size.height /= resolution;

                    resource.textures[i] = new PIXI.Texture(res.texture.baseTexture, size, size.clone(), trim, frames[i].rotated);

                    // lets also add the frame to pixi's global cache for fromFrame and fromImage functions
                    // Modified to use namespace
                    PIXI.utils.TextureCache[namespace][i] = resource.textures[i];
                }
            }

            next();
        });
    };

});
