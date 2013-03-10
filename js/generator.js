
function generateTown(map) {
	var tiles = map.map;
	var w = map.width;
	var h = map.height;

	var WALL = new ut.Tile('#', 100, 100, 100);
	var FLOOR = new ut.Tile('.', 50, 50, 50);
	var DIRT = new ut.Tile('.', 80, 80, 50);
	var MOUNTAIN = new ut.Tile('^', 120, 120, 120);

	var r = new Alea(42);

	// Fill with dirt
	map.fill(DIRT, 0, 0, w, h);
	// Borders
	(function() {
		map.border(MOUNTAIN, 0, 0, w, h);
		for (var j = 0; j < h; ++j) {
			if (r.random() > 0.33) tiles[j][1] = MOUNTAIN;
			if (r.random() > 0.33) tiles[j][w-2] = MOUNTAIN;
			if (r.random() > 0.66) tiles[j][2] = MOUNTAIN;
			if (r.random() > 0.66) tiles[j][w-3] = MOUNTAIN;
		}
		for (var i = 0; i < w; ++i) {
			if (r.random() > 0.33) tiles[1][i] = MOUNTAIN;
			if (r.random() > 0.33) tiles[h-2][i] = MOUNTAIN;
			if (r.random() > 0.66) tiles[2][i] = MOUNTAIN;
			if (r.random() > 0.66) tiles[h-3][i] = MOUNTAIN;
		}
	})();

	return map;
}
