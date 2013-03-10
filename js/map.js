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
