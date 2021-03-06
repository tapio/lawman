
var WALL = new ut.Tile('#', 100, 100, 100);
var WINDOW_H = new ut.Tile('─', 160, 200, 255);
var WINDOW_V = new ut.Tile('│', 160, 200, 255);
var DOOR = new ut.Tile('+', 110, 30, 0);
var DOOR_OPEN = new ut.Tile('/', 110, 50, 0);
var FLOOR = new ut.Tile('·', 150, 140, 80);
var DIRT = new ut.Tile('·', 80, 50, 0);
var ROAD = new ut.Tile('·', 90, 80, 60);
var MOUNTAIN = new ut.Tile('^', 120, 120, 120);
var BARREL = new ut.Tile('o', 160, 120, 0);
var CHAIR = new ut.Tile('h', 160, 120, 0);
var TABLE = new ut.Tile('O', 160, 120, 0);
var CLOSET = new ut.Tile('⌹', 160, 120, 0);

WINDOW_H.transparent = 1;
WINDOW_V.transparent = 1;
DOOR_OPEN.transparent = 1;
BARREL.transparent = 1;
CHAIR.transparent = 1;
TABLE.transparent = 1;


function Map() {
	this.width = 100;
	this.height = 80;
	this.map = new Array(this.height);
	for (var j = 0; j < this.height; ++j)
		this.map[j] = new Array(this.width);

	this.grid = new PF.Grid(this.width, this.height);
	this.pathFinder = new PF.AStarFinder({
		allowDiagonal: false,
		heurestic: PF.Heuristic.euclidean
	});
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

Map.prototype.passable = function(x, y, ai) {
	var t = this.getTile(x, y);
	if (t.ch === '·' || t.ch === '/') return true;
	if (ai && t.ch === '+') return true;
	else return false;
};

Map.prototype.singleRaycast = function(x1, y1, x2, y2, angle) {
	angle = angle !== undefined ? angle : Math.atan2(y2 - y1, x2 - x1);
	var step = 0.3333, step2 = step * step;
	var dx = Math.cos(angle) * step;
	var dy = Math.sin(angle) * step;
	var xx = x1 + dx, yy = y1 + dy;
	while (true) {
		var testx = Math.round(xx);
		var testy = Math.round(yy);
		var tile = this.getTile(testx, testy);
		if (tile.ch !== "·" && !tile.transparent)
			return false;
		if (distance2(xx, yy, x2 ,y2) <= step2)
			return true;
		xx += dx; yy += dy;
	}
};

Map.prototype.sight = function(x1, y1, x2, y2) {
	var d = 0.3;
	var a = Math.atan2(y2 - y1, x2 - x1);
	// Do four offset raycasts from tile corners
	return this.singleRaycast(x1-d, y1-d, x2-d, y2-d, a) ||
		   this.singleRaycast(x1+d, y1-d, x2+d, y2-d, a) ||
		   this.singleRaycast(x1-d, y1+d, x2-d, y2+d, a) ||
		   this.singleRaycast(x1+d, y1+d, x2+d, y2+d, a);
};

Map.prototype.action = function(x, y) {
	var t = this.getTile(x, y);
	switch (t.ch) {
		case '+':
			this.map[y][x] = DOOR_OPEN;
			return "Door opened.";
		case 'o':
			return "It's a barrel.";
		case 'O':
			return "Nothing on the table.";
		case 'h':
			return "No time to sit.";
		case '⌹':
			return "The closet is locked.";
		case '─': case '│':
			return "You look through the window.";
		case '^':
			return "Those mountains are too steep to climb.";
	}
};

Map.prototype.updatePathFindingGrid = function() {
	for (var j = 0; j < this.height; ++j)
		for (var i = 0; i < this.width; ++i)
			this.grid.setWalkableAt(i, j, this.passable(i, j, true) ? 1 : 0);
};

Map.prototype.getPath = function(startX, startY, goalX, goalY) {
	var path = this.pathFinder.findPath(startX, startY, goalX, goalY, this.grid.clone());
	var waypoints = [];
	for (var i = 0; i < path.length; ++i)
		waypoints.push({ x: path[i][0], y: path[i][1] });
	return waypoints;
};
