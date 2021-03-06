
function Actor(params) {
	this.gender = params.gender || (RNG.random() > 0.5 ? "f" : "m");
	this.name = params.name || Actor.generateName(this.gender, RNG);
	this.job = params.job || Actor.generateJob(this.gender, RNG);
	this.x = params.x || 0;
	this.y = params.y || 0;
	this.maxHealth = 15;
	this.health = this.maxHealth;
	this.money = params.money || Math.floor(RNG.random() * 10);
	this.exp = 0;
	this.nextLevel = 15;
	this.level = 1;
	this.accuracy = 1;
	this.dexterity = 1;
	this.toughness = 1;

	this.weapons = {
		gun1: this.gender === "m" ? Weapons.remington.clone() : Weapons.dummy,
		gun2: Weapons.dummy,
		secondary: Weapons.dummy,
		throwable: Weapons.dummy
	};
	this.drawn = params.hostile ? this.weapons.gun1 : null;
	this.faction = params.hostile ? -1 : 0; // -1: bandit, 0: neutral, 1: lawmen
	this.ai = params.ai === null ? null : {
		waypoints: [],
		home: { x: this.x, y: this.y },
		lazyness: RNG.random(),
		state: "sleep",
		courage: RNG.random(),
		hostile: params.hostile === undefined ? false : params.hostile
	};
	this.inventory = [ Items.bandage, Items.gunCylinder, Items.gunAmmo, Items.gunAmmo, Items.gunAmmo, Items.gunAmmo, Items.gunAmmo, Items.gunAmmo ];
	this.maxInventory = 50;
	this.tile = params.tile;
	if (!this.tile) {
		if (this.ai && this.ai.hostile) this.tile = new ut.Tile("@", 128, 0, 0);
		else if (this.gender == "f") this.tile = new ut.Tile("@", 250, 100, 170);
		else this.tile = new ut.Tile("@", 128, 64, 0);
	}
}

Actor.prototype.equip = function(num) {
	// TODO: Refactor
	// TODO: Akimbo equip
	if (num == 1 && this.weapons.gun1.damage) {
		if (this.drawn == this.weapons.gun1) this.drawn = null;
		else this.drawn = this.weapons.gun1;
	} else if (num == 2 && this.weapons.secondary.damage) {
		if (this.drawn == this.weapons.secondary) this.drawn = null;
		else this.drawn = this.weapons.secondary;
	} else if (num == 3 && this.weapons.throwable.damage) {
		if (this.drawn == this.weapons.throwable) this.drawn = null;
		else this.drawn = this.weapons.throwable;
	}
};

Actor.prototype.shoot = function(target) {
	if (!this.drawn) return;
	var d = distance(this.x, this.y, target.x, target.y);
	if (d > this.drawn.range) return "Bullet fell short...";
	if (RNG.random() > this.drawn.accuracy)
		return "Missed!";
	target.health -= this.drawn.damage;
	++this.exp;
	if (target.health <= 0) {
		this.money += 10 + Math.floor(RNG.random() * 10);
		this.exp += 10;
		return "You kill " + target.name + "!";
	} else return "You hit " + target.name + "!";
};

Actor.prototype.use = function(button) {
	for (var i = 0; i < this.inventory.length; ++i) {
		var item = this.inventory[i];
		if (item.button === button) {
			if (item.useCond(this)) {
				item.use(this);
				this.inventory.splice(i, 1);
				return true;
			} else return false;
		}
	}
};

Actor.prototype.banditAI = function(game) {
	// Find nearest lawman
	var target = game.findNearestActor(this, 1);
	if (!target) return;
	// If close, shoot
	if (target.dist < 8) { // TODO: Determine optimal range
		this.shoot(target.actor);
		this.ai.waypoints = [];
		console.log("Shoot!");
	}
	// If far and nothing to do, find a path to target
	else if (!this.ai.waypoints.length) {
		this.ai.waypoints = game.map.getPath(this.x, this.y, target.actor.x, target.actor.y);
	}
};

