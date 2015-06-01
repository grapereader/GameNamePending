define(function() {
    /**
        Central abstraction around localStorage
    */

    var storage = localStorage;

    return {
        setObject: function(key, object) {
            var json = JSON.stringify(object);
            storage.setItem(key, json);
        },
        getObject: function(key) {
            var json = storage.getItem(key);
            return JSON.parse(json);
        },
        hasObject: function(key) {
            return storage.getItem(key) !== null;
        },
        removeObject: function(key) {
            storage.removeItem(key);
        }
    };
});
