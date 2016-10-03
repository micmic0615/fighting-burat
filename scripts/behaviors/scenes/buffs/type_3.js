BUFFS.heal = {
	effects:[{
		name: "simple.heal_health",
		factor: 400,
	}],
	duration: 0,
	cost: 30,
	slot: 3,
	type: "spell",
	title: "JESUS",
	tooltip: "Jesus Christ instantly mend lost health",
	sfx: [{
		sprite: "heal",
		frames: 2,
		trigger: "spell",
		unit: "origin",
		life: 70,
		motion: "none"
	}]
}

BUFFS.regen = {
	effects:[{
		name: "simple.heal_health",
		factor: 25,
	}],
	duration: 20,
	cost: 25,
	slot: 3,
	type: "spell",
	title: "MARY",
	tooltip: "Mama Mary gradually mend lost health over time",
	sfx: [{
		sprite: "regen",
		frames: 2,
		trigger: "spell",
		unit: "origin",
		life: 35,
		motion: "none"
	}]
}

BUFFS.lifesteal = {
	effects:[{
		name: "simple.leech_health",
		factor: 60,
	}],
	duration: 10,
	cost: 24,
	slot: 3,
	type: "spell",
	title: "LIFESTEAL",
	tooltip: "Successful attacks mend lost health",
	sfx: [{
		sprite: "lifesteal_target",
		frames: 1,
		trigger: "attack",
		unit: "target",
		life: 40,
		motion: "none"
	},
	{
		sprite: "lifesteal_origin",
		frames: 2,
		trigger: "attack",
		unit: "origin",
		life: 40,
		motion: "none"
	}]
}

BUFFS.peacemaker = {
	effects:[{
		name: "compound.attack_normal",
		factor: 0.35,
	},{
		name: "simple.heal_health",
		factor: 25,
	},{
		name: "simple.attack_stamina",
		factor: 10,
	},{
		name: "compound.guard_normal",
		factor: 1.5,
	}],
	duration: 3,
	cost: 35,
	slot: 3,
	type: "defend",
	title: "PEACEMAKER",
	tooltip: "Give up a good chunk of your damage for greater regeneration damage reduction and fear attacks",
	sfx: [{
		sprite: "stupid",
		frames: 2,
		trigger: "spell",
		unit: "origin",
		life: 15,
		motion: "none"
	}]
}