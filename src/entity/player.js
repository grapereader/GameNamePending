define(["entity/entity", "util/helpers", "util/anim", "inv/inventory", "util/timer", "debug/editor", "item/item", "item/armour"], function(Entity, Helpers, Animation, Inventory, Timer, Editor, Item, Armour) {

    var Player = Class(Entity, {
        constructor: function(gameManager, saveData) {
            Player.$super.call(this, gameManager);

            this.inventory = new Inventory(16, saveData.inventory, {});

            var shadowGraphics = new PIXI.Graphics();
            shadowGraphics.beginFill(0x0, 0.07);
            for (var i = 0; i < 16; i++) {
                shadowGraphics.drawEllipse(32, 48, i, (i / 16) * 10);
            }
            shadowGraphics.endFill();
            this.addChild(shadowGraphics);

            this.sprites = {
                "base": Helpers.createSprite(),
                "hands": Helpers.createSprite(),
                "legs": Helpers.createSprite(),
                "chest": Helpers.createSprite(),
                "head": Helpers.createSprite(),
                "feet": Helpers.createSprite(),
                "item": Helpers.createSprite()
            };

            this.equips = saveData.equips;
            this.equipAnims = {};

            this.x = 64;
            this.y = 64;

            this.health = 200; //Temp health

            for (s in this.sprites) {
                this.addChild(this.sprites[s]);
            }
            this.setSize(64, 64);

            this.walkSpeed = 250;

            //Debug editor
            this.editor = new Editor(gameManager);

            var standSpeed = 2;
            var actionSpeed = 10;
            this.animData = {
                "stand-left": Helpers.animBuilder("stand-left", 2, standSpeed),
                "stand-right": {
                    flip: "stand-left"
                },
                "stand-up": Helpers.animBuilder("stand-up", 2, standSpeed),
                "stand-down": Helpers.animBuilder("stand-down", 2, standSpeed),

                "use-left": Helpers.animBuilder("use-left", 4, actionSpeed, false),
                "use-right": {
                    flip: "use-left"
                },
                "use-up": Helpers.animBuilder("use-up", 4, actionSpeed, false),
                "use-down": Helpers.animBuilder("use-down", 4, actionSpeed, false),

                "walk-left": Helpers.animBuilder("walk-left", 4, actionSpeed),
                "walk-right": {
                    flip: "walk-left"
                },
                "walk-up": Helpers.animBuilder("walk-up", 4, actionSpeed),
                "walk-down": Helpers.animBuilder("walk-down", 4, actionSpeed)
            };
            this.animGroup.addAnimationLayer(new Animation("male-race-1", this.animData, this.sprites["base"]));

            var self = this;

            //Attack cooldown timer speed will need to be adjusted on weapon equip
            this.attackCooldownTimer = new Timer(500, false, function() {
                self.canAttack = true;
            });
            this.attackCooldownTimer.started = false;
            this.canAttack = true;

            var testGroups = ["weapon", "armourHead", "armourChest", "armourLegs", "armourBoots", "armourGloves"];
            for (var i = 0; i < testGroups.length; i++) {
                var item = this.gameManager.itemFactory.getItem(testGroups[i]);
                this.inventory.addItem(item);
                this.equipItem(item);
            }

            this.animGroup.setAnimation("stand-down");

            var board = this.gameManager.board;
            board.container.interactive = true;
            board.container.on("mousemove", function(e) {
                var angle = self.getAngle(e.data.global.x, e.data.global.y);
                if (angle < (1 * Math.PI) / 4 || angle > (7 * Math.PI) / 4) self.dir = 0;
                else if (angle < (3 * Math.PI) / 4 && angle > (1 * Math.PI) / 4) self.dir = 2;
                else if (angle < (5 * Math.PI) / 4 && angle > (3 * Math.PI) / 4) self.dir = 1;
                else if (angle < (7 * Math.PI) / 4 && angle > (5 * Math.PI) / 4) self.dir = 3;
                self.updateAnim();
            });

            board.container.on("mousedown", function(e) {
                self.mouseDown = true;
            });

            board.container.on("mouseup", function(e) {
                self.mouseDown = false;
            });

            board.container.on("mouseout", function(e) {
                self.mouseDown = false;
            });
        },
        /**
            Given a position in screen space, returns an angle relative to the player.
        */
        getAngle: function(x, y) {
            var gameHeight = this.gameManager.game.gameHeight;
            var gameWidth = this.gameManager.game.gameWidth;

            var playerX = this.sx;
            var playerY = this.sy;

            var translateY = gameHeight / 2 - (playerY + 32);
            var translateX = gameWidth / 2 - (playerX + 32);

            var centeredX = x - (gameWidth / 2) + translateX;
            var centeredY = y - (gameHeight / 2) + translateY;

            var angle = Math.atan(centeredY / centeredX);
            if (centeredX < 0) angle += Math.PI;
            else if (centeredX > 0 && centeredY < 0) angle += Math.PI * 2;
            return angle;
        },
        setLocation: function(x, y) {
            this.x = x;
            this.y = y;
            this.gameManager.scene.view.setLocation(
                this.x + (this.width / 2) - this.gameManager.game.gameWidth / 2,
                this.y + (this.height / 2) - this.gameManager.game.gameHeight / 2
            );
        },
        updateDir: function() {},
        equipItem: function(item) {
            var location = false;
            if (item.type === Item.TYPES.WEAPON) {
                location = "item"
            } else {
                location = Armour.EQUIP[item.armourType];
            }

            if (this.equipAnims[location] !== undefined) {
                this.animGroup.removeAnimationLayer(this.equipAnims[location]);
            }

            this.equips[location] = item;

            var anim = new Animation(item.framesNamespace, this.animData, this.sprites[location]);
            this.equipAnims[location] = anim;
            this.animGroup.addAnimationLayer(anim);

            this.sprites[location].visible = true;

            if (item.type === Item.TYPES.WEAPON) {
                var spd = (1000 * (item.attackSpeed / 4)) / 2;
                var dirs = ["left", "right", "up", "down"];
                for (var i = 0; i < dirs.length; i++) {
                    this.animGroup.setSpeed("use-" + dirs[i], spd);
                }
                this.attackCooldownTimer.period = item.attackSpeed * 1000;
            }
            console.log("Equipped item " + item.name);
        },
        unEquipItem: function(item) {
            for (e in this.equips) {
                if (this.equips[e] === item) {
                    this.equips[e] = false;
                    this.sprites[e].visible = false;
                    break;
                }
            }
        },
        isEquipped: function(item) {
            for (e in this.equips) {
                if (this.equips[e] === item) return true;
            }
            return false;
        },
        update: function() {
            Player.$superp.update.call(this);

            var delta = this.gameManager.game.deltaTime;
            var keys = this.gameManager.game.keymap;

            this.updateAttack(keys, delta);
            this.updateMovement(keys);
        },
        updateAttack: function(keys, delta) {
            var item = this.equips.item;
            if (this.mouseDown && this.canAttack && item !== false) {
                this.canAttack = false;
                this.attackCooldownTimer.started = true;
                if (this.dir === 0) this.animGroup.setAnimation("use-right");
                if (this.dir === 1) this.animGroup.setAnimation("use-left");
                if (this.dir === 2) this.animGroup.setAnimation("use-down");
                if (this.dir === 3) this.animGroup.setAnimation("use-up");
                this.animGroup.locked = true;
                this.attacking = true;

                for (var x = -1; x <= 1; x++) {
                    for (var y = -1; y <= 1; y++) {
                        var mapX = x + this.tileX;
                        var mapY = y + this.tileY;
                        var enemies = this.gameManager.board.getEnemiesAt(mapX, mapY);
                        for (var i = 0; i < enemies.length; i++) {
                            var enemy = enemies[i];
                            var xDiff = enemy.x - this.x;
                            var yDiff = enemy.y - this.y;
                            var dist = Math.sqrt((xDiff * xDiff) + (yDiff * yDiff));

                            if (dist <= item.range) {
                                enemies[i].attack(this.equips.item.damage);
                            }
                        }
                    }
                }
            }

            if (this.attacking && this.animGroup.isFinished()) {
                this.animGroup.locked = false;
                this.attacking = false;
                this.updateAnim(this.dx, this.dy);
            }

            this.attackCooldownTimer.update(delta);
        },
        updateMovement: function(keys) {
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
            var left = Math.ceil(this.x / 64) - 1;
            var right = Math.floor(this.x / 64) + 1;
            var top = Math.ceil(this.y / 64) - 1;
            var bot = Math.floor(this.y / 64) + 1;
            var LEVELEDITING = true;
            if (LEVELEDITING) {
                this.editor.update(currentX, currentY);
            } else {
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
        getArmourValue: function() {
            var armourValue = 0;
            for (var i in this.equips) {
                var item = this.equips[i];
                if (item.type === Item.TYPES.ARMOUR) {
                    var boostPerc = 100;
                    var boostVal = 0;
                    for (var a = 0; a < item.affixes.length; a++) {
                        var affix = item.affixes[a];
                        if (affix.buffs.armour !== undefined) {
                            var armour = affix.buffs.armour;
                            if (armour.type === "%") {
                                boostPerc += armour.val;
                            } else {
                                //Perhaps all affixes should just be percent.
                                //It doesn't make sense for fixed values when every run
                                //the values needed increase...
                                boostVal += armour.val;
                            }
                        }
                    }
                    armourValue += item.armour * (1 + (100 / boostPerc)) + boostVal;
                }
            }
            return armourValue;
        },
        attack: function(damage) {
            /*
                This could be a decent way to calculate defense.
                Each armour value giving some % chance to reduce damage by 1?
            */
            var armour = Math.floor(this.getArmourValue());
            for (var i = 0; i < armour; i++) {
                if (Math.random() < 0.1) {
                    damage -= 1;
                }
            }
            Player.$superp.attack.call(this, damage);
        }
    });

    return Player;

});
