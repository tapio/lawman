
var RNG = new Alea();

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
