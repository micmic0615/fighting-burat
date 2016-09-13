define(function () {return function(SCENE){
	SCENE.turn = {
		phase: -1,
		index: 0,
		previous: null,
		sequence: [],
		sequence_max: 10,
		foresight: 25,
		reset: false,
	}

	SCENE.combat = {
		margin: 40,

		flinch_push_base: 15,
		flinch_push_duration: 15,
		flinch_push_movement: 2,
		flinch_push_max_duration: 30,

		attack_distance: 90,

		cast_time_duration: 10,
		cast_channel_duration: 30,
		cast_repel_factor: 2,

		knockback_damage_factor: 1,

		unit_movespeed: 2.5,

		buffs_use_max: 10,

		buffs_max: 4,
		buffs_foresight:2,

		stamina_regen_factor: 0.04,
		stamina_regen_duration: 5,

		bonus_buff_chance: 25,

		blocks_max: 10,

		debuff_proc_factor: 5,
		debuff_proc_requirement: 20,
	}

	SCENE.player = {
		bonuses_available: [],
		buffs_current: [],
		buffs_decked: [],
		buffs_used: 0,
		super: "",
		mana_max: 100,
		mana_current: 100,
		mana_regen: 3.5,
		reload: 99
	};
		
	if (UNV.buffs_available != undefined){
		SCENE.player.buffs_available = JSON.parse(JSON.stringify(UNV.buffs_available));
		SCENE.player.buffs_decked = JSON.parse(JSON.stringify(UNV.buffs_available));
	} else {
		SCENE.player.buffs_available = ["agility", "armorbreak", "damage", "defense", "focusbreak", "force", "focus", "heal", "regen"];
		SCENE.player.buffs_decked = JSON.parse(JSON.stringify(SCENE.player.buffs_available));
	}

	SCENE.bars = {};
	SCENE.icons = {};
	SCENE.texts = {};

	// LOAD SUBSCRIPTS
	
	SCENE.subscript("initialize");
	SCENE.subscript("calc_attack", ["initialize"]);	
	SCENE.subscript("turns", ["initialize", "calc_attack"]);	

	// ADDITIONAL PROTOTYPES

	SCENE["__proto__"].update_bars = function(bar, update, speed){
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

	SCENE["__proto__"].shuffle_buffs = function(){
		if (SCENE.player.buffs_available.length > 0){
			var buffs_used = SCENE.player.buffs_used
			var buffs_max = SCENE.player.buffs_available.length
			var shuffle_cost = Math.floor(SCENE.player.mana_current * (0.2 - ( 0.2 * buffs_used/buffs_max))) + 10;

			if (SCENE.player.mana_current >= shuffle_cost){
				SCENE.player.buffs_used = 0;
				SCENE.player.mana_current -= shuffle_cost;
				SCENE.player.buffs_decked = JSON.parse(JSON.stringify(SCENE.player.buffs_available));
				SCENE.player.buffs_current = [];

				while(SCENE.player.buffs_current.length < SCENE.combat.buffs_max + SCENE.combat.buffs_foresight){
					SCENE.buff_shuffle("init")
				}
			}
			
			
		}		
	}

	SCENE["__proto__"].buff_hero = function(buff, alias){
		if (buff != "_empty"){
			if (SCENE.player.mana_current >= BUFFS[buff].cost) {
				SCENE.player.buffs_used += 1;
				SCENE.player.mana_current -= BUFFS[buff].cost
				var buff_to_use = JSON.parse(JSON.stringify(BUFFS[buff]));
				buff_to_use.alias = buff;
				buff_to_use.max_duration = buff_to_use.duration;
				SCENE.getUnit("hero").prebuffs.push(buff_to_use);

				SCENE.buff_shuffle(alias.split("_")[1]);

				if (SCENE.player.buffs_used == SCENE.player.buffs_available.length){
					SCENE.shuffle_buffs();
				}
			};
		};
	};

	SCENE["__proto__"].buff_shuffle = function(index){
		if (index == undefined){index = 0};

		// var bonus_random = Math.floor(Math.random()*100);

		// if (bonus_random < SCENE.combat.bonus_buff_chance){
		// 	var buff_random = Math.floor(Math.random()*SCENE.player.bonuses_available.length);
		// 	var selected_buff = SCENE.player.bonuses_available[buff_random];
		// } else {
			
		// };

		if (SCENE.player.buffs_decked.length == 0) {
			SCENE.player.buffs_decked = ["_empty"]
		}

		var buff_random = Math.floor(Math.random() * SCENE.player.buffs_decked.length);
		var selected_buff = SCENE.player.buffs_decked[buff_random];
		SCENE.player.buffs_decked.splice(buff_random, 1);


		SCENE.player.buffs_current.push(selected_buff);

		if (index != "init"){
			SCENE.player.buffs_current.splice(index, 1);

			for (var i = 0; i < SCENE.combat.buffs_max; ++i) {
				var p = SCENE.player.buffs_current[i];
				SCENE.icons["buffs_" + i].setAnimation(p);
			}

			for (var i = 0; i < SCENE.combat.buffs_foresight; ++i) {
				var p = SCENE.player.buffs_current[i + SCENE.combat.buffs_max];
				SCENE.icons["nextbuffs_" + i].setAnimation(p);
			};
		};
	};

	return SCENE;
}})


