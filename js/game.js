
function Game(map) {
	this.actors = [];
	this.messages = [ "Welcome, sheriff!" ];
	this.map = map;
	this.turn = 0;
	this.time = 0;
	this.hour = 0;
	this.TURNS_PER_DAY = 480;
	this.TURN_LENGTH = 24 / this.TURNS_PER_DAY;
	this.banditTurn = 10 + Math.floor(RNG.random() * 10);
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

Game.prototype.findNearestActor = function(searcher, faction) {
	var min_d = Infinity;
	var closest = null;
	for (var i = 0; i < this.actors.length; ++i) {
		var actor = this.actors[i];
		if (actor === searcher) continue;
		var d = distance2(searcher.x, searcher.y, actor.x, actor.y);
		if (d < min_d) {
			if (faction === undefined || actor.faction === faction) {
				closest = actor;
				min_d = d;
			}
		}
	}
	if (closest) return { dist: Math.sqrt(min_d), actor: closest };
	else return null;
};

Game.prototype.update = function() {
	++this.turn;
	this.time = ((this.turn + this.TURNS_PER_DAY / 2) % this.TURNS_PER_DAY) / this.TURNS_PER_DAY;
	this.hour = Math.floor(this.time * 24);

	// Spawn bandits?
	if (this.turn == this.banditTurn) {
		this.banditTurn += 100 + Math.floor(RNG.random() * 100);
		// TODO: Proper location picking
		var x = 3 + Math.floor(RNG.random() * (this.map.width - 6));
		var y = 3 + Math.floor(RNG.random() * (this.map.height - 6));
		this.add(new Actor({
			x: x,
			y: y,
			gender: "m",
			job: "Bandit",
			hostile: true
		}));
		console.log("Spawned bandit to ", x, y);
	}

	// Update actors
	for (var i = 0; i < this.actors.length; ++i) {
		this.actors[i].update(this);
	}
};
