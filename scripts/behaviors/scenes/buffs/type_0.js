BUFFS.agility = {
	effects:[{
		name: "compound.speed",
		factor: 2,
	}],
	duration: 10,
	cost: 25,
	slot: 0,
	type: "spell",
	title: "AGILITY",
	tooltip: "increases speed",
	sfx: [{
		sprite: "agility",
		frames: 2,
		trigger: "spell",
		unit: "origin",
		life: 15,
		motion: "none"
	}]
}

BUFFS.bleed = {
	effects:[{
		name: "simple.attack_health",
		factor: 100,
	},{
		name: "compound.attack_health",
		factor: 2,
	},{
		name: "simple.leech_health",
		factor: -150,
	}],
	duration: 0,
	cost: 50,
	slot: 0,
	type: "attack",
	title: "BLEED ATTACK",
	tooltip: "your next attack will deal a lot of damage to you and the enemy. stacks damage multiplicatively.",
	sfx: [{
		sprite: "blood_origin",
		frames: 1,
		trigger: "attack",		
		unit: "origin",
		life: 50,
		motion: "none"
	},
	{
		sprite: "blood_target",
		frames: 1,
		trigger: "attack",		
		unit: "target",
		life: 50,
		motion: "none"
	}]
}

BUFFS.armorbreak = {
	effects:[{
		name: "simple.attack_defense",
		factor: 180,
	}],
	duration: 12,
	cost: 20,
	slot: 0,
	type: "spell",
	title: "ARMOR BREAK",
	tooltip: "attacks deal more damage to armor",
	sfx: [{
		sprite: "armorbreak",
		frames: 2,
		trigger: "attack",
		unit: "target",
		life: 50,
		motion: "none"
	}]
}

BUFFS.damage = {
	effects:[{
		name: "simple.attack_normal",
		factor: 90,
	}],
	duration: 12,
	cost: 20,
	slot: 0,
	type: "spell",
	title: "ATTACK UP",
	tooltip: "increases damage",
	sfx: [{
		sprite: "damage",
		frames: 2,
		trigger: "attack",
		unit: "target",
		life: 50,
		motion: "none"
	}]
}

BUFFS.acid = {
	effects:[{
		name: "simple.heal_defense",
		factor: -60,
	},{
		name: "simple.attack_defense",
		factor: 90,
	},{
		name: "simple.return_defense",
		factor: 90,
	}],
	duration: 6,
	cost: 25,
	slot: 0,
	type: "defend",
	title: "ACID",
	tooltip: "degenerate armor but increase armor damage and get armor damage return",
	sfx: [{
		sprite: "acid_spell",
		frames: 2,
		trigger: "spell",
		unit: "origin",
		life: 20,
		motion: "none"
	},{
		sprite: "acid_attack",
		frames: 2,
		trigger: "attack",
		unit: "target",
		life: 60,
		motion: "none"
	},
	{
		sprite: "acid_attack",
		frames: 2,
		trigger: "defend",
		unit: "target",
		life: 60,
		motion: "none"
	}]
}