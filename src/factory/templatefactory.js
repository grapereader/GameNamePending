define(function() {

    var TemplateFactory = Class({
        constructor: function() {
            //Array of objects with a rarity property of range 0 < r < 1
            //and, optionally, a use-case defined "group" property
            this.templates = [];
        },
        /**
            Gets templates whos groups fit into set of confines.
            Confines can either be a single string, or an array of strings
        */
        getAllTemplates: function(confines) {
            if (typeof confines === "string") confines = [confines];
            var templates = [];
            for (var i = 0; i < this.templates.length; i++) {
                var t = this.templates[i];
                var confined = true;
                var rarity = 0;
                for (var j = 0; j < confines.length; j++) {
                    var group = confines[j];
                    if (!(group in t.groups)) {
                        confined = false;
                        break;
                    }
                    //We set the template's confined rarity to the max of all confines,
                    //since further confines are already restricting the list of
                    //available templates.
                    if (t.groups[group] > rarity) rarity = t.groups[group];
                }
                t.confinedRarity = rarity;
                if (confined) templates.push(t);
            }
            return templates;
        },
        getTemplate: function(confines) {
            var templates = this.getAllTemplates(confines);
            do {
                var template = templates[Math.floor(Math.random() * templates.length)];
            } while (template.confinedRarity < Math.random());
            return template;
        }
    });

    return TemplateFactory;

});
