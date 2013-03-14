
function Item(params) {
	this.name = params.name;
	this.tile = params.tile;
	this.space = params.space || 1;
	this.use = params.use || function() { return false; }
}

var Items = {
	bandage: new Item({
		name: "Bandage",
		tile: new ut.Tile("B", 255, 0, 0),
		space: 5,
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
		use: function(target) {
			if (!target.drawn || target.drawn.ammo == target.drawn.clipSize) return false;
			++target.drawn.ammo;
			return true;
		}
	})
};