Actor.prototype.commonerAI = function(game) {
	// Figure out current state
	if (game.hour >= 7 && game.hour < 8 && RNG.random() <= game.TURN_LENGTH) { // Wake up
		this.ai.state = "work";
	} else if (game.hour >= 8 && game.hour < 16) { // Regular day things
		this.ai.state = "work";
	} else if (game.hour >= 16 && game.hour < 18 && RNG.random() <= game.TURN_LENGTH / 2) { // Off from work
		this.ai.state = "play";
	} else if (game.hour >= 18 && game.hour < 21) { // Entertainment in the evenings
		this.ai.state = "play";
	} else if (game.hour >= 20 && game.hour < 22 && RNG.random() <= game.TURN_LENGTH / 2) { // Go home
		this.ai.state = "home";
	} else if (game.hour >= 22 && game.hour < 23) { // Go home
		this.ai.state = "home";
	} else if (game.hour >= 23 || game.hour < 7) { // Sleep
		this.ai.state = "sleep";
	}

	var lazyness = this.ai.lazyness;
	if (this.ai.state == "sleep") lazyness = 1;
	else if (this.ai.state == "home") lazyness *= 1.2;
	else if (this.ai.state == "play") lazyness *= 0.8;

	// Idle
	if (!this.ai.waypoints.length) {
		// Find home
		if (this.ai.state == "home" && distance(this.x, this.y, this.ai.home.x, this.ai.home.y) > 4) {
			this.ai.waypoints = game.map.getPath(this.x, this.y, this.ai.home.x, this.ai.home.y);
		// Go somewhere
		} else if (this.ai.state == "work" || this.ai.state == "play") {
			this.ai.waypoints = game.map.getPath(this.x, this.y,
				Math.floor(RNG.random() * game.map.width),
				Math.floor(RNG.random() * game.map.height)
			);
		// Just hangout
		} else if (RNG.random() > lazyness) {
			var movedir = { x: 0, y: 0 };
			if (RNG.random() < 0.5) movedir.x = RNG.random() < 0.5 ? -1 : 1;
			else movedir.y = RNG.random() < 0.5 ? -1 : 1;
			var oldx = this.x, oldy = this.y;
			this.x += movedir.x;
			this.y += movedir.y;
			if (!game.map.passable(this.x, this.y)) {
				this.x = oldx; this.y = oldy;
			}
		}
	}
};

Actor.prototype.update = function(game) {
	if (!this.ai) return;

	if (this.ai.hostile) this.banditAI(game);
	else this.commonerAI(game);

	// Path following
	if (this.ai.waypoints.length) {
		var waypoint = this.ai.waypoints[0];
		this.x = waypoint.x;
		this.y = waypoint.y;
		this.ai.waypoints.splice(0, 1);
	}
};


Actor.generateName = function(gender, rng) {
	var name = "";
	if (gender == "f") name = randElem(Actor.femaleNames, rng);
	else name = randElem(Actor.maleNames, rng);
	name += " ";
	name += randElem(Actor.familyNames, rng);
	return name;
};

Actor.generateJob = function(gender, rng) {
	if (gender == "f") return randElem(Actor.femaleJobs, rng);
	else return randElem(Actor.maleJobs, rng);
};

