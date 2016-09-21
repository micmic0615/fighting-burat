BUFFS.force = {
	effects:[{
		name: "force_add",
		factor: 200,
	}, {
		name: "stamina_dmg_add",
		factor: 8,
	}],
	duration: 15,
	cost: 20,
	slot: 2,
	type: "spell",
	title: "FORCE PUSH",
	tooltip: "increases knockback and adds minor fear attack",
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
		name: "stamina_dmg_add",
		factor: 15,
	}],
	duration: 12,
	cost: 16,
	slot: 2,
	type: "spell",
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
		name: "stun_add",
		factor: 4,
	}],
	duration: 0,
	cost: 16,
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
		factor: -30,
	},{
		name: "defense_heal_add",
		factor: 60,
	}],
	duration: 10,
	cost: 18,
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
		factor: -15,
	},{
		name: "normal_dmg_add",
		factor: 60,
	},{
		name: "health_dmg_reflect_add",
		factor: 120,
	}],
	duration: 6,
	cost: 25,
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
		name: "stamina_heal_add",
		factor: 3,
	}],
	duration: 20,
	cost: 15,
	slot: 2,
	type: "spell",
	title: "BRAVERY UP",
	tooltip: "continuously increases bravery",
	sfx: [{
		sprite: "stupid",
		frames: 2,
		trigger: "spell",
		unit: "origin",
		life: 15,
		motion: "none"
	}]
}