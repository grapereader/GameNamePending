define(function() {

    var Inventory = Class({
        /**
            Inventory class for all things that hold items
            Namely the player and the persistent chest.
        */
        constructor: function(maxItems, items, options) {
            this.items = [];
            for (var i = 0; i < maxItems; i++) {
                if (items !== false && i < items.length) this.items.push(items[i]);
                else this.items.push(false);
            }

            this.read = options.read === undefined ? true : options.read;
            this.write = options.write === undefined ? true : options.write;
        },
        /**
            Move an item to target inventory, swapping if required and allowed
        */
        moveItem: function(srcIndex, targetInv, targetIndex) {
            if (targetIndex < 0 || targetIndex >= targetInv.items.length) return;
            if (srcIndex < 0 || srcIndex >= this.items.length) return;
            if (targetInv.write === false) return;

            var otherItem = targetInv.items[targetIndex];

            //There is an item in the target spot, but it can't be removed, so fail.
            if (otherItem !== false && !targetInv.read) return;

            targetInv.items[targetIndex] = this.items[srcIndex];
            this.items[srcIndex] = otherItem;
        }
    });

});
