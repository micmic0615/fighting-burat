define(function () { return function(){
	var turn = this.turn;
	var combat = this.combat;
	var player = this.player;

	var next = {};

	var unit_stats = {
		hero: initialize_stats(this.getUnit("hero"), this.world.width/2 - 45),
		enemy: initialize_stats(this.getUnit("enemy"), this.world.width/2 + 45),
	};

	var game_over = false;
	var game_over_delay = 100;

	function initialize_stats(unit, locX){
		return {
			health: unit.current.health,
			stamina: unit.current.stamina,
			defense: unit.current.defense,
			block: unit.current.block,
			health_max: unit.derived.health,
			stamina_max: unit.derived.stamina,
			defense_max: unit.derived.defense,
			damage: unit.derived.damage,
			force: unit.derived.force,
			poise: unit.derived.poise,
			stamina_cost: unit.derived.cost,
			aggresion: 1,
			buffs: unit.buffs,
			debuffs: unit.debuffs,
			staminaregen: unit.staminaregen,
			locX: locX
		};
	};	

	function apply_buffs(unit){
		var next_turn = turn.sequence[turn.index + 1];

		if (unit.prebuffs.length > 0){
			if (next_turn.unit_stats[unit.alias].buffs.length < 10){
				
				for (var i = 0; i < unit.prebuffs.length; ++i) {
					var p = unit.prebuffs[i];
					turn.sequence[turn.index + 1].unit_stats[unit.alias].buffs.push(p);
					
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

				for (var i = turn.index + 1; i < turn.sequence.length; ++i) {
					var p = turn.sequence[i];
					p.evaluated = false;
				};

				if (recalc_turns){
					var test_before = [];
					var test_after = []
					
					for (var i = turn.index; i < recalc_duration + turn.index; ++i) {
						var p = turn.sequence[i];
						test_before.push(p.origin)
					}

					calculate_turns.bind(this)(turn.index + 1, recalc_duration);

					for (var i = turn.index; i < recalc_duration + turn.index; ++i) {
						var p = turn.sequence[i];
						test_after.push(p.origin)
					}
				} else {
					evaluate_sequence.bind(this)(turn.index + 1)
				};
			};
		};
	};

	function change_turn_phase(){
		var current_turn = turn.sequence[turn.index];

		var origin = this.getUnit(current_turn.origin);
		var target = this.getUnit(current_turn.target);

		if (origin.current.health <= 0 || target.current.health <= 0){if (origin.alias == "hero"){var message = "YOU WIN!"} else {var message = "YOU LOSE!"}; game_over = true};

		turn.phase++;
		if (turn.phase > 3){						
			turn.index++; 
			turn.phase = 0; 
			if (turn.index + turn.foresight > turn.sequence.length){calculate_turns.bind(this)()};
			if (player.mana_current + player.mana_regen >=  player.mana_max){player.mana_current = player.mana_max} else {player.mana_current += player.mana_regen};
		};
	};
	
	function calculate_turns(index, splice) {
		var units = {};
		var turn_agility = 0;

		var keys = Object.keys(unit_stats);
		var current_turn = turn.sequence[index];
		
		var unit_buffs = unit_stats;

		for (var i = 0; i < keys.length; ++i) {
			var p = keys[i];
			var unit = JSON.parse(JSON.stringify(this.getUnit(p).derived));

			unit._agi = { factor: 1, total: 0, actions: 0 };

			if (current_turn != undefined) {
				for (var i2 = 0; i2 < current_turn.unit_stats[p].buffs.length; ++i2) {
					var p2 = current_turn.unit_stats[p].buffs[i2];
					if (p2.effects == "speed_up") {if (p2.duration >= turn.sequence_max) {unit._agi.factor += p2.factor} else {unit._agi.factor += p2.factor * (p2.duration / turn.sequence_max)}}
				}
			}

			unit._agi.total = unit.agility * unit._agi.factor;
			units[p] = unit;
			turn_agility += unit._agi.total;
		}

		for (var i = 0; i < keys.length; ++i) {
			var unit = units[keys[i]];

			unit._agi.actions = Math.round((unit._agi.total) / (turn_agility) * turn.sequence_max);

			if (unit._agi.actions >= turn.sequence_max) { unit._agi.actions = turn.sequence_max - (keys.length - 1) };
			if (unit._agi.actions <= 1) { unit._agi.actions = 1 };
		}

		var temp_sequence = [];

		while (temp_sequence.length < turn.sequence_max) {
			var origin_dice = [];
			for (var i = 0; i < keys.length; ++i) { var unit = units[keys[i]]; if (unit._agi.actions > 0) { origin_dice.push(keys[i]) } };
			var origin_random = Math.floor(Math.random() * origin_dice.length);
			var origin = origin_dice[origin_random];
			units[origin]._agi.actions--;

			var target_dice = [];
			for (var i = 0; i < keys.length; ++i) { if (keys[i] != origin) { target_dice.push(keys[i]) } };
			var target_random = Math.floor(Math.random() * target_dice.length);
			var target = target_dice[target_random];
			if (splice == undefined){var unit_stats_temp = JSON.parse(JSON.stringify(unit_stats))} else {var unit_stats_temp = JSON.parse(JSON.stringify(turn.sequence[index].unit_stats))};

			temp_sequence.push({
				evaluated: false,
				origin: origin,
				target: target,
				action: "",
				unit_stats: unit_stats_temp,
				force: 1,
				poise: 1,
				text: {
					damage_health: 0,
					damage_defense: 0,
					damage_stamina: 0
				}
			});
		};

		if (index == undefined) {
			for (var i = 0; i < temp_sequence.length; ++i) { turn.sequence.push(temp_sequence[i]) };
			evaluate_sequence.bind(this)(0);
		} else {
			var index_base = index;

			if (splice != undefined) { turn.sequence.splice(index, splice) };

			for (var i = 0; i < temp_sequence.length; ++i) {
				turn.sequence.splice(index, 0, temp_sequence[i]);
				index++
			};

			evaluate_sequence.bind(this)(index_base);
		}
	};

	function evaluate_sequence(index) {
		var current = turn.sequence[index];
		var next = turn.sequence[index + 1];
		if (index > 0) { var prev = turn.sequence[index - 1] } else { var prev = current };
		if (index > 0) { var prev = turn.sequence[index - 1] };

		if (!current.evaluated) {
			var origin = current.origin;
			var target = current.target;
			var fighters = [origin, target];

			var buff_effects = {};

			for (var u = 0; u < fighters.length; ++u) {
				var b = fighters[u];
				var next_unit = next.unit_stats[b];

				next_unit = JSON.parse(JSON.stringify(current.unit_stats[b]));

				for (var i = 0; i < next_unit.buffs.length; ++i) {
					var p = next_unit.buffs[i];
					if (p.duration > 0) { next_unit.buffs[i].duration-- } else { next_unit.buffs.splice(i, 1); i-- }
				}

				for (var i = 0; i < next_unit.debuffs.length; ++i) {
					var p = next_unit.debuffs[i];
					if (p.duration > 0) { next_unit.debuffs[i].duration-- } else { next_unit.debuffs.splice(i, 1); i-- }
				}

				var stamina_regen = next_unit.stamina_max * combat.stamina_regen_factor;

				for (var i = 0; i < next_unit.staminaregen.length; ++i) {
					var p = next_unit.staminaregen[i];
					if (p > 0) {
					next_unit.staminaregen[i]--;
						if (next_unit.stamina + stamina_regen >= next_unit.stamina_max) {
							next_unit.stamina = next_unit.stamina_max;
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
					if (next_unit.health + buff_effects[b]["health_heal_add"] >= next_unit.health_max) {next_unit.health = next_unit.health_max}
					else {next_unit.health += buff_effects[b]["health_heal_add"]};
				};

				if (buff_effects[b]["stamina_heal_add"] > 0) {
					if (next_unit.stamina + buff_effects[b]["stamina_heal_add"] >= next_unit.stamina_max) {ext_unit.stamina = next_unit.stamina_max}
					else {next_unit.stamina += buff_effects[b]["stamina_heal_add"]};
				};

				if (buff_effects[b]["blocks_add"] > 0) {
					if (next_unit.block + buff_effects[b]["blocks_add"] >= combat.blocks_max) {next_unit.block = combat.blocks_max} 
					else {next_unit.block += buff_effects[b]["blocks_add"]};
				};

				if (buff_effects[b]["transmute_add"] > 0) {
					if (next_unit.health - buff_effects[b]["transmute_add"] / 2 <= 0) {next_unit.health = 1}
					else {next_unit.health -= buff_effects[b]["transmute_add"] / 2};

					if (next_unit.defense + buff_effects[b]["transmute_add"] >= next_unit.defense_max) {next_unit.defense = next_unit.defense_max}
					else {next_unit.defense += buff_effects[b]["transmute_add"]};
				};

			
			};

			var stunned = false;
			for (var i = 0; i < next.unit_stats[origin].debuffs.length; ++i) {var p = next.unit_stats[origin].debuffs[i]; if (p.alias == "stun"){stunned = true}};

			if (!stunned){
				if (current.unit_stats[origin].stamina > 0) {
					var attack_chance = (current.unit_stats[origin].stamina / current.unit_stats[origin].stamina_max) * 100;
					var attack_proc = ((Math.random() * current.unit_stats[origin].stamina_max) / current.unit_stats[origin].stamina_max) * 100;					

					if (attack_proc <= attack_chance) { var action = "attack" } else { var action = "cast" };
				} else {
					var action = "cast"
				}	
			} else {
				var action = "skip"
			};				

			var damage_health = 0;
			var damage_defense = 0;
			var damage_stamina = 0;

			var return_damage_health = 0;
			var return_damage_defense = 0;
			var return_damage_stamina = 0;

			var leech_health = 0;

			var knockback_damage = 0;

			var push_force = current.unit_stats[origin].force + buff_effects[origin].force_add;
			var push_poise = current.unit_stats[target].poise;			

			switch (action) {
				case "attack":
					this.calc_attack(current.unit_stats[origin], current.unit_stats[target]);

					var damage_total = (current.unit_stats[origin].damage * buff_effects[origin].health_dmg_multiply * buff_effects[target].reduce_dmg_divide) + (buff_effects[origin].health_dmg_add + buff_effects[target].reduce_dmg_subtract);

					if (current.unit_stats[target].block > 0) {
						var damage_health_factor = 0.25;
						var damage_defense_factor = 0.75;
						var push_resist = 2;
						next.unit_stats[target].block--;
					} else {
						var damage_health_factor = 0.5;
						var damage_defense_factor = 0.5;
						var push_resist = 1;
					}

					if (Math.round(damage_total * damage_defense_factor) >= current.unit_stats[target].defense) {
						damage_defense = current.unit_stats[target].defense;
						var damage_defense_spill = Math.round(damage_total * damage_defense_factor) - damage_defense;
					} else {
						damage_defense = Math.round(damage_total * damage_defense_factor);
						var damage_defense_spill = 0;
					}

					damage_defense *= buff_effects[origin].defense_dmg_multiply;
					damage_defense += buff_effects[origin].defense_dmg_add;
					if (Math.round(damage_defense) >= current.unit_stats[target].defense) { damage_defense = current.unit_stats[target].defense }

					damage_health = Math.round((damage_total * damage_health_factor) + damage_defense_spill);

					if (current.unit_stats[target].stamina > 0) {
						damage_stamina = (current.unit_stats[target].stamina - (current.unit_stats[target].stamina / buff_effects[origin].stamina_dmg_multiply)) + buff_effects[origin].stamina_dmg_add;
					} else {
						damage_stamina = buff_effects[origin].stamina_dmg_add;
					}

					if (current.unit_stats[target].stamina - damage_stamina <= 0){damage_stamina *= 0.5};

					if (current.unit_stats[origin].locX > current.unit_stats[target].locX) { var push_direction = -1 } else { var push_direction = 1 };

					var total_push = (Math.round((push_force / push_poise) * combat.flinch_push_duration) * push_direction * combat.flinch_push_movement) + (push_direction * combat.flinch_push_movement * combat.flinch_push_base);
					total_push /= push_resist;

					if (next.unit_stats[target].locX + total_push <= combat.margin) {
						var knockback_damage = combat.margin - (next.unit_stats[target].locX + total_push);
						next.unit_stats[target].locX = combat.margin;
					} else if (next.unit_stats[target].locX + total_push >= this.world.width - combat.margin) {
						knockback_damage = (next.unit_stats[target].locX + total_push) - (this.world.width - combat.margin);
						next.unit_stats[target].locX = this.world.width - combat.margin;
					} else {
						next.unit_stats[target].locX += total_push;
					}

					damage_health += knockback_damage * combat.knockback_damage_factor;

					if (damage_defense_spill > 0){damage_health *= 1.25};

					if (Math.abs(current.unit_stats[origin].locX - current.unit_stats[target].locX) > combat.attack_distance) {
						current.unit_stats[origin].locX = current.unit_stats[target].locX + push_direction * -1 * combat.attack_distance;
						next.unit_stats[origin].locX = current.unit_stats[origin].locX;
					}					

					damage_health = Math.round(damage_health);
					damage_stamina = Math.round(damage_stamina);
					damage_defense = Math.round(damage_defense);

					next.unit_stats[target].health -= damage_health;
					next.unit_stats[target].stamina -= damage_stamina;
					next.unit_stats[target].defense -= damage_defense;

					return_damage_health = Math.round(buff_effects[target].health_dmg_reflect_add);
					return_damage_defense = Math.round(buff_effects[target].defense_dmg_reflect_add);		
					if (next.unit_stats[origin].defense - return_damage_defense <= 0){return_damage_defense = next.unit_stats[origin].defense};

					leech_health = Math.round(buff_effects[origin].lifesteal_add);

					if (next.unit_stats[origin].health + leech_health >= next.unit_stats[origin].health_max){
						next.unit_stats[origin].health = next.unit_stats[origin].health_max;
					} else {
						next.unit_stats[origin].health += leech_health;
					}
					
					next.unit_stats[origin].health -= return_damage_health;
					next.unit_stats[origin].defense -= return_damage_defense;
					next.unit_stats[origin].stamina -= next.unit_stats[origin].stamina_cost;

					if (buff_effects[origin].stun_add > 0){
						next.unit_stats[target].debuffs.push({
							alias: "stun",
							factor: 0,
							duration: buff_effects[origin].stun_add
						})
					};

					break;

				case "cast":
					next.unit_stats[origin].staminaregen.push(combat.stamina_regen_duration)

					if (next.unit_stats[origin].block + 1 >= combat.blocks_max) {
						next.unit_stats[origin].block = combat.blocks_max;
					} else {
						next.unit_stats[origin].block++;
					}

					if (current.unit_stats[origin].locX > current.unit_stats[target].locX) { var flee_direction = -1 } else { var flee_direction = 1 };
					var total_flee = flee_direction * combat.cast_repel_factor * (combat.cast_time_duration + combat.cast_channel_duration);

					if (next.unit_stats[target].locX + total_flee <= combat.margin) {
						next.unit_stats[target].locX = combat.margin
					} else if (next.unit_stats[target].locX + total_flee >= this.world.width - combat.margin) {
						next.unit_stats[target].locX = this.world.width - combat.margin
					} else {
						next.unit_stats[target].locX += total_flee;
					}

					break;

				case "skip":
					console.log("skip")
					break
			};

			current.action = action;
			current.text.damage_health = damage_health;
			current.text.damage_defense = damage_defense;
			current.text.damage_stamina = damage_stamina;

			current.text.return_damage_health = return_damage_health;
			current.text.return_damage_defense = return_damage_defense;
			current.text.return_damage_stamina = return_damage_stamina;

			current.text.leech_health = leech_health;

			current.force = push_force;
			current.poise = push_poise;

			current.evaluated = true;
		}

		index++
		if (index < turn.sequence.length - 3) { evaluate_sequence.bind(this)(index) };
	};

	function run_turns(){
		if (MMG.stage == undefined) return null;
		
		if (turn.sequence.length == 0){
			while(turn.sequence.length < turn.foresight - turn.sequence_max){calculate_turns.bind(this)()};
			calculate_turns.bind(this)();
		} else {
			if (!game_over){
				var current_turn = turn.sequence[turn.index];
				var next_turn = turn.sequence[turn.index + 1];

				var origin = this.getUnit(current_turn.origin);
				var target = this.getUnit(current_turn.target);

			
				switch(turn.phase){
					case -1:
						if (Math.abs(origin.locX - target.locX) < combat.attack_distance){change_turn_phase.bind(this)()} else {origin.walk_forward(); target.walk_forward()};
						break
					case 0: 						
						origin.set_stats(current_turn.unit_stats[current_turn.origin]);
						target.set_stats(current_turn.unit_stats[current_turn.target]);
						change_turn_phase.bind(this)();
						break;

					case 1:
						var listener = origin[current_turn.action](target, current_turn);
						if (listener.origin && listener.target){change_turn_phase.bind(this)()};
						break;

					case 2:
						switch(next_turn.action){
							case "attack":
								var next_origin = this.getUnit(next_turn.origin);
								var next_target = this.getUnit(next_turn.target);
								if (Math.abs(next_origin.locX - next_target.locX) > combat.attack_distance){next_origin.face_location(next_target.locX); next_origin.walk_forward()} else {change_turn_phase.bind(this)()};								
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