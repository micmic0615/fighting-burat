define(function () {return function(SCENE){
	SCENE.fighters = {};

	SCENE.turn = {
		phase: -1,
		index: 0,
		previous: null,
		sequence: [],
		sequence_max: 10,
		foresight: 25,
		reset: false,
	}

	SCENE.player = {
		bonuses_available: [],
		buffs_current: [],
		buffs_decked: [],
		buffs_queued: [],
		buffs_used: 0,
		super: "",
		mana_max: 100,
		mana_current: 100,
		mana_regen: 3.5,
		reload: 99
	};
		
	if (GLOBALS.my_buffs != undefined){
		SCENE.player.buffs_available = JSON.parse(JSON.stringify(GLOBALS.my_buffs));
		SCENE.player.buffs_decked = JSON.parse(JSON.stringify(GLOBALS.my_buffs));
	} else {
		SCENE.player.buffs_available = ["agility", "armorbreak", "damage", "defense", "focusbreak", "force", "focus", "heal", "regen"];
		SCENE.player.buffs_decked = JSON.parse(JSON.stringify(SCENE.player.buffs_available));
	}

	SCENE.bars = {};
	SCENE.icons = {};
	SCENE.texts = {};
	
	SCENE.sfx_dummies = [];
	
	SCENE.subscript("initialize");
	SCENE.subscript("turns_actions", ["initialize"]);	
	SCENE.subscript("turns", ["initialize", "turns_actions"]);	

	SCENE["__proto__"].updateBars = function(bar, update, speed){
		if (update < 0){update = 0}
		if (bar.width != update){
			if (bar.width + speed != update || bar.width - speed != update){
				if (bar.width - speed > update){
					bar.width -= speed;
				} else if (bar.width + speed < update) {
					bar.width += speed;
				} else {
					bar.width = update;
				}
			}; 
		};
	};

	SCENE["__proto__"].getDummySFX = function(){
		for (var i = 0; i < SCENE.sfx_dummies.length; ++i) {
			var p = SCENE.sfx_dummies[i];
			if (p.life == 0){return p};
		};
	}

	// SCENE["__proto__"].shuffle_buffs = function(){
	// 	if (SCENE.player.buffs_available.length > 0){
	// 		var buffs_used = SCENE.player.buffs_used
	// 		var buffs_max = SCENE.player.buffs_available.length
	// 		var shuffle_cost = Math.floor(SCENE.player.mana_current * (0.2 - ( 0.2 * buffs_used/buffs_max))) + 10;
	// 		var shuffle_cost = 0;

	// 		if (SCENE.player.mana_current >= shuffle_cost){
	// 			SCENE.player.buffs_used = 0;
	// 			SCENE.player.mana_current -= shuffle_cost;
	// 			SCENE.player.buffs_decked = JSON.parse(JSON.stringify(SCENE.player.buffs_available));
	// 			SCENE.player.buffs_current = [];

	// 			while(SCENE.player.buffs_current.length < COMBAT.buffs_max + COMBAT.buffs_foresight){
	// 				SCENE.buffShuffle("init")
	// 			}
	// 		}
	// 	}		
	// }

	SCENE["__proto__"].buffMyFighter = function(buff, alias){
		if (buff != "_empty"){
			var not_queued = true;
			for (var i = 0; i < SCENE.player.buffs_queued.length; ++i) {
				if (SCENE.player.buffs_queued[i] == alias.split("_")[1]){not_queued = false; break}
			}

			if (not_queued){
				if (SCENE.player.mana_current >= BUFFS[buff].cost) {
					SCENE.player.buffs_used += 1;
					SCENE.player.mana_current -= BUFFS[buff].cost
					var buff_to_use = JSON.parse(JSON.stringify(BUFFS[buff]));
					buff_to_use.alias = buff;
					buff_to_use.max_duration = buff_to_use.duration;

					SCENE.getUnit(GLOBALS.my_fighter).queuebuffs.push(buff_to_use);

					// SCENE.buffShuffle(alias.split("_")[1]);

					SCENE.player.buffs_queued.push(alias.split("_")[1])
				};
			};
		};
	};

	SCENE["__proto__"].buffShuffle = function(index){
		if (index == undefined){index = 0};

		if (SCENE.player.buffs_decked.length == 0) {
			if (SCENE.player.buffs_available.length > 0){
				for (var i = 0; i < SCENE.player.buffs_available.length; ++i) {
					var p = SCENE.player.buffs_available[i];
					SCENE.player.buffs_decked.push(p);
				};
			} else {
				SCENE.player.buffs_decked = ["_empty"];
			}
		}

		var buff_random = Math.floor(Math.random() * SCENE.player.buffs_decked.length);
		var selected_buff = SCENE.player.buffs_decked[buff_random];
		SCENE.player.buffs_decked.splice(buff_random, 1);


		SCENE.player.buffs_current.push(selected_buff);

		if (index != "init"){
			SCENE.player.buffs_current.splice(index, 1);

			for (var i = 0; i < COMBAT.buffs_max; ++i) {
				var p = SCENE.player.buffs_current[i];
				SCENE.icons["buffs_" + i].setAnimation(p);
			}

			for (var i = 0; i < COMBAT.buffs_foresight; ++i) {
				var p = SCENE.player.buffs_current[i + COMBAT.buffs_max];
				SCENE.icons["nextbuffs_" + i].setAnimation(p);
			};
		};
	};

	return SCENE;
}})


