define(function () {return function(){
	this["__proto__"].action_attack = function(index, buff_effects){
		var current = this.turn.sequence[index];
		var next = this.turn.sequence[index + 1];

		var origin = current.origin;
		var target = current.target;

		var damage_total = (this.fighters[origin].damage + buff_effects[origin].normal_dmg_add + buff_effects[target].reduce_dmg_subtract ) * buff_effects[origin].normal_dmg_multiply * buff_effects[target].reduce_dmg_divide;

		if (current.unit_stats[target].block > 0) {
			var damage_health_factor = 0;
			var damage_defense_factor = 1;
			var push_resist = 2;
			var defense_spill_factor = 1
			next.unit_stats[target].block--;
		} else {
			var damage_health_factor = 0.5;
			var damage_defense_factor = 0.5;
			var push_resist = 1;
			var defense_spill_factor = 1.5
		}

		if (Math.round(damage_total * damage_defense_factor) >= current.unit_stats[target].defense) {
			current.damage.target.defense = current.unit_stats[target].defense;
			var damage_defense_spill = Math.round(damage_total * damage_defense_factor) - current.damage.target.defense;
		} else {
			current.damage.target.defense = Math.round(damage_total * damage_defense_factor);
			var damage_defense_spill = 0;
		}

		current.damage.target.defense += buff_effects[origin].defense_dmg_add;
		current.damage.target.defense *= buff_effects[origin].defense_dmg_multiply;
		if (Math.round(current.damage.target.defense) >= current.unit_stats[target].defense) { current.damage.target.defense = current.unit_stats[target].defense }

		current.damage.target.health = Math.round((damage_total * damage_health_factor) + damage_defense_spill);
		current.damage.target.health += buff_effects[origin].health_dmg_add;
		current.damage.target.health *= buff_effects[origin].health_dmg_multiply;

		if (current.unit_stats[target].stamina > 0) {
			current.damage.target.stamina = (current.unit_stats[target].stamina - (current.unit_stats[target].stamina / buff_effects[origin].stamina_dmg_multiply)) + buff_effects[origin].stamina_dmg_add;
		} else {
			current.damage.target.stamina = buff_effects[origin].stamina_dmg_add;
		}

		if (current.unit_stats[target].stamina - current.damage.target.stamina <= 0){current.damage.target.stamina *= 0.5};

		if (current.unit_stats[origin].locX > current.unit_stats[target].locX) { var push_direction = -1 } else { var push_direction = 1 };

		var total_push = (Math.round(((this.fighters[origin].force + buff_effects[origin].force_add) / this.fighters[target].poise) * COMBAT.flinch_push_duration) * push_direction * COMBAT.flinch_push_movement) + (push_direction * COMBAT.flinch_push_movement * COMBAT.flinch_push_base);
		total_push /= push_resist;

		if (next.unit_stats[target].locX + total_push <= COMBAT.margin) {
			var knockback_damage = COMBAT.margin - (next.unit_stats[target].locX + total_push);
			next.unit_stats[target].locX = COMBAT.margin;
		} else if (next.unit_stats[target].locX + total_push >= this.world.width - COMBAT.margin) {
			var knockback_damage = (next.unit_stats[target].locX + total_push) - (this.world.width - COMBAT.margin);
			next.unit_stats[target].locX = this.world.width - COMBAT.margin;
		} else {
			var knockback_damage = 0;
			next.unit_stats[target].locX += total_push;
		}

		current.damage.target.health += knockback_damage * COMBAT.knockback_damage_factor;

		if (damage_defense_spill > 0){current.damage.target.health *= defense_spill_factor};

		if (Math.abs(current.unit_stats[origin].locX - current.unit_stats[target].locX) > COMBAT.attack_distance) {
			current.unit_stats[origin].locX = current.unit_stats[target].locX + push_direction * -1 * COMBAT.attack_distance;
			next.unit_stats[origin].locX = current.unit_stats[origin].locX;
		}

		current.damage.target.health = Math.round(current.damage.target.health);
		current.damage.target.stamina = Math.round(current.damage.target.stamina);
		current.damage.target.defense = Math.round(current.damage.target.defense);

		next.unit_stats[target].health -= current.damage.target.health;
		next.unit_stats[target].stamina -= current.damage.target.stamina;
		next.unit_stats[target].defense -= current.damage.target.defense;

		current.damage.origin.health = Math.round(buff_effects[target].health_dmg_reflect_add);
		current.damage.origin.defense = Math.round(buff_effects[target].defense_dmg_reflect_add);		
		if (next.unit_stats[origin].defense - current.damage.origin.defense <= 0){current.damage.origin.defense = next.unit_stats[origin].defense};

		current.damage.origin.leech_health = Math.round(buff_effects[origin].lifesteal_add);

		if (next.unit_stats[origin].health + current.damage.origin.leech_health >= this.fighters[origin].health_max){
			next.unit_stats[origin].health = this.fighters[origin].health_max;
		} else {
			next.unit_stats[origin].health += current.damage.origin.leech_health;
		}

		next.unit_stats[origin].health -= current.damage.origin.health;
		next.unit_stats[origin].defense -= current.damage.origin.defense;
		next.unit_stats[origin].stamina -= this.fighters[origin].stamina_cost;

		for (var i = 0; i < next.unit_stats[origin].buffs.length; ++i) {
			var p = next.unit_stats[origin].buffs[i];
			if(p.type == "attack"){if (p.duration > 0) { next.unit_stats[origin].buffs[i].duration-- } else { next.unit_stats[origin].buffs.splice(i, 1); i-- }};
		}

		for (var i = 0; i < next.unit_stats[target].buffs.length; ++i) {
			var p = next.unit_stats[target].buffs[i];
			if(p.type == "defend"){if (p.duration > 0) { next.unit_stats[target].buffs[i].duration-- } else { next.unit_stats[target].buffs.splice(i, 1); i-- }};
		}

		if (buff_effects[origin].stun_add > 0){
			next.unit_stats[target].debuffs.push({
				alias: "stun",
				factor: 0,
				duration: buff_effects[origin].stun_add
			})
		};
	}

	this["__proto__"].action_cast = function(index){
		var current = this.turn.sequence[index];
		var next = this.turn.sequence[index + 1];

		var origin = current.origin;
		var target = current.target;
		
		next.unit_stats[origin].staminaregen.push(COMBAT.stamina_regen_duration)

		if (next.unit_stats[origin].block + 1 >= COMBAT.blocks_max) {
			next.unit_stats[origin].block = COMBAT.blocks_max;
		} else {
			next.unit_stats[origin].block++;
		}

		if (current.unit_stats[origin].locX > current.unit_stats[target].locX) { var flee_direction = -1 } else { var flee_direction = 1 };
		var total_flee = flee_direction * COMBAT.cast_repel_factor * (COMBAT.cast_time_duration + COMBAT.cast_channel_duration);

		if (next.unit_stats[target].locX + total_flee <= COMBAT.margin) {
			next.unit_stats[target].locX = COMBAT.margin
		} else if (next.unit_stats[target].locX + total_flee >= this.world.width - COMBAT.margin) {
			next.unit_stats[target].locX = this.world.width - COMBAT.margin
		} else {
			next.unit_stats[target].locX += total_flee;
		}
	}

	this["__proto__"].action_skip = function(index){

	
		
	}
}})