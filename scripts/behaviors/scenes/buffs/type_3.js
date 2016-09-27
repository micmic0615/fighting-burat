BUFFS.heal = {
	effects:[{
		name: "health_heal_add",
		factor: 280,
	}],
	duration: 0,
	cost: 24,
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
		name: "health_heal_add",
		factor: 18,
	}],
	duration: 18,
	cost: 20,
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
		name: "lifesteal_add",
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
		name: "normal_dmg_multiply",
		factor: 0.35,
	},{
		name: "health_heal_add",
		factor: 25,
	},{
		name: "stamina_dmg_add",
		factor: 10,
	},{
		name: "reduce_dmg_divide",
		factor: 1.5,
	}],
	duration: 6,
	cost: 45,
	slot: 3,
	type: "defend",
	title: "PEACEMAKER",
	tooltip: "Give up a good chunk of your damage for greater regeneration daamage reductton and fear attacks",
	sfx: [{
		sprite: "stupid",
		frames: 2,
		trigger: "spell",
		unit: "origin",
		life: 15,
		motion: "none"
	}]
}