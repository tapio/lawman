
function UI(view, pl) {

	function build(ch, amount) {
		if (amount <= 0) return "0";
		var st = "";
		for (var i = 0; i < amount; ++i) st += ch;
		return st;
	}

	this.update = function() {
		var row = 0;
		view.putString("Health:", 0, row++, 160, 0, 0);
		view.putString(build("♥", 3), 0, row++, 255, 0, 0);
		++row;
		view.putString("[1] Left hand:", 0, row++, 160, 0, 0);
		view.putString(" Name: Scofield", 0, row++, 160, 0, 0);
		view.putString(" Ammo: " + build("✒", 6), 0, row++, 160, 0, 0);
		view.putString("[1] Right hand:", 0, row++, 160, 0, 0);
		view.putString(" Name: Scofield", 0, row++, 160, 0, 0);
		view.putString(" Ammo: " + build("✒", 6), 0, row++, 160, 0, 0);
		view.putString("[2] Secondary:", 0, row++, 160, 0, 0);
		view.putString(" Name: Sawed-off shotgun", 0, row++, 160, 0, 0);
		view.putString(" Ammo: " + build("✒", 8), 0, row++, 160, 0, 0);
		view.putString("[3] Throwable:", 0, row++, 160, 0, 0);
		view.putString(" Name: Dynamite", 0, row++, 160, 0, 0);
		view.putString(" Ammo: " + build("✒", 8), 0, row++, 160, 0, 0);
		++row
		view.putString("[␣] Shoot", 0, row++, 160, 0, 0);

		view.render();
	};
}
