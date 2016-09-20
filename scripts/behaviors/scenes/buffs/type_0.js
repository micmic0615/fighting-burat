BUFFS.agility = {
	effects:[{
		name: "speed_up",
		factor: 2,
	}],
	duration: 15,
	cost: 25,
	slot: 0,
	type: "spell",
	title: "AGILITY",
	tooltip: "increases speed"
}

BUFFS.bleed = {
	effects:[{
		name: "health_dmg_add",
		factor: 100,
	},{
		name: "health_dmg_multiply",
		factor: 1.5,
	},{
		name: "lifesteal_add",
		factor: -100,
	}],
	duration: 0,
	cost: 25,
	slot: 0,
	type: "attack",
	title: "BLEED ATTACK",
	tooltip: "your next attack will deal a lot of damage to you and the enemy. stacks damage multiplicatively."
}

BUFFS.armorbreak = {
	effects:[{
		name: "defense_dmg_add",
		factor: 160,
	}],
	duration: 15,
	cost: 15,
	slot: 0,
	type: "spell",
	title: "ARMOR BREAK",
	tooltip: "attacks deal more damage to armor"
}

BUFFS.damage = {
	effects:[{
		name: "health_dmg_add",
		factor: 80,
	}],
	duration: 5,
	cost: 20,
	slot: 0,
	type: "spell",
	title: "ATTACK UP",
	tooltip: "increases damage"
}

BUFFS.acid = {
	effects:[{
		name: "armor_heal_add",
		factor: -15,
	},{
		name: "defense_dmg_add",
		factor: 180,
	},{
		name: "defense_dmg_reflect_add",
		factor: 120,
	}],
	duration: 6,
	cost: 25,
	slot: 0,
	type: "defend",
	title: "ACID",
	tooltip: "degenerate armor but increase armor damage and get armor damage return"
}