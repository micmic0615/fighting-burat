BUFFS.defense = {
	effects:[{
		name: "reduce_dmg_divide",
		factor: 2,
	},{
		name: "reduce_dmg_subtract",
		factor: 10,
	}],
	duration: 15,
	cost: 15,
	slot: 1,
	type: "spell",
	title: "DEFENSE UP",
	tooltip: "reduces damage taken",
	sfx: [{
		sprite: "stupid",
		frames: 2,
		trigger: "spell",
		unit: "origin",
		life: 15,
		motion: "none"
	}]
}

BUFFS.thorns = {
	effects:[{
		name: "health_dmg_reflect_add",
		factor: 50,
	}],
	duration: 2,
	cost: 20,
	slot: 1,
	type: "spell",
	title: "THORNS",
	tooltip: "being attacked causes enemy to lose health",
	sfx: [{
		sprite: "thorns",
		frames: 3,
		trigger: "defend",
		unit: "origin",
		life: 15,
		motion: "none"
	}]
}

BUFFS.deflect = {
	effects:[{
		name: "defense_dmg_reflect_add",
		factor: 80,
	}],
	duration: 10,
	cost: 12,
	slot: 1,
	type: "spell",
	title: "DEFLECT",
	tooltip: "being attacked causes enemy to lose armor",
	sfx: [{
		sprite: "deflect",
		frames: 3,
		trigger: "defend",
		unit: "origin",
		life: 15,
		motion: "none"
	}]
}

BUFFS.curse = {
	effects:[{
		name: "health_dmg_reflect_add",
		factor: 25,
	},{
		name: "reduce_dmg_divide",
		factor: 2.5,
	},{
		name: "reduce_dmg_subtract",
		factor: 10,
	},{
		name: "health_heal_add",
		factor: -20,
	},{
		name: "normal_dmg_multiply",
		factor: 0.65,
	}],
	duration: 6,
	cost: 25,
	slot: 1,
	type: "defend",
	title: "CURSE",
	tooltip: "reduce your attack and degenerate health for greatly increased defense and damage return",
	sfx: [{
		sprite: "curse",
		frames: 2,
		trigger: "spell",
		unit: "origin",
		life: 25,
		motion: "none"
	}]
}

BUFFS.vanguard = {
	effects:[{
		name: "blocks_add",
		factor: 5,
	}],
	duration: 1,
	cost: 8,
	slot: 1,
	type: "spell",
	title: "VANGUARD",
	tooltip: "instantly adds a lot of shields",
	sfx: [{
		sprite: "stupid",
		frames: 2,
		trigger: "spell",
		unit: "origin",
		life: 15,
		motion: "none"
	}]
}