
function Game() {
	this.actors = [];
}

Game.prototype.add = function(actor) {
	this.actors.push(actor);
};

Game.prototype.update = function() {
	for (var i = 0; i < this.actors.length; ++i) {
		this.actors[i].update();
	}
};
