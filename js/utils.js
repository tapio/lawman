
var RNG = new Alea();

function clamp(x, a, b) {
	return x < a ? a : ( x > b ? b : x );
}

function randElem(arr, rng) {
	return arr[(rng.random() * arr.length) | 0];
}

function last(arr) { return arr[arr.length-1]; }
