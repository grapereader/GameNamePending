define(["save/storage"], function(Storage) {

    var SaveManager = Class({
        constructor: function() {
            if (Storage.hasObject("saves")) {
                this.saves = Storage.getObject("saves");
            } else {
                this.saves = [];
            }
            console.log("Save manager initialized");
        },
        addSave: function(save) {
            this.saves.push(save);
            this.save();
        },
        removeSave(save) {
            this.saves.splice(this.saves.indexOf(save), 1);
            this.save();
        },
        save: function() {
            Storage.setObject("saves", this.saves);
        }
    });

    return SaveManager;

});