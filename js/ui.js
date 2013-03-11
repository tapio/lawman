
function UI(view, pl) {
	function build(ch, amount, padch, padamount) {
		if (amount <= 0 && padch === undefined) return "-None-";
		var st = "", i;
		for (i = 0; i < amount; ++i) st += ch;
		for (; i < padamount; ++i) st += padch;
		return st;
	}

	function pickColor(gun, pl) {
		if (!gun.damage) return { r: 64, g: 64, b: 64 };
		if (pl.drawn == gun) return { r: 160, g: 0, b: 0 };
		return { r: 160, g: 100, b: 64 };
	}

	this.update = function() {
		var row = 0, c;
		view.putString("Health:", 0, row, 160, 0, 0);
		view.putString(build("♥", pl.health, "♡", pl.maxHealth), 8, row++, 255, 0, 0);
		view.putString("Money: $" + pl.money, 0, row++, 200, 200, 0);
		++row;
		c = pickColor(pl.weapons.gun1, pl);
		view.putString("[1] Right hand:", 0, row++, c.r, c.g, c.b);
		view.putString(" " + pl.weapons.gun1.name, 0, row++, c.r, c.g, c.b);
		view.putString(" Ammo: " + build("✒", pl.weapons.gun1.ammo), 0, row++, c.r, c.g, c.b);
		c = pickColor(pl.weapons.gun2, pl);
		view.putString("[1] Left hand:", 0, row++, c.r, c.g, c.b);
		view.putString(" " + pl.weapons.gun2.name, 0, row++, c.r, c.g, c.b);
		view.putString(" Ammo: " + build("✒", pl.weapons.gun2.ammo), 0, row++, c.r, c.g, c.b);
		c = pickColor(pl.weapons.secondary, pl);
		view.putString("[2] Secondary:", 0, row++, c.r, c.g, c.b);
		view.putString(" " + pl.weapons.secondary.name, 0, row++, c.r, c.g, c.b);
		view.putString(" Ammo: " + build("✒", pl.weapons.secondary.ammo), 0, row++, c.r, c.g, c.b);
		c = pickColor(pl.weapons.throwable, pl);
		view.putString("[3] Throwable:", 0, row++, c.r, c.g, c.b);
		view.putString(" " + pl.weapons.throwable.name, 0, row++, c.r, c.g, c.b);
		view.putString(" Ammo: " + build("✒", pl.weapons.throwable.ammo), 0, row++, c.r, c.g, c.b);
		++row;
		view.putString("[␣] " + (pl.drawn ? "Shoot" : "Punch"), 0, row++, 160, 0, 0);

		view.render();
	};
}
