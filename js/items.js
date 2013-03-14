
function Item(params) {
	this.name = params.name;
	this.price = params.price;
	this.tile = params.tile;
	this.space = params.space || 1;
	this.service = params.service || false;
	this.use = params.use || function() { return false; };
	this.useCond = params.useCond || function() { return true; };
	this.useText = params.useText || ("Use " + this.name.toLowerCase());
	this.button = params.button;
}

var Items = {
	doctor: new Item({
		name: "Heal wounds",
		service: true,
		price: 10,
		useCond: function(target) {
			return target.health < target.maxHealth;
		},
		use: function(target) {
			target.health = target.maxHealth;
		}
	}),
	bandage: new Item({
		name: "Bandage",
		tile: new ut.Tile("B", 255, 0, 0),
		price: 5,
		space: 6,
		useCond: function(target) {
			return target.health < target.maxHealth;
		},
		use: function(target) {
			target.health += 3;
			if (target.health > target.maxHealth) target.health = target.maxHealth;
		},
		button: ut.KEY_B
	}),
	gunAmmo: new Item({
		name: "Bullet",
		tile: new ut.Tile("✒", 100, 80, 60),
		price: 1,
		useCond: function(target) {
			return target.drawn && target.drawn.ammo < target.drawn.clipSize;
		},
		use: function(target) {
			++target.drawn.ammo;
		},
		useText: "Reload one",
		button: ut.KEY_R
	}),
	gunCylinder: new Item({
		name: "Cylinder (6 bullets)",
		tile: new ut.Tile("❇", 100, 80, 60),
		price: 8,
		space: 6,
		useCond: function(target) {
			return target.drawn && target.drawn.ammo < target.drawn.clipSize;
		},
		use: function(target) {
			target.drawn.ammo = Math.min(target.drawn.clipSize, target.drawn.ammo + 6);
		},
		useText: "Reload cylinder",
		button: ut.KEY_C
	})
};
