
function Game() {
	this.actors = [];
	this.messages = [ "Welcome, sheriff!" ];
}

Game.prototype.add = function(actor) {
	this.actors.push(actor);
};

Game.prototype.interact = function(pl) {
	for (var i = 0; i < this.actors.length; ++i) {
		var actor = this.actors[i];
		if (actor !== pl && actor.x == pl.x && actor.y == pl.y) {
			this.messages.push(actor.name);
			return true;
		}
	}
	return false;
};

Game.prototype.update = function() {
	for (var i = 0; i < this.actors.length; ++i) {
		this.actors[i].update();
	}
};
