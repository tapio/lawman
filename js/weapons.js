
function Weapon(params) {
	this.name = params.name || "Weapon";
	this.desc = params.desc || "A weapon";
	this.type = params.type || "primary";
	this.damage = params.damage || 1;
	this.range = params.range || 1;
	this.accuracy = params.accuracy || 1;
	this.clipSize = params.clipSize || 6;
	this.ammo = params.ammo || this.clipSize;
}

Weapon.prototype.clone = function() {
	return new Weapon(this);
};

var Weapons = {
	dummy: {
		name: "-Nothing-",
		damage: 0,
		range: 0,
		ammo: 0
	},
	// Pistols
	remington: new Weapon({
		name: "Remington 1858",
		damage: 2,
		accuracy: 0.5,
		range: 10
	}),
	schofield: new Weapon({
		name: "S&W Schofield",
		damage: 3,
		accuracy: 0.55,
		range: 10
	}),
	peacemaker: new Weapon({
		name: "Colt Peacemaker",
		damage: 4,
		accuracy: 0.6,
		range: 11
	}),
	// Rifles and shotguns
	winchester: new Weapon({
		name: "Winchester 1866",
		type: "secondary",
		damage: 2,
		accuracy: 0.7,
		range: 20,
		clipSize: 12
	}),
	lightning: new Weapon({
		name: "Colt Lightning",
		type: "secondary",
		damage: 2,
		accuracy: 0.75,
		range: 20,
		clipSize: 12
	}),
	gauge: new Weapon({
		name: "Remington 12 Gauge",
		type: "secondary",
		damage: 5,
		accuracy: 0.7,
		range: 8,
		clipSize: 2
	}),
	// Throwables
	knife: new Weapon({
		name: "Bowie knife",
		type: "throwable",
		damage: 1,
		accuracy: 0.5,
		range: 4,
		clipSize: 1
	}),
	dynamite: new Weapon({
		name: "Dynamite",
		type: "throwable",
		damage: 15,
		accuracy: 0.8,
		range: 4,
		clipSize: 1
	})
};
