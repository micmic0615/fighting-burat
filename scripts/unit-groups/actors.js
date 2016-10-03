define(function () {var THIS_UNIT = function(){
	
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
	this.prop("current.fracture", 1);
	this.prop("current.block", 1);

	this.prop("buffs", []);
	this.prop("debuffs", []);
	this.prop("queuebuffs", []);
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

	this.updateStats();

	this.prop("current.health", this.derived.health);
	this.prop("current.stamina", this.derived.stamina);
	this.prop("current.defense", this.derived.defense);
	this.prop("current.block", 0);
	
	this.prop("bars.hp_max", MMG.stage.drawObj( "rect", {x: this.locX, y: 175, width: 80, height: 5, backgroundColor: "#600", zIndex:0}));
	this.prop("bars.hp_current", MMG.stage.drawObj( "rect", {x: this.locX, y: 175, width: 80, height: 5, backgroundColor: "#f00", zIndex:2}));
	
	this.prop("bars.def_max", MMG.stage.drawObj( "rect", {x: this.locX, y: 182, width: 80, height: 3, backgroundColor: "#036", zIndex:0}));
	this.prop("bars.def_current", MMG.stage.drawObj( "rect", {x: this.locX, y: 182, width: 80, height: 3, backgroundColor: "#09f", zIndex:2}));

	this.prop("bars.fracture_current", MMG.stage.drawObj( "rect", {x: this.locX, y: 182, width: 0, height: 3, backgroundColor: "#f0c", zIndex:10}));
	
};

THIS_UNIT.prototype.updateStats = function(){
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

THIS_UNIT.prototype.setStats = function(stats){
	if (MMG.stage == undefined) return null;

	this.current.health = stats.health;
	this.current.stamina = stats.stamina;
	this.current.defense = stats.defense;
	this.current.fracture = stats.fracture;

	this.current.block = stats.block;
	this.buffs = stats.buffs;
	this.staminaregen = stats.staminaregen;
	this.locX = stats.locX;

	for (var i = 0; i < this.buffs.length; ++i) {
		var p = this.buffs[i];

		for (var i2 = 0; i2 < p.effects.length; ++i2) {
			var p2 = p.effects[i2];
			
			var randomizer = Math.random()*30;
			switch (p2.name){
				case "simple.heal_health":
					if (p2.factor + this.current.health >= this.derived.health){
						var total_heal = this.derived.health - this.current.health
					} else {
						var total_heal = p2.factor
					}

					if (Math.abs(p2.factor) >= this.derived.health*0.1){
						randomizer = 15;
						var fontSize = 36;
					} else {
						var fontSize = 18;
					}

					this.current.health += total_heal;

					if (total_heal > 0){
						MMG.stage.drawObj("flyingText", {text: "+"+ total_heal + "!", color: "#3f6", fontSize: fontSize, life: 100, x: this.locX, y: this.locY - 10, angle: 255 + randomizer});
					} else if (total_heal < 0){
						MMG.stage.drawObj("flyingText", {text: total_heal + "!", color: "#f00", fontSize: fontSize, life: 100, x: this.locX, y: this.locY - 10, angle: 255 + randomizer});
					}
					
					break;
				
				case "simple.heal_stamina":
					if (p2.factor + this.current.stamina >= this.derived.stamina){
						var total_heal = this.derived.stamina - this.current.stamina
					} else {
						var total_heal = p2.factor
					}

					if (p2.factor >= this.derived.health*0.15){
						randomizer = 15;
						var fontSize = 18
						var texter = "+BRV!"
					} else {
						var fontSize = 10
						var texter = "+brv!"
					}

					this.current.stamina += total_heal;
					MMG.stage.drawObj("flyingText", {text: texter, color: "#f60", fontSize: fontSize, life: 100, x: this.locX, y: this.locY - 10,  angle: 255 + randomizer});
					break;

				case "simple.heal_defense":
					if (p2.factor + this.current.defense >= this.derived.defense){
						var total_heal = this.derived.defense - this.current.defense
					} else {
						var total_heal = p2.factor
					}

					if (Math.abs(p2.factor) >= this.derived.defense*0.1){
						randomizer = 15;
						var fontSize = 36;
					} else {
						var fontSize = 18;
					}

					this.current.defense += total_heal
					if (total_heal > 0){
						MMG.stage.drawObj("flyingText", {text: "+"+ total_heal + "!", color: "#09f", fontSize: fontSize, life: 100, x: this.locX, y: this.locY - 10, angle: 255 + randomizer});
					} else if (total_heal < 0) {
						MMG.stage.drawObj("flyingText", {text: total_heal + "!", color: "#09f", fontSize: fontSize, life: 100, x: this.locX, y: this.locY - 10, angle: 255 + randomizer});
					}
					break;
			}
		}
		
	}


	for (var i = 0; i < this.staminaregen.length; ++i) {
		var p = this.staminaregen[i];

		var stamina_regen = COMBAT.stamina_regen_factor*this.derived.stamina

		if (stamina_regen + this.current.stamina >= this.derived.stamina){
			var total_heal = this.derived.stamina - this.current.stamina
		} else {
			var total_heal = stamina_regen;
		}

		this.current.stamina += total_heal;

		var randomizer = Math.random()*90;
		MMG.stage.drawObj("flyingText", {text: "+brv!", color: "#f60", fontSize: 6, life: 100, x: this.locX, y: this.locY - 10,  angle: 225 + randomizer});
	}
}

THIS_UNIT.prototype.takeDamage = function(origin, damage_data){
	if (MMG.stage == undefined) return null;

	this.current.health -= damage_data.health;	
	this.current.stamina -= damage_data.stamina;
	this.current.defense -= damage_data.defense;
	this.current.fracture -= damage_data.fracture;

	if (this.locX > origin.locX){ var push_direction = 1 } else { var push_direction = -1 };
	var randomizer = Math.random()*45*push_direction + 15*push_direction;

	if (damage_data.health >= damage_data.defense){
		var health_size = 24;
		var defense_size = 14;
	} else {
		var health_size = 24;
		var defense_size = 14;
	}

	var fracture_amp = Math.round((1 - (this.current.fracture/this.derived.defense))*100)

	if (damage_data.health > 0){MMG.stage.drawObj("flyingText", {text: damage_data.health + "!", color: "#f00", fontSize: health_size, life: 100, x: this.locX, y: this.locY, angle: 270 + randomizer})};
	randomizer+=  20*push_direction;

	if (damage_data.defense > 0){MMG.stage.drawObj("flyingText", {text: damage_data.defense + "!", color: "#09f", fontSize: defense_size, life: 100, x: this.locX, y: this.locY, angle: 270 + randomizer})};	
	randomizer+=  20*push_direction;

	if (damage_data.health > 0){
		if (fracture_amp > 0){MMG.stage.drawObj("flyingText", {text: "+" + fracture_amp + "%", color: "#f0c", fontSize: 10, life: 100, x: this.locX, y: this.locY, angle: 260 + randomizer}); 
		randomizer+=  20*push_direction};
	}

	if (damage_data.stamina > 0){MMG.stage.drawObj("flyingText", {text: "-brv!", color: "#27595c", fontSize: 12, life: 100, x: this.locX, y: this.locY, angle: 270 + randomizer})}
}


THIS_UNIT.prototype.faceLocation = function(location){
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
		this.bars.fracture_current.x = this.locX - 40;

		var this_health = Math.round(80 * (this.current.health / this.derived.health));
		var this_defense = Math.round(80 * (this.current.defense / this.derived.defense));
		var this_fracture = Math.round(80 - (80 * (this.current.fracture / this.derived.defense)));

		MMG.stage.updateBars(this.bars.hp_current, this_health, 1);
		MMG.stage.updateBars(this.bars.def_current, this_defense, 1);
		MMG.stage.updateBars(this.bars.fracture_current, this_fracture, 1);
	} else {
		if (this.bars != undefined){
			this.bars.hp_max.opacity = 0;
			this.bars.def_max.opacity = 0;
			this.bars.hp_current.opacity = 0;
			this.bars.def_current.opacity = 0;
			this.bars.fracture_current.opacity = 0;
		}
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
				var current = MMG.stage.turn.sequence[MMG.stage.turn.index];

				for (var i = 0; i < current.unit_stats[this.alias].buffs.length; ++i) {
					var p = current.unit_stats[this.alias].buffs[i];
					for (var i2 = 0; i2 < p.sfx.length; ++i2) {
						var p2 = p.sfx[i2];
						if (p2.trigger == "attack"){
							var sfx_dummy = MMG.stage.getDummySFX();

							if(this.alias == "hero"){sfx_dummy.scaleX == 1} else {sfx_dummy.scaleX == -1};
					
							if (p2.unit == "origin"){sfx_dummy.unit = this.alias} 
							else {
								if (this.alias == "hero"){sfx_dummy.unit = "enemy"} 
								else {sfx_dummy.unit = "hero"}
							}

							sfx_dummy.life = p2.life;
							sfx_dummy.setAnimation(p2.sprite);
						}
					}
				}

				for (var i = 0; i < current.unit_stats[target.alias].buffs.length; ++i) {
					var p = current.unit_stats[target.alias].buffs[i];
					for (var i2 = 0; i2 < p.sfx.length; ++i2) {
						var p2 = p.sfx[i2];
						if (p2.trigger == "defend"){
							var sfx_dummy = MMG.stage.getDummySFX();
							
							if(target.alias == "hero"){sfx_dummy.scaleX == 1} else {sfx_dummy.scaleX == -1};
					
							if (p2.unit == "origin"){sfx_dummy.unit = target.alias} 
							else {
								if (target.alias == "hero"){sfx_dummy.unit = "enemy"} 
								else {sfx_dummy.unit = "hero"}
							}

							sfx_dummy.life = p2.life;
							sfx_dummy.setAnimation(p2.sprite);
						}
					}
				}

				var dealt = {
					health: turn_data.damage.target.health,
					defense: turn_data.damage.target.defense,
					stamina: turn_data.damage.target.stamina,
					fracture: turn_data.damage.target.fracture,
				};	
				
				target.takeDamage(this, dealt); 

				var returned = {
					health: turn_data.damage.origin.health,
					defense: turn_data.damage.origin.defense,
					stamina: turn_data.damage.origin.stamina,
					fracture: turn_data.damage.origin.fracture,
				};

				this.takeDamage(target, returned);
				this.temp.damage_dealt = true;

				if(turn_data.damage.origin.leech_health > 0){
					if (turn_data.damage.origin.leech_health + this.current.health >= this.derived.health){
						var total_heal = this.derived.health - this.current.health
					} else {
						var total_heal = turn_data.damage.origin.leech_health
					}

					var randomizer = 15;	
					this.current.health += total_heal

					MMG.stage.drawObj("flyingText", {text: "+"+ total_heal + "!", color: "#3f6", fontSize: 18, life: 100, x: this.locX, y: this.locY - 10, angle: 255 + randomizer});
				} else if (turn_data.damage.origin.leech_health < 0) {
					var total_heal = turn_data.damage.origin.leech_health;
					var randomizer = 15;	
					this.current.health += total_heal;
					MMG.stage.drawObj("flyingText", {text: total_heal + "!", color: "#f00", fontSize: 18, life: 100, x: this.locX, y: this.locY - 10, angle: 255 + randomizer});
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
			target.walkBackward(COMBAT.cast_repel_factor)
		} 

		if (this.temp.cast_time > 0){
			this.temp.cast_time--
		} else {
			this.setAnimation("cast");
			if (this.temp.channel_time > 0){
				this.temp.channel_time--
			} else {
				this.staminaregen.push(COMBAT.stamina_regen_duration);

				MMG.stage.drawObj("flyingText", {text: "+BRV!", color: "#f60", fontSize: 18, life: 100, x: this.locX, y: this.locY - 10, angle: 270});

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

THIS_UNIT.prototype.walkForward = function(fixed){
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

THIS_UNIT.prototype.walkBackward = function(fixed){
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