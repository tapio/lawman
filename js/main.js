
// Initialize stuff
(function() {
	"use strict";
	var pl = new Actor({ x: 3, y: 2 });
	var map = generateTown(new Map());
	var term = new ut.Viewport(document.getElementById("game"), 41, 31, "auto", true);
	var eng = new ut.Engine(term, function(x, y) { return map.getTile(x, y); }, map.width, map.length);
	var fov = new FOV(term, eng);
	var game = new Game();

	// "Main loop"
	function tick() {
		game.update();
		fov.update(pl.x, pl.y); // Update field of view
		eng.update(pl.x, pl.y); // Update tiles
		term.put(pl.tile, term.cx, term.cy); // Player character
		term.render(); // Render
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
		if (eng.tileFunc(pl.x, pl.y).getChar() !== '.') { pl.x = oldx; pl.y = oldy; }
		tick();
	});

	window.setInterval(tick, 50); // Animation
})();

