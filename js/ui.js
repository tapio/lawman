
function UI(pl) {
	function build(ch, amount, padch, padamount) {
		if (amount <= 0) return "-None-";
		var st = "", i;
		for (i = 0; i < amount; ++i) st += ch;
		for (; i < padamount; ++i) st += padch;
		return st;
	}

	function pickColor(gun, pl) {
		if (!gun.damage) return { r: 64, g: 64, b: 64 };
		if (pl.drawn == gun) return { r: 60, g: 160, b: 0 };
		return { r: 160, g: 100, b: 64 };
	}

	this.render = function(view) {
		var row = 0, c, i, item, ammoStr = "";
		view.clear();
		view.putString("Health:", 0, row, 160, 0, 0);
		view.putString(build("♥", pl.health, "♡", pl.maxHealth), 8, row++, 255, 0, 0);
		view.putString("Money: $" + pl.money, 0, row++, 200, 200, 0);
		view.putString("Exp: " + pl.exp + "/" + pl.nextLevel, 0, row++, 100, 0, 150);
		++row;
		// Weapons
		c = pickColor(pl.weapons.gun1, pl);
		ammoStr = " Ammo: " + build("✒", pl.weapons.gun1.ammo, " ", pl.weapons.gun1.clipSize);
		view.putString("[1] Right hand:", 0, row++, c.r, c.g, c.b);
		view.putString(" " + pl.weapons.gun1.name, 0, row++, c.r, c.g, c.b);
		view.putString(ammoStr, 0, row++, c.r, c.g, c.b);
		c = pickColor(pl.weapons.gun2, pl);
		ammoStr = " Ammo: " + build("✒", pl.weapons.gun2.ammo, " ", pl.weapons.gun2.clipSize);
		view.putString("[1] Left hand:", 0, row++, c.r, c.g, c.b);
		view.putString(" " + pl.weapons.gun2.name, 0, row++, c.r, c.g, c.b);
		view.putString(ammoStr, 0, row++, c.r, c.g, c.b);
		c = pickColor(pl.weapons.secondary, pl);
		ammoStr = " Ammo: " + build("✒", pl.weapons.secondary.ammo, " ", pl.weapons.secondary.clipSize);
		view.putString("[2] Secondary:", 0, row++, c.r, c.g, c.b);
		view.putString(" " + pl.weapons.secondary.name, 0, row++, c.r, c.g, c.b);
		view.putString(ammoStr, 0, row++, c.r, c.g, c.b);
		//c = pickColor(pl.weapons.throwable, pl);
		//ammoStr = " Ammo: " + build("✒", pl.weapons.throwable.ammo, " ", pl.weapons.throwable.clipSize);
		//view.putString("[3] Throwable:", 0, row++, c.r, c.g, c.b);
		//view.putString(" " + pl.weapons.throwable.name, 0, row++, c.r, c.g, c.b);
		//view.putString(ammoStr, 0, row++, c.r, c.g, c.b);
		++row;
		// Shooting
		++row;
		if (pl.drawn && pl.drawn.ammo)
			view.putString("[␣] Shoot closest", 0, row++, 160, 0, 0);
		// Item actions
		pl.inventory.sort(function(a, b) { return a.space < b.space; });
		var lastItem = {};
		for (i = 0; i < pl.inventory.length; ++i) {
			item = pl.inventory[i];
			if (item.button && item.button != lastItem.button) {
				lastItem = item;
				if (item.useCond(pl)) {
					view.putString("[" + String.fromCharCode(item.button) + "] " + item.useText, 0, row++, 160, 0, 0);
				}
			}
		}
		++row;
		// Inventory
		row = Math.max(row, 22);
		view.putString("Inventory:", 0, row++, 0, 100, 0);
		var invX = 0;
		var invSize = 0;
		for (i = 0; i < pl.inventory.length; ++i) {
			item = pl.inventory[i];
			view.put(item.tile, invX, row);
			if (item.space > 1) {
				view.putString(build("-", item.space-1), invX+1, row, item.tile.r, item.tile.g, item.tile.b);
			}
			invX += item.space;
			invSize += item.space;
			if (invX > view.w) { invX = invX % view.w; ++row; }
		}
		view.putString(build(".", pl.maxInventory - invSize), invX, row, 50, 255, 50);

		view.render();
	};
}


function Menu(name, items, pl, autoClose) {
	var keys = "abcdefghijklmnopqrstuvwxyz";

	function build(ch, amount) {
		if (amount <= 0) return "";
		var st = "";
		for (var i = 0; i < amount; ++i) st += ch;
		return st;
	}

	this.render = function(view) {
		var row = 0, c;
		view.clear();
		view.putString(name, 0, row++, 0, 200, 0);
		view.putString(build("=", name.length), 0, row++, 0, 200, 0);
		++row;

		for (var i = 0; i < items.length; ++i, row+=2) {
			var item = items[i];
			var str = "[" + keys[i] + "] " + item.name;
			if (item.tile) c = item.tile;
			else c = { r: 200, g: 100, b: 0 };
			view.putString(str, 0, row, c.r, c.g, c.b);
			if (item.price !== undefined)
				view.putString("$" + item.price, view.w - 8, row, 200, 200, 0);
		}
		++row;
		view.putString("Press a letter...", 0, row++, 100, 100, 100);
		if (!autoClose)
			view.putString("ESC to exit.", 0, row++, 100, 100, 100);
		view.render();
	};

	this.action = function(key) {
		if (!autoClose && key == ut.KEY_ESCAPE) return true;
		var i = key - ut.KEY_A;
		if (i < 0 || i >= items.length) return false;
		var item = items[i];
		if (item.price && pl.money < item.price) return false;
		if (item.service) {
			if (!item.useCond(pl)) return false;
			item.use(pl);
			console.log(pl);
		} else if (true) { // TODO: Check for inventory space
			pl.inventory.push(item);
		}
		return autoClose;
	};
}
