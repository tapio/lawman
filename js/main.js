
// Initialize stuff
(function() {
	"use strict";
	var map = new Map();
	var game = new Game(map);
	generateTown(map, game);
	map.updatePathFindingGrid();
	var pl = new Actor({
		name: "Sheriff",
		x: 6,
		y: map.height / 2,
		gender: "m",
		money: 10,
		ai: null,
		tile: new ut.Tile("@", 0, 0, 160)
	});
	pl.faction = 1; // Lawman
	var term = new ut.Viewport(document.getElementById("game"), 31, 31, "canvas", true);
	var hud = new ut.Viewport(document.getElementById("hud"), 25, 31, "canvas");
	var ui = new UI(pl);
	var eng = new ut.Engine(term, function(x, y) { return map.getTile(x, y); }, map.width, map.length);
	var fov = new FOV(term, eng);
	var menu = null;
	game.add(pl);
	var dark = new Color(0.4, 0.4, 0.4);
	var LIGHT_GRADIENT = new ColorGradient(dark, dark);
	LIGHT_GRADIENT.add(0.17, dark); // Dark until 4am
	LIGHT_GRADIENT.add(0.40, new Color(0.9, 0.9, 1.0)); // Getting lighter
	LIGHT_GRADIENT.add(0.70, new Color(1.0, 1.0, 0.9)); // Warm midday sun
	LIGHT_GRADIENT.add(0.80, new Color(0.9, 0.7, 0.7)); // Red dusk
	LIGHT_GRADIENT.add(0.87, dark); // Sun has set

	// Day-night cycle
	eng.setShaderFunc(function(tile) {
		var light = LIGHT_GRADIENT.get(game.time);
		var shaded = new ut.Tile(tile.getChar());
		// Do the blending
		shaded.r = Math.round(light.r * tile.r);
		shaded.g = Math.round(light.g * tile.g);
		shaded.b = Math.round(light.b * tile.b);
		return shaded;
	});

	// Draw viewport
	function render() {
		var i, a, len, fg, bg, tilex, tiley;
		if (menu) {
			menu.render(term);
			ui.render(hud);
			return;
		}
		var camx = clamp(pl.x - term.cx, 0, map.width - term.w);
		var camy = clamp(pl.y - term.cy, 0, map.height - term.h);
		eng.update(camx + term.cx, camy + term.cy); // Update tiles
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
		if (game.messages.length)
			term.putString(last(game.messages), 0, 0, 200, 0, 0);
		// Display time of day
		term.putString((game.hour > 12 ? (game.hour - 12) + "pm" : game.hour + "am"), 0, term.h-1, 200, 150, 0);
		term.render(); // Render
		ui.render(hud);
	}

	// A turn
	function tick() {
		game.update();
		fov.update(pl.x, pl.y); // Update field of view
		if (pl.health <= 0) game.messages.push("You died!");
		if (pl.exp >= pl.nextLevel) {
			pl.exp -= pl.nextLevel;
			pl.nextLevel *= 2;
			++pl.level;
			menu = new CharacterMenu(Actor.abilityItems, pl, 1);
		}
		render();
		game.messages = [];
	}

	// Key press handler - movement & collision handling
	ut.initInput(function(k) {
		if (pl.health <= 0) return;
		var msg = null;
		// Menu
		if (menu) {
			if (menu.action(k)) menu = null;
			render();
			return;
		}
		var movedir = { x: 0, y: 0 }; // Movement vector
		if (k === ut.KEY_LEFT || k === ut.KEY_H) movedir.x = -1;
		else if (k === ut.KEY_RIGHT || k === ut.KEY_L) movedir.x = 1;
		else if (k === ut.KEY_UP || k === ut.KEY_K) movedir.y = -1;
		else if (k === ut.KEY_DOWN || k === ut.KEY_J) movedir.y = 1;
		if (movedir.x !== 0 || movedir.y !== 0) {
			var oldx = pl.x, oldy = pl.y;
			pl.x += movedir.x;
			pl.y += movedir.y;
			if (game.interact(pl)) {
				pl.x = oldx; pl.y = oldy;
			} else if (!map.passable(pl.x, pl.y)) {
				msg = map.action(pl.x, pl.y);
				if (msg) game.messages.push(msg);
				pl.x = oldx; pl.y = oldy;
			}
			tick();
		}
		else if (k === ut.KEY_SPACE && pl.drawn && pl.drawn.ammo) {
			--pl.drawn.ammo;
			var target = game.findNearestActor(pl, -1);
			if (target && target.dist < term.cy) {
				msg = pl.shoot(target.actor);
				if (msg) game.messages.push(msg);
			} else {
				game.messages.push("You shoot in the air for fun.");
			}
			tick();
		}
		else if (k === ut.KEY_1) { pl.equip(1); tick(); }
		else if (k === ut.KEY_2) { pl.equip(2); tick(); }
		else if (k === ut.KEY_3) { pl.equip(3); tick(); }
		else if (k === ut.KEY_TAB) { menu = new CharacterMenu(Actor.abilityItems, pl, 0); render(); }
		else if (pl.use(k)) tick();
	});

	tick();
})();
