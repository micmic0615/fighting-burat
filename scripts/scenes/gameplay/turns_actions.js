define(function () {return function(){
	this["__proto__"].actionAttack = function(index, bfx){
		var current = this.turn.sequence[index];
		var next = this.turn.sequence[index + 1];

		var origin = current.origin;
		var target = current.target;
		var cu_stats = current.unit_stats;
		var nu_stats = next.unit_stats;

		var attack_health_factor = 0.5;
		var attack_defense_factor = 0.5;
		var push_resist = 1;
		var defense_break_amp = 1.25

		if (cu_stats[target].block > 0) {
			attack_health_factor = 0;
			attack_defense_factor = 1;
			push_resist = 2;
			defense_break_amp = 1
			nu_stats[target].block--;
		}

		var attack_normal = (this.fighters[origin].damage + bfx[origin]["simple.attack_normal"] - bfx[target]["simple.guard_normal"] ) * (bfx[origin]["compound.attack_normal"] / bfx[target]["compound.guard_normal"]);
		var stat_keys = ["stamina", "health", "defense", "fracture"];
		var stat_leech = ["leech_stamina", "leech_health", "leech_defense"]

		var attack = {
			stamina: bfx[origin]["simple.attack_stamina"],
			health: attack_normal * attack_health_factor,
			defense: attack_normal * attack_defense_factor,
			defense_break: false,
			fracture: 0,
			leech_health: bfx[origin]["simple.leech_health"],
			leech_defense: bfx[origin]["simple.leech_defense"],
			leech_stamina: bfx[origin]["simple.leech_stamina"],
			fracture_amp: 1,
			fracture_ref: nu_stats[target].fracture
		};

		var reflect = {
			stamina: bfx[target]["simple.return_stamina"],
			health: bfx[target]["simple.return_health"],
			defense: bfx[target]["simple.return_defense"],
			defense_break: false,
			fracture: 0,
			fracture_amp: 1,
			fracture_ref: nu_stats[origin].fracture
		};

		if (attack.stamina >= cu_stats[target].stamina){attack.stamina = cu_stats[target].stamina};

		if (attack.defense >= cu_stats[target].defense){
			attack.health += attack.defense - cu_stats[target].defense;
			attack.defense = cu_stats[target].defense;
		}

		attack.health = (attack.health + bfx[origin]["simple.attack_health"] - bfx[target]["simple.guard_health"]) * (bfx[origin]["compound.attack_health"] / bfx[target]["compound.guard_health"]);
		attack.defense = (attack.defense + bfx[origin]["simple.attack_defense"] - bfx[target]["simple.guard_defense"]) * (bfx[origin]["compound.attack_defense"] / bfx[target]["compound.guard_defense"]);

		if (attack.defense >= cu_stats[target].defense){
			attack.defense_break = true;
			attack.fracture = attack.defense - cu_stats[target].defense;
			attack.defense = cu_stats[target].defense;

			if (attack.fracture >= attack.fracture_ref){attack.fracture = attack.fracture_ref};
			attack.fracture_ref -= attack.fracture;
			attack.fracture_amp += (COMBAT.fracture_amp_max - COMBAT.fracture_amp_max*(attack.fracture_ref / this.fighters[target].defense_max));
		}

		var push_direction = 1
		if (cu_stats[origin].locX > cu_stats[target].locX) {push_direction = -1};

		var total_push = (Math.round(((this.fighters[origin].force + bfx[origin]["simple.force"]) / this.fighters[target].poise) * COMBAT.flinch_push_duration) * push_direction * COMBAT.flinch_push_movement) + (push_direction * COMBAT.flinch_push_movement * COMBAT.flinch_push_base);
		total_push /= push_resist;
		
		var knockback_damage = 0;
		if (nu_stats[target].locX + total_push <= COMBAT.margin) {
			knockback_damage = COMBAT.margin - (nu_stats[target].locX + total_push);
			nu_stats[target].locX = COMBAT.margin;
		} else if (nu_stats[target].locX + total_push >= this.world.width - COMBAT.margin) {
			knockback_damage = (nu_stats[target].locX + total_push) - (this.world.width - COMBAT.margin);
			nu_stats[target].locX = this.world.width - COMBAT.margin;
		} else {
			nu_stats[target].locX += total_push;
		}

		attack.health += (((knockback_damage * COMBAT.knockback_damage_factor) - bfx[target]["simple.guard_normal"]) / bfx[target]["compound.guard_normal"]);
		if (attack.defense_break){attack.health *= defense_break_amp * attack.fracture_amp};
		
		if (Math.abs(cu_stats[origin].locX - cu_stats[target].locX) > COMBAT.attack_distance) {
			cu_stats[origin].locX = cu_stats[target].locX + push_direction * -1 * COMBAT.attack_distance;
			nu_stats[origin].locX = cu_stats[origin].locX;
		}

		reflect.health = (reflect.health + (bfx[target]["simple.reflect_health"] * attack.health) - bfx[origin]["simple.guard_health"]) / bfx[origin]["compound.guard_health"];
		reflect.defense = (reflect.defense + (bfx[target]["simple.reflect_defense"] * attack.defense) - bfx[origin]["simple.guard_defense"]) / bfx[origin]["compound.guard_defense"];
		
		if (reflect.defense >= cu_stats[origin].defense){
			reflect.defense_break = true;
			reflect.fracture = reflect.defense - cu_stats[origin].defense;
			reflect.defense = cu_stats[origin].defense;

			if (reflect.fracture >= reflect.fracture_ref){reflect.fracture = reflect.fracture_ref};
			reflect.fracture_ref -= reflect.fracture;
			reflect.fracture_amp += (COMBAT.fracture_amp_max - COMBAT.fracture_amp_max*(reflect.fracture_ref / this.fighters[origin].defense_max));
		}

		if (reflect.defense_break){reflect.health *= defense_break_amp * reflect.fracture_amp};

		for (var i = 0; i < stat_keys.length; ++i) {
			var p = stat_keys[i];

			var attack_value = Math.round(attack[p]);
			var reflect_value = Math.round(reflect[p]);

			current.damage.target[p] = attack_value;
			nu_stats[target][p] -= attack_value;

			current.damage.origin[p] = reflect_value;
			nu_stats[origin][p] -= reflect_value;
		};

		for (var i = 0; i < stat_leech.length; ++i) {
			var p = stat_leech[i];
			var base = p.split("_")[1]

			var value = Math.round(attack[p]);
			current.damage.origin[p] = value;

			if (nu_stats[origin][base] + value >= this.fighters[origin][base + "_max"]){nu_stats[origin][base] = this.fighters[origin][base + "_max"]} else {nu_stats[origin][base] += value};
		}

		if (nu_stats[origin].defense < 0){nu_stats[origin].defense = 0};
		nu_stats[origin].stamina -= this.fighters[origin].stamina_cost;

		for (var i = 0; i < nu_stats[origin].buffs.length; ++i) {
			var p = nu_stats[origin].buffs[i];
			if(p.type == "attack"){if (p.duration > 0) { nu_stats[origin].buffs[i].duration-- } else { nu_stats[origin].buffs.splice(i, 1); i-- }};
		}

		for (var i = 0; i < nu_stats[target].buffs.length; ++i) {
			var p = nu_stats[target].buffs[i];
			if(p.type == "defend"){if (p.duration > 0) { nu_stats[target].buffs[i].duration-- } else { nu_stats[target].buffs.splice(i, 1); i-- }};
		}

		if (bfx[origin]["simple.stun"] > 0){
			nu_stats[target].debuffs.push({
				alias: "stun",
				factor: 0,
				duration: bfx[origin]["simple.stun"]
			})
		};
	}

	this["__proto__"].actionCast = function(index){
		var current = this.turn.sequence[index];
		var next = this.turn.sequence[index + 1];
		var cu_stats = current.unit_stats;
		var nu_stats = next.unit_stats;

		var origin = current.origin;
		var target = current.target;
		
		nu_stats[origin].staminaregen.push(COMBAT.stamina_regen_duration)

		if (nu_stats[origin].block + 1 >= COMBAT.blocks_max) {
			nu_stats[origin].block = COMBAT.blocks_max;
		} else {
			nu_stats[origin].block++;
		}

		if (cu_stats[origin].locX > cu_stats[target].locX) { var flee_direction = -1 } else { var flee_direction = 1 };
		var total_flee = flee_direction * COMBAT.cast_repel_factor * (COMBAT.cast_time_duration + COMBAT.cast_channel_duration);

		if (nu_stats[target].locX + total_flee <= COMBAT.margin) {
			nu_stats[target].locX = COMBAT.margin
		} else if (nu_stats[target].locX + total_flee >= this.world.width - COMBAT.margin) {
			nu_stats[target].locX = this.world.width - COMBAT.margin
		} else {
			nu_stats[target].locX += total_flee;
		}
	}

	this["__proto__"].actionSkip = function(index){

	
		
	}
}})