define(function () { return function(){
	var unit_stats = {
		"hero": initialize_stats.bind(this)("hero", this.world.width/2 - 45),
		"enemy": initialize_stats.bind(this)("enemy", this.world.width/2 + 45),
	};

	function initialize_stats(alias, locX){
		var unit = this.getUnit(alias);

		this.fighters[alias] = {
			agility: unit.derived.agility,
			health_max: unit.derived.health,
			stamina_max: unit.derived.stamina,
			defense_max: unit.derived.defense,
			damage: unit.derived.damage,
			force: unit.derived.force,
			poise: unit.derived.poise,			
			stamina_cost: unit.derived.cost,
		}

		return {
			health: unit.current.health,
			stamina: unit.current.stamina,
			defense: unit.current.defense,
			block: unit.current.block,			
			buffs: unit.buffs,
			debuffs: unit.debuffs,
			staminaregen: unit.staminaregen,
			locX: locX
		};
	};	

	var game_over = false;
	var game_over_delay = 100;

	function apply_buffs(unit){
		var next_turn = this.turn.sequence[this.turn.index + 1];

		if (unit.prebuffs.length > 0){
			if (next_turn.unit_stats[unit.alias].buffs.length < 10){
				
				for (var i = 0; i < unit.prebuffs.length; ++i) {
					var p = unit.prebuffs[i];
					this.turn.sequence[this.turn.index + 1].unit_stats[unit.alias].buffs.push(p);
					
					unit.prebuffs.splice(i,1); i--;
				};

				var recalc_turns = false;
				var recalc_duration = 0;

				for (var i = 0; i < next_turn.unit_stats[unit.alias].buffs.length; ++i) {
					var p = next_turn.unit_stats[unit.alias].buffs[i];
					if (p.effects == "speed_up" && (p.used == undefined || p.used == false)) {
						p.used = true;
						recalc_turns = true
						if (p.duration > recalc_duration){recalc_duration = p.duration}
					}
				};				

				for (var i = this.turn.index + 1; i < this.turn.sequence.length; ++i) {
					var p = this.turn.sequence[i];
					p.evaluated = false;
				};

				if (recalc_turns){
					var test_before = [];
					var test_after = []
					
					for (var i = this.turn.index; i < recalc_duration + this.turn.index; ++i) {
						var p = this.turn.sequence[i];
						test_before.push(p.origin)
					}

					calculate_turns.bind(this)(this.turn.index + 1, recalc_duration);

					for (var i = this.turn.index; i < recalc_duration + this.turn.index; ++i) {
						var p = this.turn.sequence[i];
						test_after.push(p.origin)
					}
				} else {
					evaluate_sequence.bind(this)(this.turn.index + 1)
				};
			};
		};
	};

	function change_turn_phase(){
		var current = this.turn.sequence[this.turn.index];

		var origin = this.getUnit(current.origin);
		var target = this.getUnit(current.target);

		if (origin.current.health <= 0 || target.current.health <= 0){if (origin.alias == "hero"){var message = "YOU WIN!"} else {var message = "YOU LOSE!"}; game_over = true};

		this.turn.phase++;
		if (this.turn.phase > 3){						
			this.turn.index++; 
			this.turn.phase = 0; 
			if (this.turn.index + this.turn.foresight > this.turn.sequence.length){calculate_turns.bind(this)()};
			if (this.player.mana_current + this.player.mana_regen >=  this.player.mana_max){this.player.mana_current = this.player.mana_max} else {this.player.mana_current += this.player.mana_regen};
		};
	};
	
	function calculate_turns(index, splice) {
		var units = {};
		var turn_agility = 0;

		var keys = Object.keys(unit_stats);
		var current = this.turn.sequence[index];
		
		var unit_buffs = unit_stats;

		for (var i = 0; i < keys.length; ++i) {
			var p = keys[i];
			var unit = this.fighters[p]

			unit._agi = { factor: 1, total: 0, actions: 0 };

			if (current != undefined) {
				for (var i2 = 0; i2 < current.unit_stats[p].buffs.length; ++i2) {
					var p2 = current.unit_stats[p].buffs[i2];
					if (p2.effects == "speed_up") {if (p2.duration >= this.turn.sequence_max) {unit._agi.factor += p2.factor} else {unit._agi.factor += p2.factor * (p2.duration / this.turn.sequence_max)}}
				}
			}

			unit._agi.total = unit.agility * unit._agi.factor;
			units[p] = unit;
			turn_agility += unit._agi.total;
		}

		for (var i = 0; i < keys.length; ++i) {
			var unit = units[keys[i]];

			unit._agi.actions = Math.round((unit._agi.total) / (turn_agility) * this.turn.sequence_max);

			if (unit._agi.actions >= this.turn.sequence_max) { unit._agi.actions = this.turn.sequence_max - (keys.length - 1) };
			if (unit._agi.actions <= 1) { unit._agi.actions = 1 };
		}

		var temp_sequence = [];

		while (temp_sequence.length < this.turn.sequence_max) {
			var origin_dice = [];
			for (var i = 0; i < keys.length; ++i) { var unit = units[keys[i]]; if (unit._agi.actions > 0) { origin_dice.push(keys[i]) } };
			var origin_random = Math.floor(Math.random() * origin_dice.length);
			var origin = origin_dice[origin_random];
			units[origin]._agi.actions--;

			var target_dice = [];
			for (var i = 0; i < keys.length; ++i) { if (keys[i] != origin) { target_dice.push(keys[i]) } };
			var target_random = Math.floor(Math.random() * target_dice.length);
			var target = target_dice[target_random];
			if (splice == undefined){var unit_stats_temp = unit_stats.clone()} else {var unit_stats_temp = this.turn.sequence[index].unit_stats.clone()};

			var damage_obj = {
				health: 0,
				defense: 0,
				stamina: 0,
				leech_health: 0
			};

			temp_sequence.push({
				evaluated: false,
				origin: origin,
				target: target,
				action: "",
				unit_stats: unit_stats_temp,
				force: 1,
				poise: 1,
				damage: {
					target: damage_obj.clone(),
					origin: damage_obj.clone()
				}
			});
		};

		if (index == undefined) {
			for (var i = 0; i < temp_sequence.length; ++i) { this.turn.sequence.push(temp_sequence[i]) };
			evaluate_sequence.bind(this)(0);
		} else {
			var index_base = index;

			if (splice != undefined) { this.turn.sequence.splice(index, splice) };

			for (var i = 0; i < temp_sequence.length; ++i) {
				this.turn.sequence.splice(index, 0, temp_sequence[i]);
				index++
			};

			evaluate_sequence.bind(this)(index_base);
		}
	};

	function evaluate_sequence(index) {
		var current = this.turn.sequence[index];
		var next = this.turn.sequence[index + 1];

		if (!current.evaluated) {
			var origin = current.origin;
			var target = current.target;
			var fighters = [origin, target];

			var buff_effects = {};

			for (var u = 0; u < fighters.length; ++u) {
				var b = fighters[u];
				var next_unit = current.unit_stats[b].clone();

				for (var i = 0; i < next_unit.buffs.length; ++i) {
					var p = next_unit.buffs[i];
					if (p.duration > 0) { next_unit.buffs[i].duration-- } else { next_unit.buffs.splice(i, 1); i-- }
				}

				for (var i = 0; i < next_unit.debuffs.length; ++i) {
					var p = next_unit.debuffs[i];
					if (p.duration > 0) { next_unit.debuffs[i].duration-- } else { next_unit.debuffs.splice(i, 1); i-- }
				}

				var stamina_regen = this.fighters[b].stamina_max * COMBAT.stamina_regen_factor;

				for (var i = 0; i < next_unit.staminaregen.length; ++i) {
					var p = next_unit.staminaregen[i];
					if (p > 0) {
					next_unit.staminaregen[i]--;
						if (next_unit.stamina + stamina_regen >= this.fighters[b].stamina_max) {
							next_unit.stamina = this.fighters[b].stamina_max;
						} else {
							next_unit.stamina += stamina_regen;
						}
					} else { next_unit.staminaregen.splice(i, 1); i-- }
				};

				buff_effects[b] = {
					health_dmg_add: 0,
					defense_dmg_add: 0,
					health_dmg_reflect_add: 0,
					reduce_dmg_divide: 1,
					defense_dmg_reflect_add: 0,
					blocks_add: 0,
					transmute_add: 0,
					force_add: 0,
					stamina_dmg_add: 0,
					stun_add: 0,
					stamina_heal_add: 0,
					health_heal_add: 0,
					lifesteal_add: 0,

					health_dmg_multiply: 1,
					defense_dmg_multiply: 1,
					stamina_dmg_multiply: 1,
					force_multiply: 1,
					reduce_dmg_subtract: 0,

					debuff_bleed_add: 0,
					debuff_encumber_add: 0,
					debuff_poison_add: 0,
				};

				for (var i = 0; i < current.unit_stats[b].buffs.length; ++i) {
					var p = current.unit_stats[b].buffs[i];
					var effects_check = p.effects.split("_")
					switch (effects_check[effects_check.length - 1]) {
						case "add": buff_effects[b][p.effects] += p.factor; break;
						case "multiply": buff_effects[b][p.effects] *= p.factor; break;
						case "subtract": buff_effects[b][p.effects] -= p.factor; break;
						case "divide": buff_effects[b][p.effects] /= p.factor; break;
					};
				};

				if (buff_effects[b]["health_heal_add"] > 0) {
					if (next_unit.health + buff_effects[b]["health_heal_add"] >= this.fighters[b].health_max) {next_unit.health = this.fighters[b].health_max}
					else {next_unit.health += buff_effects[b]["health_heal_add"]};
				};

				if (buff_effects[b]["stamina_heal_add"] > 0) {
					if (next_unit.stamina + buff_effects[b]["stamina_heal_add"] >= this.fighters[b].stamina_max) {next_unit.stamina = this.fighters[b].stamina_max}
					else {next_unit.stamina += buff_effects[b]["stamina_heal_add"]};
				};

				if (buff_effects[b]["blocks_add"] > 0) {
					if (next_unit.block + buff_effects[b]["blocks_add"] >= COMBAT.blocks_max) {next_unit.block = COMBAT.blocks_max} 
					else {next_unit.block += buff_effects[b]["blocks_add"]};
				};

				if (buff_effects[b]["transmute_add"] > 0) {
					if (next_unit.health - buff_effects[b]["transmute_add"] / 2 <= 0) {next_unit.health = 1}
					else {next_unit.health -= buff_effects[b]["transmute_add"] / 2};

					if (next_unit.defense + buff_effects[b]["transmute_add"] >= this.fighters[b].defense_max) {next_unit.defense = this.fighters[b].defense_max}
					else {next_unit.defense += buff_effects[b]["transmute_add"]};
				};

				next.unit_stats[b] = next_unit;
			};

			var stunned = false;
			for (var i = 0; i < next.unit_stats[origin].debuffs.length; ++i) {var p = next.unit_stats[origin].debuffs[i]; if (p.alias == "stun"){stunned = true}};

			if (!stunned){
				if (current.unit_stats[origin].stamina > 0) {
					var attack_chance = (current.unit_stats[origin].stamina / this.fighters[origin].stamina_max) * 100;
					var attack_proc = ((Math.random() * this.fighters[origin].stamina_max) / this.fighters[origin].stamina_max) * 100;					

					if (attack_proc <= attack_chance) { var action = "attack" } else { var action = "cast" };
				} else {
					var action = "cast"
				}	
			} else {
				var action = "skip"
			};		

			current.action = action;
			current.force = this.fighters[origin].force + buff_effects[origin].force_add;
			current.poise = this.fighters[target].poise;

			current.evaluated = true;	

			this["action_" + action](index, buff_effects);
		}

		index++
		if (index < this.turn.sequence.length - 3) { evaluate_sequence.bind(this)(index) };
	};

	function run_turns(){
		if (MMG.stage == undefined) return null;
		
		if (this.turn.sequence.length == 0){
			while(this.turn.sequence.length < this.turn.foresight - this.turn.sequence_max){calculate_turns.bind(this)()};
			calculate_turns.bind(this)();
		} else {
			if (!game_over){
				var current = this.turn.sequence[this.turn.index];
				var next_turn = this.turn.sequence[this.turn.index + 1];

				var origin = this.getUnit(current.origin);
				var target = this.getUnit(current.target);

			
				switch(this.turn.phase){
					case -1:
						if (Math.abs(origin.locX - target.locX) < COMBAT.attack_distance){change_turn_phase.bind(this)()} else {origin.walk_forward(); target.walk_forward()};
						break
					case 0: 						
						origin.set_stats(current.unit_stats[current.origin]);
						target.set_stats(current.unit_stats[current.target]);
						change_turn_phase.bind(this)();
						break;

					case 1:
						var listener = origin[current.action](target, current);
						if (listener.origin && listener.target){change_turn_phase.bind(this)()};
						break;

					case 2:
						switch(next_turn.action){
							case "attack":
								var next_origin = this.getUnit(next_turn.origin);
								var next_target = this.getUnit(next_turn.target);
								if (Math.abs(next_origin.locX - next_target.locX) > COMBAT.attack_distance){next_origin.face_location(next_target.locX); next_origin.walk_forward()} else {change_turn_phase.bind(this)()};								
								break
							
							case "cast":
							case "skip":
								change_turn_phase.bind(this)();
								break
						}
						break

					case 3:
						apply_buffs.bind(this)(origin);
						apply_buffs.bind(this)(target);
						change_turn_phase.bind(this)();
						break;
				};
			} else {
				if (game_over_delay > 0){
					if (game_over_delay == 100){
						var hero = MMG.stage.getUnit("hero");
						var enemy = MMG.stage.getUnit("enemy");
						if (hero.current.health <= 0 ){hero.setAnimation("flinch"); var message = "YOU LOSE!"};
						if (enemy.current.health <= 0 ){enemy.setAnimation("flinch"); var message = "YOU WIN!"};

						this.drawFlyingText(message, "#000", "54px Arial", 100, MMG.resolution.width/2, MMG.resolution.height/2 + 50, 270);
					}		

					game_over_delay--;
				} else {
					MMG.loadScene("loader");
				}
			}
			
		};
	};	

	this.always(run_turns.bind(this));

	
}})