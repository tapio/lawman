
function Item(params) {
	this.name = params.name;
	this.price = params.price || 1;
	this.tile = params.tile;
	this.space = params.space || 1;
	this.use = params.use || function() { return false; };
	this.service = params.service || false;
}

var Items = {
	doctor: new Item({
		name: "Heal wounds",
		service: true,
		price: 10,
		use: function(target) {
			target.health = target.maxHealth;
			return true;
		}
	}),
	bandage: new Item({
		name: "Bandage",
		tile: new ut.Tile("B", 255, 0, 0),
		price: 5,
		space: 6,
		use: function(target) {
			if (target.health == target.maxHealth) return false;
			target.health += 3;
			if (target.health > target.maxHealth) target.health = target.maxHealth;
			return true;
		}
	}),
	gunAmmo: new Item({
		name: "Bullet",
		tile: new ut.Tile("✒", 100, 80, 60),
		price: 1,
		use: function(target) {
			if (!target.drawn || target.drawn.ammo == target.drawn.clipSize) return false;
			++target.drawn.ammo;
			return true;
		}
	}),
	gunCylinder: new Item({
		name: "Cylinder (6 bullets)",
		tile: new ut.Tile("❇", 100, 80, 60),
		price: 8,
		space: 6,
		use: function(target) {
			if (!target.drawn || target.drawn.ammo == target.drawn.clipSize) return false;
			target.drawn.ammo = Math.min(target.drawn.clipSize, target.drawn.ammo + 6);
			return true;
		}
	})
};
