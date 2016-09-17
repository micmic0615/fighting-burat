define(function () {var THIS_UNIT = function(){
	this.prop("hidden", false);
	this.prop("alive", true);
	this.prop("flying", false);

	this.prop("primary.vig", 1);
	this.prop("primary.end", 1);
	this.prop("primary.str", 1);
	this.prop("primary.vit", 1);

	this.prop("derived.health", 1);
	this.prop("derived.stamina", 1);
	this.prop("derived.defense", 1);

	this.prop("derived.equip_max", 1);
	this.prop("derived.equip_load", 1);

	this.prop("derived.agility", 1)
	this.prop("derived.damage", 1);
	this.prop("derived.movespeed", 1);
	this.prop("derived.poise", 1);
	this.prop("derived.force", 1);

	this.prop("current.health", 1);
	this.prop("current.stamina", 1);
	this.prop("current.defense", 1);
	this.prop("current.block", 1);

	this.prop("buffs", []);
	this.prop("debuffs", []);
	this.prop("prebuffs", []);
	this.prop("staminaregen", []);
	this.prop("temp", {});

	this.prop("action", null);
	
	this.prop("gear.head", {name:"unarmored", def:0, poise:0, weight:0});
	this.prop("gear.torso", {name:"unarmored", def:0, poise:0, weight:0});
	this.prop("gear.arms", {name:"unarmored", def:0, poise:0, weight:0});
	this.prop("gear.legs", {name:"unarmored", def:0, poise:0, weight:0});
	this.prop("gear.weapon", {name:"unarmed", atk:0, bns:1, force:10, weight:0});

	var animation_frame = {file:['shitty_wizard.png', 'shitty_wizard.png'], width:80, height:120, colliderWidth:80, colliderHeight:120, frames:1, fps:1};
	var animation_list = ["attack","counter","flinch","cast","guard","resist","stand","walk"];
	for (var i = 0; i < animation_list.length; ++i) {this.prop("animation.list."+animation_list[i], animation_frame)};
}; 

THIS_UNIT.prototype.birth = function(){
	if (MMG.stage == undefined) return null;

	this.update_stats();

	this.prop("current.health", this.derived.health);
	this.prop("current.stamina", this.derived.stamina);
	this.prop("current.defense", this.derived.defense);
	this.prop("current.block", 0);

	if (!this.hidden){
		this.prop("bars.hp_max", MMG.stage.drawRect(this.locX, 175, 80, 5, 1, "#600", "", {}));
		this.prop("bars.hp_current", MMG.stage.drawRect(this.locX, 175, 80, 5, 1, "#f00", "", {}));
		
		this.prop("bars.def_max", MMG.stage.drawRect(this.locX, 182, 80, 3, 1, "#036", "", {}));
		this.prop("bars.def_current", MMG.stage.drawRect(this.locX, 182, 80, 3, 1, "#09f", "", {}));
	}

	// this.prop("bars.stm_max", MMG.stage.drawRect(this.locX, 189, 80, 3, 1, "#052", "", {}));
	// this.prop("bars.stm_current", MMG.stage.drawRect(this.locX, 189, 80, 3, 1, "#0d6", "", {}));
};

THIS_UNIT.prototype.update_stats = function(){
	if (MMG.stage == undefined) return null;

	this.prop("derived.health", (this.primary.vig * 50) + 500);
	this.prop("derived.stamina", (this.primary.end * 5) + 50 );
	this.prop("derived.defense", this.gear.head.def + this.gear.torso.def + this.gear.arms.def + this.gear.legs.def);

	this.prop("derived.equip_max", (this.primary.vit * 2.5) + 25 );
	this.prop("derived.equip_load", this.gear.head.weight + this.gear.torso.weight + this.gear.arms.weight + this.gear.legs.weight + this.gear.weapon.weight);

	var weightRatio = this.derived.equip_load / this.derived.equip_max;
	this.prop("derived.agility", 100 - Math.round(weightRatio * 100));
	this.prop("derived.movespeed", COMBAT.unit_movespeed);

	this.prop("derived.poise", this.gear.head.poise + this.gear.torso.poise + this.gear.arms.poise + this.gear.legs.poise);
	this.prop("derived.force", this.gear.weapon.force);
	this.prop("derived.cost", this.gear.weapon.cost);

	this.prop("derived.damage", this.gear.weapon.atk + (this.gear.weapon.bns * this.primary.str));
};

THIS_UNIT.prototype.set_stats = function(stats){
	if (MMG.stage == undefined) return null;

	this.current.health = stats.health;
	this.current.stamina = stats.stamina;
	this.current.defense = stats.defense;
	this.current.block = stats.block;
	this.buffs = stats.buffs;
	this.staminaregen = stats.staminaregen;
	this.locX = stats.locX;

	for (var i = 0; i < this.buffs.length; ++i) {
		var p = this.buffs[i];
		var randomizer = Math.random()*30;
		switch (p.effects){
			case "health_heal_add":
				if (p.factor + this.current.health >= this.derived.health){
					var total_heal = this.derived.health - this.current.health
				} else {
					var total_heal = p.factor
				}

				if (p.factor >= this.derived.health*0.1){
					randomizer = 15;
					var styler = "36px Arial"
				} else {
					var styler = "18px Arial"
				}

				this.current.health += total_heal

				MMG.stage.drawFlyingText("+"+ total_heal + "!", "#3f6", styler, 100, this.locX, this.locY - 10, 255 + randomizer);
				break;
			
			case "stamina_heal_add":
				if (p.factor + this.current.stamina >= this.derived.stamina){
					var total_heal = this.derived.stamina - this.current.stamina
				} else {
					var total_heal = p.factor
				}

				if (p.factor >= this.derived.health*0.15){
					randomizer = 15;
					var styler = "18px Arial"
					var texter = "+BRV!"
				} else {
					var styler = "10px Arial"
					var texter = "+brv!"
				}

				this.current.stamina += total_heal

				MMG.stage.drawFlyingText(texter, "#f60", styler, 100, this.locX, this.locY - 10,  255 + randomizer);
				break;

			case "transmute_add":
				if (p.factor + this.current.defense >= this.derived.defense){
					var total_heal = this.derived.defense - this.current.defense
				} else {
					var total_heal = p.factor
				}

				if (p.factor >= this.derived.defense*0.1){
					randomizer = 15;
					var styler = "36px Arial"
				} else {
					var styler = "18px Arial"
				}

				this.current.defense += total_heal

				MMG.stage.drawFlyingText("+"+ total_heal + "!", "#09f", styler, 100, this.locX, this.locY - 10, 255 + randomizer);
				break;
		}
	}


	for (var i = 0; i < this.staminaregen.length; ++i) {
		var p = this.staminaregen[i];

		var stamina_regen = COMBAT.stamina_regen_factor*this.derived.stamina

		if (stamina_regen + this.current.stamina >= this.derived.stamina){
			var total_heal = this.derived.stamina - this.current.stamina
		} else {
			var total_heal = stamina_regen
		}

		this.current.stamina += total_heal

		var styler = "6px Arial"
		var texter = "+brv!"

		var randomizer = Math.random()*90;
		MMG.stage.drawFlyingText(texter, "#f60", styler, 100, this.locX, this.locY - 10,  225 + randomizer);
	}
}

THIS_UNIT.prototype.take_damage = function(origin, damage_data){
	
	if (MMG.stage == undefined) return null;

	this.current.health -= damage_data.health;
	this.current.defense -= damage_data.defense;
	this.current.stamina -= damage_data.stamina;

	if (this.locX > origin.locX){ var push_direction = 1 } else { var push_direction = -1 };
	var randomizer = Math.random()*45*push_direction + 15*push_direction;

	if (damage_data.health >= damage_data.defense){
		if (damage_data.health > 0){MMG.stage.drawFlyingText(damage_data.health + "!", "#f00", "24px Arial", 100, this.locX, this.locY, 270 + randomizer)};	
	} else {
		if (damage_data.health > 0){MMG.stage.drawFlyingText(damage_data.health + "!", "#f00", "18px Arial", 100, this.locX, this.locY, 270 + randomizer )};
		randomizer+=  20*push_direction;

		if (damage_data.defense > 0){MMG.stage.drawFlyingText(damage_data.defense + "!", "#09f", "24px Arial", 100, this.locX, this.locY, 270 + randomizer)};	
		randomizer+=  20*push_direction;
	}

	if (damage_data.stamina > 0){MMG.stage.drawFlyingText("-brv!", "#27595c", "12px Arial", 100, this.locX, this.locY, 270 + randomizer)}
}


THIS_UNIT.prototype.face_location = function(location){
	if (MMG.stage == undefined) return null;

	if (location.locX > this.locX){this.scaleX = 1} else if (location.locX < this.locX){this.scaleX = -1}
}

THIS_UNIT.prototype.stop = function(){
	if (MMG.stage == undefined) return null;

	this.action = null;
	this.temp = {};
	this.setAnimation("stand");
}

THIS_UNIT.prototype.always = function(){
	if (!this.hidden){
		if (MMG.stage == undefined) return null;

		this.bars.hp_max.x = this.locX - 40;
		this.bars.def_max.x = this.locX - 40;

		this.bars.hp_current.x = this.locX - 40;
		this.bars.def_current.x = this.locX - 40;

		var this_health = Math.round(80 * (this.current.health / this.derived.health));
		var this_defense = Math.round(80 * (this.current.defense / this.derived.defense));
		var this_stamina = Math.round(80 * (this.current.stamina / this.derived.stamina));

		MMG.stage.update_bars(this.bars.hp_current, this_health, 1);
		MMG.stage.update_bars(this.bars.def_current, this_defense, 1);
	}
}

//ACTIONS


THIS_UNIT.prototype.attack = function(target, turn_data){
	if (MMG.stage == undefined) return null;

	var listener = {origin: false, target: false};
	if (this.action != "attack"){
		this.action = "attack";
		this.animation.loop = false;
		this.setAnimation("attack");
		this.temp.damage_dealt = false;
		this.current.stamina -= this.derived.cost;
	} else {
		if (this.animation.frameCurrent >= 2){ 		
			if (this.temp.damage_dealt == false){
				var dealt = {
					health: turn_data.damage.target.health,
					defense: turn_data.damage.target.defense,
					stamina: turn_data.damage.target.stamina,
				};	
				
				target.take_damage(this, dealt); 

				var returned = {
					health: turn_data.damage.origin.health,
					defense: turn_data.damage.origin.defense,
					stamina: turn_data.damage.origin.stamina,
				};

				this.take_damage(target, returned);
				this.temp.damage_dealt = true;

				if(turn_data.damage.origin.leech_health > 0){
					if (turn_data.damage.origin.leech_health + this.current.health >= this.derived.health){
						var total_heal = this.derived.health - this.current.health
					} else {
						var total_heal = turn_data.damage.origin.leech_health
					}

					var randomizer = 15;
					var styler = "18px Arial";	
					this.current.health += total_heal

					MMG.stage.drawFlyingText("+"+ total_heal + "!", "#3f6", styler, 100, this.locX, this.locY - 10, 255 + randomizer);
				}
			};
			listener.origin = true;
		}

		
		var target_done = target.flinch(this, turn_data);

		if (target_done){
			this.animation.loop = true;
			listener.target = true;
			this.stop();
			target.stop();
		}
	}

	return listener;
}

THIS_UNIT.prototype.skip = function(target, turn_data){
	if (MMG.stage == undefined) return null;

	var listener = {origin: false, target: false};
	if (this.action != "flinch"){
		this.action = "flinch";
		this.animation.loop = true;
		this.setAnimation("flinch");
		this.temp.skiptimer = 40;
		this.temp.standtimer = 20;
		this.current.stamina -= this.derived.cost;
	} else {
		if (this.temp.skiptimer > 0){ 		
			this.temp.skiptimer--
		} else {
			if (this.temp.standtimer > 0){
				this.setAnimation("walk");
				this.temp.standtimer--
			} else {
				this.animation.loop = true;
				this.stop();

				listener.origin = true;
				listener.target = true;
			}
		}
	}

	return listener;
}

THIS_UNIT.prototype.cast = function(target, turn_data){
	if (MMG.stage == undefined) return null;

	var listener = {origin: false, target: false};
	if (this.action != "cast"){
		this.action = "cast";
		this.temp.cast_time = COMBAT.cast_time_duration;
		this.temp.channel_time = COMBAT.cast_channel_duration;
		
		this.setAnimation("counter");
		
	} else {
		if (this.temp.channel_time > 0){
			target.walk_backwards(COMBAT.cast_repel_factor)
		} 

		if (this.temp.cast_time > 0){
			this.temp.cast_time--
		} else {
			this.setAnimation("cast");
			if (this.temp.channel_time > 0){
				this.temp.channel_time--
			} else {
				this.staminaregen.push(COMBAT.stamina_regen_duration);

				MMG.stage.drawFlyingText("+BRV!", "#f60", "18px Arial", 100, this.locX, this.locY - 10, 270);

				listener = {origin: true, target: true};

				this.stop();
				target.stop();
			}
		}
	}

	return listener;
}

THIS_UNIT.prototype.flinch = function(origin, turn_data){
	if (MMG.stage == undefined) return null;

	var listener = false;
	if (origin.locX > this.locX){ var direction = -1 } else { var direction = 1 };
	if (this.action != "flinch"){
		this.action = "flinch";
		this.temp.guard_hold = 15;
		
		this.temp.flinch_hold = Math.round(( turn_data.force / turn_data.poise ) * COMBAT.flinch_push_duration) + COMBAT.flinch_push_base;
		this.temp.flinch_movement = COMBAT.flinch_push_movement;

		if (this.temp.flinch_hold > COMBAT.flinch_push_max_duration){
			var push_move_multiplier =  this.temp.flinch_hold / COMBAT.flinch_push_max_duration;
			this.temp.flinch_movement *= push_move_multiplier;
			this.temp.flinch_hold = COMBAT.flinch_push_max_duration;
		}
	} else {
		if (this.current.block > 0){
			if (origin.temp.damage_dealt){
				if (this.temp.guard_hold > 0){
					this.temp.guard_hold--					
				} else {
					this.temp.guard_hold = 0
					this.setAnimation("resist");
				}
			} else {
				this.setAnimation("guard");
			}
		} else {
			if (origin.temp.damage_dealt){
				this.temp.guard_hold = 0
				this.setAnimation("flinch");
			}
		}

		if (this.temp.guard_hold == 0){
			if (this.temp.flinch_hold > 0){
				this.temp.flinch_hold--;

				var total_push = direction * this.temp.flinch_movement;

				if (this.current.block > 0){total_push /= 2}

				if (this.locX + total_push <= COMBAT.margin){
					this.locX = COMBAT.margin
				} else if (this.locX + total_push >= MMG.stage.world.width - COMBAT.margin){
					this.locX = MMG.stage.world.width - COMBAT.margin
				} else {
					this.locX += total_push;
				}
			} else {
				listener = true;
				this.stop();
			}
		} else {
			
		}
	}

	return listener
}

THIS_UNIT.prototype.walk_forward = function(fixed){
	if (MMG.stage == undefined) return null;

	if (this.action == null){
		var direction = this.scaleX / Math.abs(this.scaleX); 
		var speed = 0;
		
		if (fixed == undefined) { speed = this.derived.movespeed } else { speed = fixed };
		var movement = speed * direction

		if (this.locX + movement <= COMBAT.margin){
			this.moveTo(COMBAT.margin, this.locY);
		} else if (this.locX + movement >= MMG.stage.world.width - COMBAT.margin){
			this.moveTo(MMG.stage.world.width - COMBAT.margin, this.locY);
		} else {
			this.moveBy(movement, 0);
		}

		this.setAnimation("walk");
	}

	return {origin: true, target: true};
}

THIS_UNIT.prototype.walk_backwards = function(fixed){
	if (MMG.stage == undefined) return null;
	
	if (this.action == null){
		var direction = this.scaleX / Math.abs(this.scaleX) * -1; 
		var speed = 0;
		
		if (fixed == undefined) { speed = this.derived.movespeed } else { speed = fixed };
		var movement = speed * direction

		if (this.locX + movement <= COMBAT.margin){
			this.moveTo(COMBAT.margin, this.locY);
		} else if (this.locX + movement >= MMG.stage.world.width - COMBAT.margin){
			this.moveTo(MMG.stage.world.width - COMBAT.margin, this.locY);
		} else {
			this.moveBy(movement, 0);
		}

		this.setAnimation("walk");
	}

	return {origin: true, target: true};
}

return THIS_UNIT })