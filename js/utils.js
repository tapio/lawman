
var RNG = new Alea();

function distance(x1, y1, x2, y2) {
	var dx = x2-x1, dy = y2-y1;
	return Math.sqrt(dx*dx + dy*dy);
}

function distance2(x1, y1, x2, y2) {
	var dx = x2-x1, dy = y2-y1;
	return dx*dx + dy*dy;
}

function clamp(x, a, b) {
	return x < a ? a : ( x > b ? b : x );
}

function blend(a, b, f) {
	return a * f + b * (1.0 - f);
}

function blendMul(a, b) {
	return (a * b) >> 8;
}

function randElem(arr, rng) {
	return arr[(rng.random() * arr.length) | 0];
}

function last(arr) { return arr[arr.length-1]; }
