define(["entity/entity", "util/helpers", "util/anim", "inv/inventory", "util/timer","tile/tile","tile/wall","tile/path","tile/door","tile/chest","tile/torch"], function(Entity, Helpers, Animation, Inventory, Timer, Tile, Wall, Path, Door, Chest, Torch) {

    var Player = Class(Entity, {
        constructor: function(gameManager, saveData) {
            Player.$super.call(this, gameManager);

            this.inventory = new Inventory(16, saveData.inventory, {});

            this.sprites = {
                "base": Helpers.createSprite(),
                "hands": Helpers.createSprite(),
                "legs": Helpers.createSprite(),
                "chest": Helpers.createSprite(),
                "head": Helpers.createSprite(),
                "feet": Helpers.createSprite(),
                "item": Helpers.createSprite()
            };

            this.x = 64;
            this.y = 64;

            this.health = 200; //Temp health

            this.canAttack = true;

            for (s in this.sprites) {
                this.addChild(this.sprites[s]);
            }
            this.setSize(64, 64);

            this.walkSpeed = 250;

            var standSpeed = 2;
            var actionSpeed = 10;
            var anims = {
                "stand-left": Helpers.animBuilder("stand-left", 2, standSpeed),
                "stand-right": {flip: "stand-left"},
                "stand-up" : Helpers.animBuilder("stand-up", 2, standSpeed),
                "stand-down": Helpers.animBuilder("stand-down", 2, standSpeed),

                "use-left": Helpers.animBuilder("use-left", 4, actionSpeed, false),
                "use-right": {flip: "use-left"},
                "use-up": Helpers.animBuilder("use-up", 4, actionSpeed, false),
                "use-down": Helpers.animBuilder("use-down", 4, actionSpeed, false),

                "walk-left" : Helpers.animBuilder("walk-left", 4, actionSpeed),
                "walk-right" : {flip: "walk-left"},
                "walk-up" : Helpers.animBuilder("walk-up", 4, actionSpeed),
                "walk-down" : Helpers.animBuilder("walk-down", 4, actionSpeed)
            };

            var testWeapon = gameManager.itemManager.generateWeapon();
            this.animGroup.addAnimationLayer(new Animation(testWeapon.framesNamespace, anims, this.sprites["item"]));

            for (var i = 0; i < this.inventory.items.length; i++) {
                this.inventory.items[i] = testWeapon;
            }

            this.animGroup.addAnimationLayer(new Animation("male-race-1", anims, this.sprites["base"]));
            this.animGroup.setAnimation("stand-down");

            var self = this;

            //Attack cooldown timer speed will need to be adjusted on weapon equip
            this.attackCooldownTimer = new Timer(500, false, function() {
                self.canAttack = true;
            });
            this.attackCooldownTimer.started = false;
        },
        setLocation: function(x,y){
            this.x = x;
            this.y = y;
            this.gameManager.scene.view.setLocation(
                this.x + (this.width / 2) - this.gameManager.game.gameWidth / 2,
                this.y + (this.height / 2) - this.gameManager.game.gameHeight / 2
            );
        },
        update: function() {
            Player.$superp.update.call(this);

            var delta = this.gameManager.game.deltaTime;
            var keys = this.gameManager.game.keymap;

            if (keys.isKeyDown("attack") && this.canAttack) {
                this.canAttack = false;
                this.attackCooldownTimer.started = true;
                switch (this.dir) {
                    case 0: this.animGroup.setAnimation("use-right");
                        break;
                    case 1: this.animGroup.setAnimation("use-left");
                        break;
                    case 2: this.animGroup.setAnimation("use-down");
                        break;
                    case 3: this.animGroup.setAnimation("use-up");
                        break;
                }
                this.animGroup.locked = true;
                this.attacking = true;
            }

            if (this.attacking && this.animGroup.isFinished()) {
                this.animGroup.locked = false;
                this.attacking = false;
                this.updateAnim(this.dx, this.dy);
            }

            this.attackCooldownTimer.update(delta);

            var dx = 0;
            var dy = 0;
            if (keys.isKeyDown("move.up")) dy = -this.walkSpeed;
            if (keys.isKeyDown("move.down")) dy = this.walkSpeed;
            if (keys.isKeyDown("move.left")) dx = -this.walkSpeed;
            if (keys.isKeyDown("move.right")) dx = this.walkSpeed;

            if (dx !== 0 && dy !== 0) {
                //Makes hypotenusal speed the same as leg speed
                dx /= 1.41;
                dy /= 1.41;
            }

            var grid = this.gameManager.board.grid;

            var currentX = Math.round((this.x / 64));
            var currentY = Math.round((this.y / 64));
            var left = Math.ceil(this.x / 64)-1;
            var right = Math.floor(this.x / 64) + 1;
            var top = Math.ceil(this.y / 64) - 1;
            var bot = Math.floor(this.y / 64) + 1;
            var LEVELEDITING = false;
            if(LEVELEDITING){
                if (keys.isKeyDown("debug.Tile")) this.gameManager.board.setTile(currentX,currentY,new Tile(this.gameManager));
                if (keys.isKeyDown("debug.Wall")) this.gameManager.board.setTile(currentX,currentY,new Wall(this.gameManager));
                if (keys.isKeyDown("debug.Path")) this.gameManager.board.setTile(currentX,currentY,new Path(this.gameManager));
                if (keys.isKeyDown("debug.Door")) this.gameManager.board.setTile(currentX,currentY,new Door(this.gameManager));
                if (keys.isKeyDown("debug.Chest")) this.gameManager.board.setTile(currentX,currentY,new Chest(this.gameManager));
                if (keys.isKeyDown("debug.Torch")) this.gameManager.board.setTile(currentX,currentY,new Torch(this.gameManager));
                if (keys.isKeyDown("debug.Export")){      
                    var greatestX = 68;
                    var greatestY = 68;

                    for(var i = 68; i < 81; i++){
                        for(var j = 68; j < 81; j++){
                            if(this.gameManager.board.grid[i][j].tileType!="Empty"){
                                greatestX = Math.max(greatestX,i);
                                greatestY = Math.max(greatestY,j);
                            }
                        }
                    }

                    var output = "[";         
                    for(var i = 68; i <= greatestX; i++){
                        output += "[";
                        for(var j = 68; j <= greatestY; j++){
                            output += "\""+this.gameManager.board.grid[i][j].tileType+"\"";
                            if(j!=greatestY){
                                output += ",";
                            }
                        }
                        output += "]";
                        if(i!=greatestX){
                            output += ",";
                        }
                        else{
                            output += "\n";
                        }
                    }
                    output += "]";        
                    window.prompt("Copy to clipboard: Ctrl+C, Enter", output);
                } 
                if (keys.isKeyDown("debug.Clear")){      
                    for(var i = 68; i < 81; i++){
                        for(var j = 68; j < 81; j++){
                            this.gameManager.board.setTile(i,j,new Tile(this.gameManager));
                        }
                    }
                }
            }
            else{
                if (grid[currentX][top].clipping && dy < 0) dy = 0;
                if (grid[currentX][bot].clipping && dy > 0) dy = 0;
                if (grid[left][currentY].clipping && dx < 0) dx = 0;
                if (grid[right][currentY].clipping && dx > 0) dx = 0;
            }

            this.walk(dx, dy);

            this.gameManager.scene.view.move(
                this.x + (this.width / 2) - this.gameManager.game.gameWidth / 2,
                this.y + (this.height / 2) - this.gameManager.game.gameHeight / 2
            );
        },
        attack: function(damage) {
            //TODO Affixes and defense handled here before calling super
            Player.$superp.attack.call(this, damage);
        }
    });

    return Player;

});
