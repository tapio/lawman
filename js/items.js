
function Item(params) {
	this.name = params.name;
	this.tile = params.tile;
	this.space = params.space || 1;
}

Item.prototype.clone = function() {
	return new Item(this);
};

var Items = {
	bandage: new Item({
		name: "Bandage",
		tile: new ut.Tile("B", 255, 0, 0),
		space: 5
	}),
	gunAmmo: new Item({
		name: "Bullet",
		tile: new ut.Tile("✒", 100, 80, 60)
	})
};
