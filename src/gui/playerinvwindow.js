define(["gui/inventory", "gui/window"], function(InventoryScreen, Window) {

    var PlayerInventoryWindow = Class(Window, {
        constructor: function(gameManager) {
            PlayerInventoryWindow.$super.call(this, gameManager, 300, 300, "Inventory");

            var player = gameManager.player;

            var invScreen = new InventoryScreen(gameManager, player.inventory);
            this.addChild(invScreen);

            invScreen.itemActivate = function(item) {
                if (player.isEquipped(item)) {
                    player.unEquipItem(item);
                } else {
                    player.equipItem(item);
                }
            };
        }
    });

    return PlayerInventoryWindow;

});
