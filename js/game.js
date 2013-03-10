
function Game(map) {
	this.actors = [];
	this.messages = [ "Welcome, sheriff!" ];
	this.map = map;
	this.turn = 0;
	this.time = 0;
	this.hour = 0;
	this.TURNS_PER_DAY = 480;
	this.TURN_LENGTH = 24 / this.TURNS_PER_DAY;
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
	++this.turn;
	this.time = ((this.turn + this.TURNS_PER_DAY / 2) % this.TURNS_PER_DAY) / this.TURNS_PER_DAY;
	this.hour = Math.floor(this.time * 24);

	for (var i = 0; i < this.actors.length; ++i) {
		this.actors[i].update(this);
	}
};
