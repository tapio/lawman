
// Initialize stuff
(function() {
	"use strict";
	var map = new Map();
	var game = new Game(map);
	generateTown(map, game);
	var pl = new Actor({ name: "Sheriff", x: 6, y: map.height / 2, ai: null });
	var term = new ut.Viewport(document.getElementById("game"), 41, 31, "auto", true);
	var eng = new ut.Engine(term, function(x, y) { return map.getTile(x, y); }, map.width, map.length);
	var fov = new FOV(term, eng);
	game.add(pl);
	var turn = 0;

	// "Main loop"
	function tick() {
		++turn;
		var i, a, len, fg, bg, tilex, tiley;
		game.update();
		var camx = clamp(pl.x - term.cx, 0, map.width - term.w);
		var camy = clamp(pl.y - term.cy, 0, map.height - term.h);
		fov.update(pl.x, pl.y); // Update field of view
		eng.update(camx + term.cx, camy + term.cy); // Update tiles
		if (game.messages.length)
			term.putString(last(game.messages), 0, 0, 200, 0, 0);
		// Actors
		len = game.actors.length;
		for (i = 0; i < len; ++i) {
			a = game.actors[i];
			if (a !== pl && !fov.visible(a.x, a.y)) continue;
			tilex = a.x - camx;
			tiley = a.y - camy;
			fg = a.tile; // Actor tile
			bg = term.get(tilex, tiley).getBackgroundJSON(); // Background color
			term.put(new ut.Tile(fg.ch, fg.r, fg.g, fg.b, bg.r, bg.g, bg.b), tilex, tiley);
		}
		term.render(); // Render
		game.messages = [];
	}

	// Key press handler - movement & collision handling
	ut.initInput(function(k) {
		var movedir = { x: 0, y: 0 }; // Movement vector
		if (k === ut.KEY_LEFT || k === ut.KEY_H) movedir.x = -1;
		else if (k === ut.KEY_RIGHT || k === ut.KEY_L) movedir.x = 1;
		else if (k === ut.KEY_UP || k === ut.KEY_K) movedir.y = -1;
		else if (k === ut.KEY_DOWN || k === ut.KEY_J) movedir.y = 1;
		if (movedir.x === 0 && movedir.y === 0) return;
		var oldx = pl.x, oldy = pl.y;
		pl.x += movedir.x;
		pl.y += movedir.y;
		if (game.interact(pl)) {
			pl.x = oldx; pl.y = oldy;
		} else if (!map.passable(pl.x, pl.y)) {
			var msg = map.action(pl.x, pl.y);
			if (msg) game.messages.push(msg);
			pl.x = oldx; pl.y = oldy;
		}
		tick();
	});

	tick();
})();

