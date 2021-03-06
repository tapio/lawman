
function generateTown(map, game) {
	var tiles = map.map;
	var w = map.width;
	var h = map.height;
	var cy = Math.floor(h / 2);

	var r = new Alea();
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
	var roadWidth = 6;
	map.fill(ROAD, 4, cy - roadWidth / 2, w - 8, roadWidth);

	// Houses
	(function() {
		var margin = 10;
		var lotSize = 16;

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

		function addCloset(x1, y1, x2, y2, amount) {
			while (amount) {
				var x = rand(x1, x2);
				var y = rand(y1, y2);
				if (tiles[y-1][x] == WALL || tiles[y+1][x] == WALL || tiles[y][x-1] == WALL || tiles[y][x+1] == WALL) {
					tiles[y][x] = CLOSET;
					--amount;
				}
			}
		}

		function addTableGroup(x1, y1, x2, y2, amount) {
			while (amount) {
				var x = rand(x1+1, x2-1);
				var y = rand(y1+1, y2-1);
				tiles[y][x] = TABLE;
				if (RNG.random() < 0.4) tiles[y-1][x] = CHAIR;
				if (RNG.random() < 0.4) tiles[y+1][x] = CHAIR;
				if (RNG.random() < 0.4) tiles[y][x-1] = CHAIR;
				if (RNG.random() < 0.4) tiles[y][x+1] = CHAIR;
				--amount;
			}
		}

		function createHouseFrame(house, lotX, lotY, type) {
			var x1 = lotX + house.x, x2 = lotX + house.x + house.w - 1;
			var y1 = lotY + house.y, y2 = lotY + house.y + house.h - 1;
			map.fill(FLOOR, x1 + 1, y1 + 1, house.w - 2, house.h - 2);
			map.border(WALL, x1, y1, house.w, house.h);
			// Door
			var doorX = lotX + house.x + Math.floor(house.w / 2);
			var doorY = house.facing === "up" ? lotY + house.y : lotY + house.y + house.h - 1;
			tiles[doorY][doorX] = DOOR;
			// Windows & outside barrels
			for (var i = x1 + 1; i < x2; ++i) { // horizontal
				if (i == doorX) continue;
				if (rand(1,10) == 1) tiles[y1][i] = WINDOW_H;
				if (rand(1,10) == 1) tiles[y2][i] = WINDOW_H;
				if (rand(1,20) == 1) tiles[y1-1][i] = BARREL;
				if (rand(1,20) == 1) tiles[y2+1][i] = BARREL;
			}
			for (var j = y1 + 1; j < y2; ++j) { // vertical
				if (rand(1,10) == 1) tiles[j][x1] = WINDOW_V;
				if (rand(1,10) == 1) tiles[j][x2] = WINDOW_V;
				if (rand(1,20) == 1) tiles[j][x1-1] = BARREL;
				if (rand(1,20) == 1) tiles[j][x2+1] = BARREL;
			}
			// Furnitures
			++x1; ++y1; --x2; --y2;
			if (type == "house") {
				addTableGroup(x1, y1, x2, y2, rand(1,2));
				addCloset(x1, y1, x2, y2, rand(1,3));
			} else if (type == "gunstore") {
				addCloset(x1, y1, x2, y2, rand(6,9));
			} else if (type == "doctors") {
				addCloset(x1, y1, x2, y2, rand(4,6));
			} else if (type == "saloon") {
				addTableGroup(x1, y1, x2, y2, rand(4,7));
			}
		}

		var places = [ "doctor", "gunstore", "sheriff", "saloon", "church" ];
		var numHouses = Math.floor((w - 2 * margin) / lotSize);
		var i;
		for (i = places.length; i < numHouses * 2; ++i)
			places.push("house");

		for (i = 0; i < numHouses; ++i) {
			var lotX = margin + i * lotSize;
			// Top house
			var lotY = cy - lotSize - roadWidth / 2 - 1;
			createHouseFrame(randomHouse("down"), lotX, lotY, places[i]);
			if (r.random() > 0.5) {
				game.add(new Actor({
					x: lotX + lotSize / 2,
					y: lotY + lotSize / 2
				}));
			}
			// Bottom house
			lotY = cy + roadWidth / 2 + 1;
			createHouseFrame(randomHouse("up"), lotX, lotY, places[numHouses + i]);
			if (r.random() > 0.5) {
				game.add(new Actor({
					x: lotX + lotSize / 2,
					y: lotY + lotSize / 2
				}));
			}
		}
	})();

}
