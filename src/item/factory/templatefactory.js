define(function() {

    var TemplateFactory = Class({
        constructor: function() {
            //Array of objects with a rarity property of range 0 < r < 1
            //and, optionally, a use-case defined "group" property
            this.templates = [];
        },
        getAllTemplates: function(group) {
            var templates = [];
            for (var i = 0; i < this.templates.length; i++) {
                var t = this.templates[i];
                if (group in t.groups) templates.push(t);
            }
            return templates;
        },
        getTemplate: function(group) {
            var templates = this.getAllTemplates(group);
            do {
                var template = templates[Math.floor(Math.random() * templates.length)];
            } while (template.groups[group].rarity < Math.random());
            return template;
        },
        /*
            This might be something we should expect subclasses
            to implement, but I will leave this here for now...
        */
        getTemplateOfGroup: function(group) {
            var hasGroup = false;
            for (var i = 0; i < this.templates.length; i++) {
                if (this.templates[i].group === group) {
                    hasGroup = true;
                    break;
                }
            }
            if (!hasGroup) return false;

            do {
                var template = this.getTemplate();
            } while (template.group !== group);
            return template;
        }
    });

    return TemplateFactory;

});
