BUFFS.force = {
	effects:[{
		name: "force_add",
		factor: 240,
	},{
		name: "stamina_dmg_add",
		factor: 8,
	},{
		name: "stun_add",
		factor: 1,
	}],
	duration: 8,
	cost: 30,
	slot: 2,
	type: "spell",
	title: "FORCE PUSH",
	tooltip: "increases knockback and adds minor fear attack and minor bash",
	sfx: [{
		sprite: "stupid",
		frames: 2,
		trigger: "spell",
		unit: "origin",
		life: 15,
		motion: "none"
	}]
}

BUFFS.focusbreak = {
	effects:[{
		name: "stamina_heal_add",
		factor: 2,
	},{
		name: "stamina_dmg_add",
		factor: 20,
	}],
	duration: 8,
	cost: 20,
	slot: 2,
	type: "attack",
	title: "FEAR ATTACK",
	tooltip: "attacks reduces enemy bravery",
	sfx: [{
		sprite: "fear",
		frames: 1,
		trigger: "attack",
		unit: "target",
		life: 40,
		motion: "none"
	}]
}

BUFFS.bash = {
	effects:[{
		name: "health_dmg_add",
		factor: 120,
	},{
		name: "stun_add",
		factor: 8,
	},{
		name: "force_add",
		factor: 120,
	},{
		name: "stamina_dmg_add",
		factor: 10,
	}],
	duration: 0,
	cost: 40,
	slot: 2,
	type: "attack",
	title: "BASH",
	tooltip: "the next attack will stun the target",
	sfx: [{
		sprite: "bash",
		frames: 1,
		trigger: "attack",
		unit: "target",
		life: 100,
		motion: "none"
	}]
}

BUFFS.transmute = {
	effects:[{
		name: "health_heal_add",
		factor: -40,
	},{
		name: "defense_heal_add",
		factor: 80,
	}],
	duration: 10,
	cost: 22,
	slot: 1,
	type: "spell",
	title: "TRANSMUTE",
	tooltip: "slowly converts health to armor",
	sfx: [{
		sprite: "stupid",
		frames: 2,
		trigger: "spell",
		unit: "origin",
		life: 15,
		motion: "none"
	}]
}

BUFFS.poison = {
	effects:[{
		name: "health_heal_add",
		factor: -35,
	},{
		name: "normal_dmg_add",
		factor: 80,
	},{
		name: "stamina_dmg_add",
		factor: 8,
	},{
		name: "health_dmg_reflect_add",
		factor: 120,
	}],
	duration: 5,
	cost: 35,
	slot: 2,
	type: "attack",
	title: "POISON (YOURSELF, LEZ)",
	tooltip: "degenerate health but increase attacks and get damage return to armor",
	sfx: [{
		sprite: "stupid",
		frames: 2,
		trigger: "spell",
		unit: "origin",
		life: 15,
		motion: "none"
	}]
}

BUFFS.focus = {
	effects:[{
		name: "speed_up",
		factor: 1.5,
	},{
		name: "stamina_heal_add",
		factor: 8,
	},{
		name: "health_heal_add",
		factor: 25,
	}],
	duration: 5,
	cost: 25,
	slot: 2,
	type: "defend",
	title: "FERVOR",
	tooltip: "continuously increases bravery and regenerate HP as long as attacking",
	sfx: [{
		sprite: "stupid",
		frames: 2,
		trigger: "spell",
		unit: "origin",
		life: 15,
		motion: "none"
	}]
}