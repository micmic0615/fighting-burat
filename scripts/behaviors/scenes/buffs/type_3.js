BUFFS.heal = {
	effects:[{
		name: "health_heal_add",
		factor: 300,
	}],
	duration: 0,
	cost: 24,
	slot: 3,
	type: "spell",
	title: "JESUS",
	tooltip: "Jesus Christ instantly mend lost health"
}

BUFFS.regen = {
	effects:[{
		name: "health_heal_add",
		factor: 12,
	}],
	duration: 25,
	cost: 20,
	slot: 3,
	type: "spell",
	title: "MARY",
	tooltip: "Mama Mary gradually mend lost health over time"
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
	tooltip: "Successful attacks mend lost health"
}

BUFFS.peacemaker = {
	effects:[{
		name: "health_dmg_multiply",
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
	tooltip: "Give up a good chunk of your damage for greater regeneration daamage reductton and fear attacks"
}