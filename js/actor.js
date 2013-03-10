
function Actor(params) {
	this.x = params.x || 0;
	this.y = params.y || 0;
	this.health = 100;
	this.tile = new ut.Tile("@", 0, 0, 128);
}

Actor.prototype.update = function() {

};
