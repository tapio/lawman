
function Color(r, g, b) {
	this.r = r || 0;
	this.g = g || 0;
	this.b = b || 0;
	return this;
};

Color.prototype.set = function(r, g, b) {
	this.r = r;
	this.g = g;
	this.b = b;
	return this;
};

Color.prototype.copy = function(color) {
	this.r = color.r;
	this.g = color.g;
	this.b = color.b;
	return this;
};

Color.prototype.blend = function(color, factor) {
	this.r += (color.r - this.r) * factor;
	this.g += (color.g - this.g) * factor;
	this.b += (color.b - this.b) * factor;
	return this;
};

Color.prototype.clone = function() {
	return new Color().set(this.r, this.g, this.b);
};



function ColorGradient(color0, color1) {
	this.points = [];
	this.add = function(factor, color) {
		this.points.push({ f: factor, c: color });
		this.points.sort(function(a, b){ return a.f - b.f; });
	};
	this.add(0, color0);
	this.add(1, color1);
	this.get = function(factor) {
		// Simple cases
		if (factor >= 1.0) return this.points[this.points.length-1].c.clone();
		if (factor <= 0.0) return this.points[0].c.clone();
		if (this.points.length == 2) return this.points[0].c.clone().blend(this.points[1].c, factor);
		// Complex multi color case
		var i, a, b;
		for (i = 1; i < this.points.length; ++i) {
			b = this.points[i];
			if (factor <= b.f) break;
		}
		a = this.points[i-1];
		factor = (factor - a.f) / (b.f - a.f);
		return a.c.clone().blend(b.c, factor);
	};
};