Actor.maleNames = [ "Aaron", "Abe", "Abram", "Adolfo", "Adolph", "Agustin", "Ahmed", "Al", "Alden", "Aldo", "Alfonzo", "Alfredo", "Allan", "Alphonse", "Amado", "Andrew", "Angelo", "Antoine", "Anton", "Antonia", "Antonio", "Antwan", "Arlen", "Arnulfo", "Arturo", "Asa", "Ashley", "Aurelio", "Barry", "Basil", "Bennett", "Bernardo", "Bertram", "Bo", "Bobbie", "Bobby", "Booker", "Boris", "Brain", "Bret", "Bruce", "Bryant", "Bryce", "Buck", "Buddy", "Burton", "Buster", "Byron", "Caleb", "Cameron", "Carmelo", "Carmen", "Carrol", "Carson", "Casey", "Cecil", "Cedrick", "Cesar", "Chang", "Chet", "Christian", "Chuck", "Clair", "Clifford", "Colin", "Columbus", "Connie", "Conrad", "Cordell", "Cornell", "Cruz", "Dallas", "Dane", "Danny", "Daren", "Dario", "Darryl", "Daryl", "David", "Dean", "Deandre", "Delmer", "Demetrius", "Denis", "Denny", "Derick", "Devon", "Dewitt", "Dillon", "Dion", "Domenic", "Donald", "Eli", "Elisha", "Elliot", "Elliott", "Ellis", "Elmer", "Elvis", "Elwood", "Emery", "Emmanuel", "Enoch", "Erick", "Erin", "Ernest", "Ethan", "Eugene", "Evan", "Everett", "Everette", "Ezekiel", "Ezequiel", "Ezra", "Fermin", "Fernando", "Foster", "Francesco", "Frank", "Frankie", "Franklin", "Frederic", "Fredric", "Gale", "Garfield", "Gayle", "Genaro", "Gene", "Geraldo", "Gerardo", "Gonzalo", "Graham", "Greg", "Gregg", "Gus", "Hal", "Hank", "Harland", "Hassan", "Hector", "Herbert", "Heriberto", "Hilario", "Hong", "Horace", "Horacio", "Ignacio", "Ike", "Irwin", "Isreal", "Jack", "Jae", "Jaime", "Jamel", "Jarod", "Jarred", "Jason", "Jed", "Jefferey", "Jefferson", "Jeffry", "Jere", "Jermaine", "Jerrold", "Jimmie", "Joaquin", "Joesph", "John", "Johnson", "Jonathon", "Jordon", "Josef", "Josh", "Jospeh", "Josue", "Judson", "Keith", "Kendall", "Kennith", "Kent", "Kermit", "Kim", "Kris", "Lacy", "Lamont", "Lance", "Lavern", "Laverne", "Lawerence", "Lee", "Leif", "Lemuel", "Leon", "Leonard", "Leonardo", "Leonel", "Logan", "Lonny", "Lou", "Louis", "Lucien", "Lucius", "Luis", "Lyndon", "Lynwood", "Mac", "Mack", "Malcolm", "Malik", "Marcos", "Marshall", "Matt", "Max", "Merle", "Micah", "Michael", "Mickey", "Mike", "Milan", "Mitch", "Mohamed", "Mohammed", "Myles", "Nathan", "Nathanial", "Neal", "Ned", "Newton", "Nick", "Nickolas", "Nicky", "Noel", "Odis", "Omar", "Perry", "Porter", "Quinn", "Ralph", "Randell", "Reginald", "Reid", "Reynaldo", "Rhett", "Ricardo", "Rich", "Rick", "Rickey", "Rico", "Robert", "Rodney", "Rosario", "Ross", "Ruben", "Rudolph", "Rudy", "Rufus", "Russ", "Ryan", "Sal", "Salvador", "Sam", "Sandy", "Sanford", "Santo", "Scottie", "Scotty", "Sebastian", "Shelby", "Sherman", "Shirley", "Spencer", "Stacy", "Stanton", "Sterling", "Stevie", "Teodoro", "Terence", "Terry", "Theo", "Tomas", "Tony", "Tracey", "Trent", "Tuan", "Tyler", "Tyrell", "Tyson", "Vern", "Von", "Waldo", "Walker", "Wally", "Weston", "Wiley", "Wilford", "Wilfred", "Wilmer", "Winston", "Wyatt", "Zack" ];
Actor.femaleNames = [ "Adaline", "Addie", "Agnes", "Aileen", "Ailene", "Aisha", "Alayna", "Alessandra", "Alethea", "Alica", "Alida", "Allene", "Alyse", "Amalia", "Amy", "Andera", "Andra", "Angeline", "Angle", "Anh", "Annamaria", "Anne", "Annmarie", "Arletta", "Ashlee", "Ayesha", "Barbie", "Barbra", "Bella", "Belle", "Berniece", "Bev", "Billy", "Birgit", "Blake", "Bonnie", "Bonny", "Bree", "Brigette", "Brittaney", "Bronwyn", "Brook", "Brynn", "Candi", "Carl", "Caroline", "Carroll", "Cathryn", "Cathy", "Cecelia", "Celina", "Chantal", "Chantel", "Charlott", "Cher", "Chong", "Christopher", "Chun", "Cindi", "Claire", "Clarissa", "Clelia", "Cleopatra", "Consuela", "Corinna", "Corrie", "Crysta", "Dallas", "Danelle", "Daniel", "Danika", "Danyel", "Delena", "Deloise", "Delsie", "Demetrice", "Dia", "Dinorah", "Donette", "Earlean", "Earlene", "Easter", "Elda", "Eleanora", "Ellen", "Elva", "Emeline", "Emilie", "Enda", "Erica", "Erinn", "Ernestine", "Esmeralda", "Estelle", "Ethelyn", "Eun", "Eusebia", "Evan", "Faith", "Farrah", "Faviola", "Fawn", "Fern", "Fiona", "Flavia", "Florida", "Freda", "Frida", "Gary", "Gaynell", "Geneva", "Gisela", "Gladis", "Golden", "Hailey", "Halley", "Hallie", "Hana", "Hedwig", "Hellen", "Herma", "Hien", "Hong", "Idell", "India", "Irena", "Isabel", "Jae", "Jaleesa", "Janessa", "Jani", "Jeri", "Jinny", "Joeann", "Johna", "Johnnie", "Jon", "Joseph", "Josie", "Josphine", "Jovita", "Judith", "Kali", "Kamilah", "Kandis", "Kara", "Karen", "Kari", "Karisa", "Karissa", "Karol", "Karrie", "Katia", "Katina", "Kay", "Kaycee", "Keisha", "Kellie", "Kellye", "Kristi", "Laquita", "Lashandra", "Lashawnda", "Latia", "Laureen", "Lavern", "Leah", "Leeanne", "Leia", "Lelah", "Leola", "Leonie", "Leota", "Lettie", "Ling", "Linn", "Lisa", "Lorean", "Loreen", "Lory", "Lucilla", "Luetta", "Lyndsay", "Lynette", "Macy", "Madlyn", "Marcie", "Margart", "Margene", "Margy", "Mari", "Mariann", "Marion", "Marnie", "Marquetta", "Marth", "Martine", "Maryland", "Marylee", "Maureen", "Mayme", "Mellie", "Merry", "Meta", "Michiko", "Min", "Mirella", "Mireya", "Mitzi", "Myrtie", "Nancee", "Nancy", "Natalie", "Nelia", "Nenita", "Nerissa", "Neta", "Ngan", "Nickie", "Nohemi", "Olga", "Olympia", "Oma", "Otha", "Particia", "Pearle", "Phillis", "Philomena", "Quyen", "Rachael", "Ramona", "Randee", "Randi", "Randy", "Rebecka", "Refugia", "Regina", "Rene", "Rima", "Rita", "Robbin", "Robena", "Rubie", "Rubye", "Rufina", "Samira", "Saran", "Selina", "Shantae", "Shantelle", "Sharan", "Sharice", "Sharie", "Sharyn", "Shawanna", "Shenika", "Sherell", "Sheridan", "Sherilyn", "Shirley", "Shonda", "Shonna", "Siobhan", "So", "Sol", "Stefania", "Suzanna", "Tamar", "Tammera", "Tammie", "Tanja", "Tasia", "Tawny", "Terra", "Tiffiny", "Timothy", "Tomasa", "Tomi", "Tonette", "Trang", "Trina", "Tyra", "Ute", "Valeria", "Vena", "Verlie", "Verline", "Vernia", "Virgina", "Vita", "Vivienne", "Xiomara", "Yoshie", "Yuko", "Yung", "Yuonne", "Zaida", "Zena", "Zoe", "Zoraida" ];
Actor.familyNames = [ "Jones", "Ruhl", "Eisenman", "Van", "Beard", "Emrick", "Newbern", "Powers", "Schmidt", "Gronko", "Hayhurst", "Nash", "Maclagan", "Davis", "Iseman", "Guess", "Campbell", "Faust", "Sadley", "Wallace", "Gibson", "Candles", "Catherina", "Judge", "Woollard", "Errett", "Randolph", "Kline", "Catlay", "Tomlinson", "Haynes", "Courtney", "Bowman", "Poley", "Cady", "Tedrow", "Smothers", "Magor", "Oppenheimer", "Bullard", "Marjorie", "Ledgerwood", "Shea", "Teagarden", "Mens", "Ulery", "Blatenberger", "Bryant", "Barth", "Nicholas", "Klockman", "Eckert", "Lord", "Wheeler", "Barnes", "Cressman", "Johnston", "Ream", "Fleming", "Faast", "Dryfus", "Flanders", "Earl", "Scott", "Moore", "James", "Carter", "Batten", "Edwards", "Joghs", "Butler", "Kooser", "Finlay", "Harper", "Giesen", "Hook", "Pery", "Hicks", "Hincken", "Patton", "Blair", "Lowe", "Leech", "Pittman", "Tomco", "Stainforth", "Warner", "Ewing", "Ackerley", "Shallenberger", "Ashmore", "Priebe", "Southern", "Clewett", "Park", "Shirey", "Read", "Fair", "Sell", "Rega", "Todd", "Herndon", "Ling", "Jube", "Oneal", "Beck", "Buttermore", "Whittier", "Wells", "Kistler", "Stewart", "Trevithick", "Buehler", "Miller", "Durstine", "Unk", "Zeal", "Cavalet", "Wile", "Higgens", "Dugger", "Hardie", "Yeskey", "Beals", "Roby", "Stoddard", "Richter", "Newbiggin", "Gist", "Osterwise", "Cowper", "Mathews", "Greenwood", "Metzer", "Houston", "Eisenmann", "Erschoff", "Osterweis", "Cowart", "Ruch", "Hoenshell", "Peters", "Larson", "Cram", "Fry", "Fillmore", "Jyllian", "Little", "Highlands", "Rockwell", "Tilton", "Wildman", "Elless", "Rumbaugh", "Mackendoerfer", "Agg", "Fuchs", "Blackburn", "Knapenberger", "Brown", "Staymates", "Hall", "Philips", "Agnes", "Dennis", "Martin", "Jenkins", "Keener", "Harris", "Robinson", "Noton", "Drennan", "Draudy", "Swift", "Kemble", "Ray", "Franks", "Young", "Porter", "Linton", "Chapman", "Drumm", "Rowley", "Rhinehart", "Logue", "Rosensteel", "Mitchell", "Elder", "Marshall", "Willcox", "Kellogg", "Dean", "Baker", "Foster", "Baumgartner", "Koster", "Wood", "Todd", "Warrick", "Warren", "Joyce", "Bashline", "Walker", "Wolff", "Stafford", "Dickson", "Zadovsky", "Crom", "Easter", "Dunlap", "Marcotte", "Wells", "Losey", "Stanfield", "Sutorius", "Yates", "Hujsak", "Reamer", "Lineman", "Kight", "Stough", "Fryer", "Coldsmith", "Thorley", "Richards", "Patterson", "Focell", "Filby", "Mccrady", "Rahl", "Hoopengarner", "Neely", "Hil", "Craig", "Snyder", "Ramsey", "Swarner", "Jowers", "Munshower", "Lowstetter", "Cowher", "Whishaw", "Kimmons", "Mackendrick", "Howard", "Fuller", "Mcfall", "Demuth", "Baldwin", "Arthur", "Bauerle", "Polson", "Mueller", "Hobbs", "Mcmullen", "Davis", "Fitzgerald", "Bard", "Pfeifer", "Stiffey", "Thompson", "Sherlock", "Shafer", "Berry", "Greene", "Perkins", "Allshouse", "Knopsnider", "Hardy", "Toyley", "Conrad", "Fisher", "Otis", "Leach", "Flick", "Dickinson", "Baird", "Monahan", "Hutton", "Jesse", "Merryman", "Frankenberger", "Schreckengost", "Geddinge", "Hice", "Minnie", "Hughes", "Hawker", "Driggers", "Light", "Woodward", "Sandys", "Fowler", "Wible", "Newlove", "Ammons", "Reddish", "Hays", "Close", "Saltser" ];
Actor.maleJobs = [ "Drunk", "Farmer", "Miller", "Miner" ];
Actor.femaleJobs = [ "Housewife", "Teacher", "Launderer" ];

Actor.abilityItems = [
	new Item({
		name: "Accuracy (hit more easily)",
		service: true,
		use: function(target) {
			++target.accuracy;
		}
	}),
	new Item({
		name: "Dexterity (avoid hits)",
		service: true,
		use: function(target) {
			++target.dexterity;
		}
	}),
	new Item({
		name: "Toughness (reduce damage)",
		service: true,
		use: function(target) {
			++target.toughness;
		}
	})
]
