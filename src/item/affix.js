define(function() {

    var Affix = Class({
        constructor: function(name, description, data) {
            this.name = name;
            this.description = description;
            this.data = data;
        }
    });

    Affix.TYPES = {
        ANY: 0,
        WEAPON: 1,
        ARMOUR: 2
    };

    return Affix;

});
