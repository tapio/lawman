
var WALL = new ut.Tile('#', 100, 100, 100);
var WINDOW_H = new ut.Tile('-', 160, 200, 255);
var WINDOW_V = new ut.Tile('|', 160, 200, 255);
var DOOR = new ut.Tile('+', 110, 30, 0);
var DOOR_OPEN = new ut.Tile('/', 110, 50, 0);
var FLOOR = new ut.Tile('.', 150, 140, 80);
var DIRT = new ut.Tile('.', 80, 50, 0);
var ROAD = new ut.Tile('.', 80, 70, 50);
var MOUNTAIN = new ut.Tile('^', 120, 120, 120);

WINDOW_H.transparent = 1;
WINDOW_V.transparent = 1;
DOOR_OPEN.transparent = 1;


function Map() {
	this.width = 100;
	this.height = 80;
	this.map = new Array(this.height);
	for (var j = 0; j < this.height; ++j)
		this.map[j] = new Array(this.width);
}

Map.prototype.fill = function(tile, x, y, w, h) {
	for (var j = y; j < y + h; ++j)
		for (var i = x; i < x + w; ++i)
			this.map[j][i] = tile;
};

Map.prototype.border = function(tile, x, y, w, h) {
	for (var j = y; j < y + h; ++j) {
		this.map[j][x] = tile;
		this.map[j][x+w-1] = tile;
	}
	for (var i = x; i < x + w; ++i) {
		this.map[y][i] = tile;
		this.map[y+h-1][i] = tile;
	}
};

Map.prototype.getTile = function(x, y) {
	var t;
	try { t = this.map[y][x]; }
	catch(err) { return ut.NULLTILE; }
	return t;
};

Map.prototype.passable = function(x, y) {
	var t = this.getTile(x, y);
	if (t.ch === '.' || t.ch === '/') return true;
	else return false;
};

Map.prototype.action = function(x, y) {
	var t = this.getTile(x, y);
	if (t.ch === '+') {
		this.map[y][x] = DOOR_OPEN;
		return "Door opened";
	}
	return null;
};
