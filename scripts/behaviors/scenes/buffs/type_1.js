BUFFS.defense = {
	effects:[{
		name: "compound.guard_normal",
		factor: 2,
	},{
		name: "simple.guard_normal",
		factor: 10,
	}],
	duration: 12,
	cost: 20,
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
		name: "simple.return_health",
		factor: 120,
	}],
	duration: 6,
	cost: 22,
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
		name: "simple.attack_stamina",
		factor: -35,
	},{
		name: "simple.return_defense",
		factor: 180,
	},{
		name: "compound.speed",
		factor: 0.5,
	},{
		name: "simple.return_health",
		factor: 120,
	}],
	duration: 5,
	cost: 50,
	slot: 1,
	type: "attack",
	title: "DEFLECT",
	tooltip: "slow yourself and attacks will increase enemy bravey for good damage reflect.",
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
		name: "simple.return_health",
		factor: 40,
	},{
		name: "simple.return_defense",
		factor: 60,
	},{
		name: "simple.guard_normal",
		factor: 25,
	},{
		name: "simple.heal_health",
		factor: -30,
	},{
		name: "simple.attack_defense",
		factor: 120,
	},{
		name: "compound.attack_normal",
		factor: 0.25,
	},{
		name: "compound.guard_normal",
		factor: 2.5,
	}],
	duration: 6,
	cost: 50,
	slot: 1,
	type: "defend",
	title: "CURSE",
	tooltip: "reduce your attack and degenerate health for greatly increased defense and damage return and armorbreak",
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
		name: "simple.heal_block",
		factor: 5,
	}],
	duration: 0,
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