
function generateTown(map) {
	var tiles = map.map;
	var w = map.width;
	var h = map.height;
	var cy = Math.floor(h / 2);

	var WALL = new ut.Tile('#', 100, 100, 100);
	var DOOR = new ut.Tile('+', 110, 30, 0);
	var FLOOR = new ut.Tile('.', 150, 140, 80);
	var DIRT = new ut.Tile('.', 80, 50, 0);
	var ROAD = new ut.Tile('.', 80, 70, 50);
	var MOUNTAIN = new ut.Tile('^', 120, 120, 120);

	var r = new Alea(42);
	function rand(lo, hi) {
		return lo + Math.floor(r.random() * (hi - lo + 1));
	}

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

	// Main road
	var roadWidth = 8;
	map.fill(ROAD, 4, cy - roadWidth / 2, w - 8, roadWidth);

	// Houses
	(function() {
		var margin = 10;
		var lotSize = 15;

		function randomHouse(facing) {
			var house = {
				w: rand(8, lotSize-2),
				h: rand(8, lotSize-2),
				facing: facing
			};
			house.x = Math.floor((lotSize - house.w) / 2);
			house.y = Math.floor((lotSize - house.h) / 2);
			return house;
		}

		function createHouseFrame(house, lotX, lotY) {
			map.fill(FLOOR, lotX + house.x + 1, lotY + house.y + 1, house.w - 2, house.h - 2);
			map.border(WALL, lotX + house.x, lotY + house.y, house.w, house.h);
			var doorX = lotX + house.x + Math.floor(house.w / 2);
			var doorY = house.facing === "up" ? lotY + house.y : lotY + house.y + house.h - 1;
			tiles[doorY][doorX] = DOOR;
		}

		var houses = Math.floor((w - 2 * margin) / lotSize);
		for (var i = 0; i < houses; ++i) {
			var lotX = margin + i * lotSize;
			createHouseFrame(randomHouse("down"), lotX, cy - lotSize - roadWidth / 2 - 1);
			createHouseFrame(randomHouse("up"), lotX, cy + roadWidth / 2 + 1);
		}
	})();

	return map;
}
