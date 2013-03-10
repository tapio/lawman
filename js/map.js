function Map() {
	this.map = [
		" #####             #####      ",
		" #...########      #...####   ",
		" #..........#      #......#   ",
		" #...######.#      #..###.#   ",
		" #####    #.#      ######.####",
		"          #.#          #.....#",
		"          #.#          #.....#",
		"          #.############.....#",
		"          #..................#",
		"          ####.###############",
		"##########   #.#     #....#   ",
		"#........##  #.#     #.#..#   ",
		"#..####...#  #.#     #.#..#   ",
		"#.........#  #.#     #.###### ",
		"#.........#  #.#     #......# ",
		"##.########  #.#     #......# ",
		" #.#         #.#     #####.## ",
		" #.#         #.#         #.#  ",
		" #.#   #######.#         #.#  ",
		" #.#   #.......#         #.#  ",
		" #.#   #.....#.#         #.#  ",
		" #.#   #.....#.#         #.#  ",
		" #.#   #.....#.#         #.#  ",
		" #.#   #.....#.#         #.#  ",
		" #.#   #######.#         #.#  ",
		" #.#         #.###########.#  ",
		" #.#         #.............#  ",
		" #.#############.###########  ",
		" #...............#            ",
		" #################            "
	];
	this.width = this.map[0].length;
	this.height = this.map.length;
}


// The tile palette is precomputed in order to not have to create
// thousands of Tiles on the fly.
var AT = new ut.Tile("@", 255, 255, 255);
var WALL = new ut.Tile('#', 100, 100, 100);
var FLOOR = new ut.Tile('.', 50, 50, 50);

// Returns a Tile based on the char array map
Map.prototype.getTile = function(x, y) {
	var t = "";
	try { t = this.map[y][x]; }
	catch(err) { return ut.NULLTILE; }
	if (t === '#') return WALL;
	if (t === '.') return FLOOR;
	return ut.NULLTILE;
};
