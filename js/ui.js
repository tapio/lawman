
function UI(view, pl) {
		console.log(pl.weapons);
	function build(ch, amount, padch, padamount) {
		if (amount <= 0 && padch === undefined) return "-None-";
		var st = "", i;
		for (i = 0; i < amount; ++i) st += ch;
		for (; i < padamount; ++i) st += padch;
		return st;
	}

	this.update = function() {
		var row = 0;
		view.putString("Health:", 0, row++, 160, 0, 0);
		view.putString(build("♥", pl.health, "♡", pl.maxHealth), 0, row++, 255, 0, 0);
		++row;
		view.putString("[1] Right hand:", 0, row++, 128, 128, 128);
		view.putString(" Name: " + pl.weapons.gun1.name, 0, row++, 160, 0, 0);
		view.putString(" Ammo: " + build("✒", pl.weapons.gun1.ammo), 0, row++, 160, 0, 0);
		view.putString("[1] Left hand:", 0, row++, 128, 128, 128);
		view.putString(" Name: " + pl.weapons.gun2.name, 0, row++, 160, 0, 0);
		view.putString(" Ammo: " + build("✒", pl.weapons.gun2.ammo), 0, row++, 160, 0, 0);
		view.putString("[2] Secondary:", 0, row++, 128, 128, 128);
		view.putString(" Name: " + pl.weapons.secondary.name, 0, row++, 160, 0, 0);
		view.putString(" Ammo: " + build("✒", pl.weapons.secondary.ammo), 0, row++, 160, 0, 0);
		view.putString("[3] Throwable:", 0, row++, 128, 128, 128);
		view.putString(" Name: " + pl.weapons.throwable.name, 0, row++, 160, 0, 0);
		view.putString(" Ammo: " + build("✒", pl.weapons.throwable.ammo), 0, row++, 160, 0, 0);
		++row
		view.putString("[␣] " + (pl.drawn ? "Shoot" : "Punch"), 0, row++, 160, 0, 0);

		view.render();
	};
}
