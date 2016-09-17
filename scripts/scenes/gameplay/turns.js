define(function () { return function(){
	var unit_stats = {
		"hero": initialize_stats.bind(this)("hero", this.world.width/2 - 45),
		"enemy": initialize_stats.bind(this)("enemy", this.world.width/2 + 45),
	};

	SOCKET.on("res.update_turns", function(res){
		GLOBALS.turn_data = res;
	});

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
		var next_turn = GLOBALS.turn_data[this.turn.index + 1];

		if (unit.prebuffs.length > 0){
			if (next_turn.unit_stats[unit.alias].buffs.length < 10){
				
				for (var i = 0; i < unit.prebuffs.length; ++i) {
					var p = unit.prebuffs[i];
					GLOBALS.turn_data[this.turn.index + 1].unit_stats[unit.alias].buffs.push(p);
					
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

				for (var i = this.turn.index + 1; i < GLOBALS.turn_data.length; ++i) {
					var p = GLOBALS.turn_data[i];
					p.evaluated = false;
				};

			

				if (recalc_turns){
					var test_before = [];
					var test_after = []
					
					for (var i = this.turn.index; i < recalc_duration + this.turn.index; ++i) {
						var p = GLOBALS.turn_data[i];
						test_before.push(p.origin)
					}

					calculate_turns.bind(this)(this.turn.index + 1, recalc_duration);

					for (var i = this.turn.index; i < recalc_duration + this.turn.index; ++i) {
						var p = GLOBALS.turn_data[i];
						test_after.push(p.origin)
					}
				} else {
					evaluate_sequence.bind(this)(this.turn.index + 1)
				};
			};
		};
	};

	function change_turn_phase(){
		var current = GLOBALS.turn_data[this.turn.index];

		var origin = this.getUnit(current.origin);
		var target = this.getUnit(current.target);

		if (origin.current.health <= 0 || target.current.health <= 0){if (origin.alias == "hero"){var message = "YOU WIN!"} else {var message = "YOU LOSE!"}; game_over = true};

		this.turn.phase++;
		if (this.turn.phase > 3){						
			this.turn.index++; 
			this.turn.phase = 0; 
			if (this.turn.index + this.turn.foresight > GLOBALS.turn_data.length){
				SOCKET.emit("req.update_turns", {game_id: GLOBALS.game_id, game_index: this.turn.index});
			};
			if (this.player.mana_current + this.player.mana_regen >=  this.player.mana_max){this.player.mana_current = this.player.mana_max} else {this.player.mana_current += this.player.mana_regen};
		};
	};



	function run_turns(){
		if (MMG.stage == undefined) return null;
		
		if (!game_over){
			var current = GLOBALS.turn_data[this.turn.index];
			var next_turn = GLOBALS.turn_data[this.turn.index + 1];

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
				MMG.loadScene("menu");
			}
		}
		
	};
	

	this.always(run_turns.bind(this));

	
}})