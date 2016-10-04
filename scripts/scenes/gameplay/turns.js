define(function () { return function(){
	var unit_stats = {
		"hero": initializeStats.bind(this)("hero", this.world.width/2 - 45),
		"enemy": initializeStats.bind(this)("enemy", this.world.width/2 + 45),
	};
	
	SOCKET.on("res.game_end", function(res){
		SOCKET.emit("req.game_disconnect", GLOBALS.game_id);
		delete GLOBALS.game_id;
		delete GLOBALS.winner_id;
		delete GLOBALS.turn_data;
		delete GLOBALS.match_players;
		RAN.clear();
		MMG.loadScene("menu");
	}.bind(this));

	SOCKET.on("res.game_buff_send", function(res){
		this.getUnit(res.unit_alias).prebuffs = res.buffs
		this.turn.index = res.turn_index;
		RAN.set_seed(res.seed_index);

		if (res.unit_alias == GLOBALS.my_fighter){
			for (var i = 0; i < this.player.buffs_queued.length; ++i) {this.buffShuffle(this.player.buffs_queued[i])};
			this.player.buffs_queued = [];
		}
	}.bind(this));

	var game_over = false;
	var game_over_delay = 100;

	function initializeStats(alias, locX){
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
			fracture: unit.current.defense,
			block: unit.current.block,			
			buffs: unit.buffs,
			debuffs: unit.debuffs,
			staminaregen: unit.staminaregen,
			locX: locX
		};
	};	

	function applyBuffs(unit){
		var next_turn = this.turn.sequence[this.turn.index + 1];
		if (unit.prebuffs.length > 0){
			if (next_turn.unit_stats[unit.alias].buffs.length < 10){
				
				for (var i = 0; i < unit.prebuffs.length; ++i) {
					var p = unit.prebuffs[i];
					this.turn.sequence[this.turn.index + 1].unit_stats[unit.alias].buffs.push(p);	
					unit.prebuffs.splice(i,1); i--;
				};
			};

			var recalc_turns = false;
			var recalc_duration = 0;

			for (var i = 0; i < next_turn.unit_stats[unit.alias].buffs.length; ++i) {
				var p = next_turn.unit_stats[unit.alias].buffs[i];

				for (var i2 = 0; i2 < p.effects.length; ++i2) {
					var p2 = p.effects[i2];
					if (p2.name == "compound.speed" && (p.used == undefined || p.used == false)) {
						p.used = true;
						recalc_turns = true
						if (p.duration > recalc_duration){recalc_duration = p.duration}
					}
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

				calculateTurns.bind(this)(this.turn.index + 1, recalc_duration);

				for (var i = this.turn.index; i < recalc_duration + this.turn.index; ++i) {
					var p = this.turn.sequence[i];
					test_after.push(p.origin)
				}
			} else {
				evaluateSequence.bind(this)(this.turn.index + 1)
			};
		};
	};

	function changeTurnPhase(){
		var current = this.turn.sequence[this.turn.index];
		var next = this.turn.sequence[this.turn.index + 1];
		
		var origin = this.getUnit(current.origin);
		var target = this.getUnit(current.target);

		var fighters = ["hero", "enemy"]

		for (var u = 0; u < fighters.length; ++u) {var b = fighters[u];
			for (var i = 0; i < next.unit_stats[b].buffs.length; ++i) {
				var p = next.unit_stats[b].buffs[i];
				for (var i2 = 0; i2 < p.sfx.length; ++i2) {
					var p2 = p.sfx[i2];
					if (p2.trigger == "spell"){
						var sfx_dummy = this.getDummySFX();
				
						if (p2.unit == "origin"){sfx_dummy.unit = b} 
						else {
							if (b == "hero"){sfx_dummy.unit = "enemy"} 
							else {sfx_dummy.unit = "hero"}
						}

						sfx_dummy.life = p2.life;
						sfx_dummy.setAnimation(p2.sprite);
					}
				}
			}
		}

		if (origin.current.health <= 0 || target.current.health <= 0){if (origin.alias == "hero"){var message = "YOU WIN!"} else {var message = "YOU LOSE!"}; game_over = true};

		this.turn.phase++;
		if (this.turn.phase > 3){						
			this.turn.index++; 
			this.turn.phase = 0; 
			if (this.turn.index + this.turn.foresight > this.turn.sequence.length){calculateTurns.bind(this)()};
			if (this.player.mana_current + this.player.mana_regen >=  this.player.mana_max){this.player.mana_current = this.player.mana_max} else {this.player.mana_current += this.player.mana_regen};
		};
	};
	
	function calculateTurns(index, splice) {
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
					for (var i3 = 0; i3 < p2.effects.length; ++i3) {
						var p3 = p2.effects[i3];
						if (p3.name == "compound.speed") {if (p2.duration >= this.turn.sequence_max) {unit._agi.factor += p3.factor} else {unit._agi.factor += p3.factor * (p2.duration / this.turn.sequence_max)}}
					}
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
			var origin_random = Math.floor(RAN.get() * origin_dice.length);
			var origin = origin_dice[origin_random];
			units[origin]._agi.actions--;

			var target_dice = [];
			for (var i = 0; i < keys.length; ++i) { if (keys[i] != origin) { target_dice.push(keys[i]) } };
			var target_random = Math.floor(RAN.get() * target_dice.length);
			var target = target_dice[target_random];
			if (splice == undefined){var unit_stats_temp = unit_stats.clone()} else {var unit_stats_temp = this.turn.sequence[index].unit_stats.clone()};

			var damage_obj = {
				health: 0,
				defense: 0,
				stamina: 0,
				fracture: 0,
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
			evaluateSequence.bind(this)(0);
		} else {
			var index_base = index;

			if (splice != undefined) { this.turn.sequence.splice(index, splice) };

			for (var i = 0; i < temp_sequence.length; ++i) {
				this.turn.sequence.splice(index, 0, temp_sequence[i]);
				index++
			};

			evaluateSequence.bind(this)(index_base);
		}
	};

	function evaluateSequence(index) {
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
					if (p.type == "spell"){
						if (p.duration > 0) { p.duration-- } 
						else { 
							next_unit.buffs.splice(i, 1); i-- 
						}
					}
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

				buff_effects[b] = this.buff_effects.clone();				

				for (var i = 0; i < current.unit_stats[b].buffs.length; ++i) {
					var p = current.unit_stats[b].buffs[i];
					for (var i2 = 0; i2 < p.effects.length; ++i2) {
						var p2 = p.effects[i2];
						var effects_check = p2.name.split(".");
						switch (effects_check[0]) {
							case "simple": buff_effects[b][p2.name] += p2.factor; break
							case "compound": buff_effects[b][p2.name] *= p2.factor; break
						};		
					};
				};

				if (buff_effects[b]["simple.heal_health"] != 0) {
					if (next_unit.health + buff_effects[b]["simple.heal_health"] >= this.fighters[b].health_max) {next_unit.health = this.fighters[b].health_max}
					else {next_unit.health += buff_effects[b]["simple.heal_health"]};
				};

				if (buff_effects[b]["simple.heal_defense"] != 0) {
					if (next_unit.defense + buff_effects[b]["simple.heal_defense"] >= this.fighters[b].defense_max) {next_unit.defense = this.fighters[b].defense_max}
					else {next_unit.defense += buff_effects[b]["simple.heal_defense"]};
				};

				if (buff_effects[b]["simple.heal_stamina"] != 0) {
					if (next_unit.stamina + buff_effects[b]["simple.heal_stamina"] >= this.fighters[b].stamina_max) {next_unit.stamina = this.fighters[b].stamina_max}
					else {next_unit.stamina += buff_effects[b]["simple.heal_stamina"]};
				};

				if (buff_effects[b]["simple.heal_block"] != 0) {
					if (next_unit.block + buff_effects[b]["simple.heal_block"] >= COMBAT.blocks_max) {next_unit.block = COMBAT.blocks_max} 
					else {next_unit.block += buff_effects[b]["simple.heal_block"]};
				};

				var fracture_regain = this.fighters[b].defense_max*COMBAT.fracture_regain;
				if (next_unit.fracture + fracture_regain < this.fighters[b].defense_max){next_unit.fracture += fracture_regain} else {next_unit.fracture = this.fighters[b].defense_max};

				next.unit_stats[b] = next_unit;
			};

			var stunned = false;
			for (var i = 0; i < next.unit_stats[origin].debuffs.length; ++i) {var p = next.unit_stats[origin].debuffs[i]; if (p.alias == "stun"){stunned = true}};

			if (!stunned){
				if (current.unit_stats[origin].stamina > 0) {
					var attack_chance = (current.unit_stats[origin].stamina / this.fighters[origin].stamina_max) * 100;
					var attack_proc = ((RAN.get() * this.fighters[origin].stamina_max) / this.fighters[origin].stamina_max) * 100;					

					if (attack_proc <= attack_chance) { var action = "attack" } else { var action = "cast" };
				} else {
					var action = "cast";
				}	
			} else {
				var action = "skip";
			};		

			current.action = action;
			current.force = this.fighters[origin].force + buff_effects[origin]["simple.force"];
			current.poise = this.fighters[target].poise;

			current.evaluated = true;	

			this["action" + action.toUpperFirst()](index, buff_effects);
		}

		index++
		if (index < this.turn.sequence.length - 3) { evaluateSequence.bind(this)(index) };
	};

	function runTurns(){
		if (MMG.stage == undefined) return null;
		
		if (this.turn.sequence.length == 0){
			while(this.turn.sequence.length < this.turn.foresight - this.turn.sequence_max){calculateTurns.bind(this)()};
			calculateTurns.bind(this)();
		} else {
			if (!game_over){
				var current = this.turn.sequence[this.turn.index];
				var next_turn = this.turn.sequence[this.turn.index + 1];

				var origin = this.getUnit(current.origin);
				var target = this.getUnit(current.target);
				
				
				
				switch(this.turn.phase){
					case -1:
						if (Math.abs(origin.locX - target.locX) < COMBAT.attack_distance){changeTurnPhase.bind(this)()} else {origin.walkForward(); target.walkForward()};
						break
					case 0: 	
						origin.zIndex = 11;
						target.zIndex = 10;
						
						origin.setStats(current.unit_stats[current.origin]);
						target.setStats(current.unit_stats[current.target]);
						origin.animation.speed = 1;
						target.animation.speed = 1;
						
						for (var i = 0; i < origin.buffs.length; ++i) {
							var p = origin.buffs[i];
							for (var i2 = 0; i2 < p.effects.length; ++i2) {
								var p2 = p.effects[i2];
								if (p2.name == "compound.speed") {origin.animation.speed /= p2.factor}
							}
						}
						
						changeTurnPhase.bind(this)();
						break;

					case 1:
						var listener = origin[current.action](target, current);
						if (listener.origin && listener.target){changeTurnPhase.bind(this)()};
						break;

					case 2:
						switch(next_turn.action){
							case "attack":
								var next_origin = this.getUnit(next_turn.origin);
								var next_target = this.getUnit(next_turn.target);
								if (Math.abs(next_origin.locX - next_target.locX) > COMBAT.attack_distance){next_origin.faceLocation(next_target.locX); next_origin.walkForward()} else {changeTurnPhase.bind(this)()};								
								break
							
							case "cast":
							case "skip":
								changeTurnPhase.bind(this)();
								break
						}
						break

					case 3:		
						if (this.getUnit(GLOBALS.my_fighter).queuebuffs.length > 0){
							SOCKET.emit("req.game_buff_send", {
								game_id: GLOBALS.game_id, 
								turn_index: this.turn.index, 
								seed_index: RAN.seed_index, 
								unit_alias: GLOBALS.my_fighter, 
								buffs: this.getUnit(GLOBALS.my_fighter).queuebuffs
							});
							this.getUnit(GLOBALS.my_fighter).queuebuffs = [];
						};

						applyBuffs.bind(this)(origin);
						applyBuffs.bind(this)(target);
						
						changeTurnPhase.bind(this)();
						
						break;
				};
			} else {
				if (game_over_delay > 0){
					if (game_over_delay == 100){
						var hero = this.getUnit("hero");
						var enemy = this.getUnit("enemy");

						if (GLOBALS.my_fighter == "hero"){
							if (hero.current.health <= 0 ){hero.setAnimation("flinch"); var message = "YOU LOSE"};
							if (enemy.current.health <= 0 ){enemy.setAnimation("flinch"); var message = "YOU WIN"; GLOBALS.winner_id = USER._id};
						} else {
							if (hero.current.health <= 0 ){hero.setAnimation("flinch"); var message = "YOU WIN"; GLOBALS.winner_id = USER._id};
							if (enemy.current.health <= 0 ){enemy.setAnimation("flinch"); var message = "YOU LOSE"};
						}
						
						this.drawObj("flyingText", {text: message, color:"#000", fontSize: 54, life:100, x: MMG.resolution.width/2, y: MMG.resolution.height/2 + 50, angle: 270});
					}		

					game_over_delay--;
				} else {
					SOCKET.emit("req.game_end", {game_id: GLOBALS.game_id, winner_id: GLOBALS.winner_id});
				}
			}
			
		};
	};	

	this.always(runTurns.bind(this));
}})