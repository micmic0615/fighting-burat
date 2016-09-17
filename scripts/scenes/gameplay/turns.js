define(function () { return function(){
	var unit_stats = {
		"hero": initialize_stats.bind(this)("hero", this.world.width/2 - 45),
		"enemy": initialize_stats.bind(this)("enemy", this.world.width/2 + 45),
	};

	SOCKET.on("res.game_extend", function(res){
		GLOBALS.turn_data = res;
	});

	SOCKET.on("res.game_buff_eval", function(res){
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
				SOCKET.emit("req.game_extend", {game_id: GLOBALS.game_id, game_index: this.turn.index});
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
					if (this.getUnit(GLOBALS.my_fighter).prebuffs.length > 0){
						SOCKET.emit("req.game_buff_eval", {game_id: GLOBALS.game_id, game_index: this.turn.index, user_id: USER._id, prebuffs: this.getUnit(GLOBALS.my_fighter).prebuffs});
						this.getUnit(GLOBALS.my_fighter).prebuffs = [];
					};

					change_turn_phase.bind(this)();
					break;
			};
		} else {
			if (game_over_delay > 0){
				if (game_over_delay == 100){
					var hero = MMG.stage.getUnit("hero");
					var enemy = MMG.stage.getUnit("enemy");

					if (GLOBALS.my_fighter == "hero"){
						if (hero.current.health <= 0 ){hero.setAnimation("flinch"); var message = "YOU LOSE"};
						if (enemy.current.health <= 0 ){enemy.setAnimation("flinch"); var message = "YOU WIN"};
					} else {
						if (hero.current.health <= 0 ){hero.setAnimation("flinch"); var message = "YOU WIN"};
						if (enemy.current.health <= 0 ){enemy.setAnimation("flinch"); var message = "YOU LOSE"};
					}

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