// This file contains an implementation of simple FOV.
// It naïvely shoots a beam at every direction.
// Makes use of the ut.Engine's mask function callback.

/*global term, eng */

function FOV(viewport, eng) {
	var maskOrigin = { x: 0, y: 0 };

	// Create an array for the FOV
	var maskBuffer = new Array(viewport.h);
	for (var j = 0; j < viewport.h; ++j)
		maskBuffer[j] = new Array(viewport.w);
	// Attach the look-up callback
	eng.setMaskFunc(function(x, y) {
		x -= maskOrigin.x;
		y -= maskOrigin.y;
		if (x < 0 || y < 0 || x >= viewport.w || y >= viewport.h) return false;
		return maskBuffer[y][x];
	});


	// Shoots a line-of-sight beam that marks tiles as visible as it goes
	function shootRay(x, y, a) {
		var step = 0.3333;
		var maxdist = (viewport.cy - 1) / step;
		var dx = Math.cos(a);
		var dy = -Math.sin(a);
		var xx = x + dx, yy = y + dy;
		dx *= step;
		dy *= step;
		for (var i = 0; i < maxdist; ++i) {
			// Check for walls at the current spot
			var testx = Math.round(xx);
			var testy = Math.round(yy);
			// Mark the tile visible
			maskBuffer[testy - maskOrigin.y][testx - maskOrigin.x] = true;
			// If wall is encountered, terminate ray
			var tile = eng.tileFunc(testx, testy);
			if (tile.ch !== "." && !tile.transparent)
				return;
			// Advance the beam according to the step variables
			xx += dx; yy += dy;
		}
	}

	// Calculates a fresh field of view
	this.update = function(x, y) {
		// Clear the mask buffer
		for (var j = 0; j < viewport.h; ++j)
			for (var i = 0; i < viewport.w; ++i)
				maskBuffer[j][i] = false;
		// Update buffer info
		maskOrigin.x = x - viewport.cx;
		maskOrigin.y = y - viewport.cy;
		// Populate the mask buffer with fresh data
		var step = Math.PI * 2.0 / 1080;
		for (var a = 0; a < Math.PI * 2; a += step)
			shootRay(x, y, a);
	};
}
