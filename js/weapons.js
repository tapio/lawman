
function Weapon(params) {
	this.damage = params.damage || 1;
	this.range = params.range || 1;
	this.accuracy = params.accuracy || 1;
	this.clipSize = params.clipSize || 6;
	this.ammo = params.ammo || 0;
}
