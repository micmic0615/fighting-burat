var MMG = {};
var CONF = {};


MMG.cps = 50;
MMG.fps = 60;
MMG.tileSize = 80;
MMG.collisions = false;

MMG.validResolutions = [
	{width:853, height:480, scale:(1)},
	{width:1280, height:720, scale:1.5},
	{width:1920, height:1080, scale:2.25}
];

MMG.resolution = MMG.validResolutions[0];

CONF.scenes = {
	first: "login",
	used: [
		"gameplay",
		"loader",
		"menu",
		"login",
		"findmatch"
	],

	behaviors: [
		"buffs/type_0",
		"buffs/type_1",
		"buffs/type_2",
		"buffs/type_3"
	]
};

CONF.units = {
	behaviors: [

	],
	groups:[
		"actors",
		"tiles",
		"doodads"
	],
	types:  [
		"actors.berserker", 
		"actors.knight", 
		"actors.trickster", 
		"tiles.floor", 
		"doodads.buff_sfx",
		"ui.turn_icons", 
		"ui.buff_icons", 
		"ui.btns_menu", 
		"ui.btns_gameplay", 
	],
};

var COMBAT = {
	margin: 40,

	flinch_push_base: 15,
	flinch_push_duration: 15,
	flinch_push_movement: 2,
	flinch_push_max_duration: 30,

	attack_distance: 90,

	cast_time_duration: 10,
	cast_channel_duration: 30,
	cast_repel_factor: 2,

	knockback_damage_factor: 0.75,

	fracture_regain: 0.0625,
	fracture_amp_max: 1,

	unit_movespeed: 2.5,

	buffs_use_max: 10,

	buffs_max: 4,
	buffs_foresight:2,

	stamina_regen_factor: 0.04,
	stamina_regen_duration: 5,

	bonus_buff_chance: 25,

	blocks_max: 10,

	debuff_proc_factor: 5,
	debuff_proc_requirement: 20
};

var GEAR = {
	arms: [],
	head: [],
	torso: [],
	legs: [],
	weapons: [],
};

var DEBUG = {
	text: false,
	hitbox: false
};

var PATHS = {
	SCENE: "scripts/scenes/",
	UNIT_GROUP: "scripts/unit-groups/",
	UNIT_TYPE: "scripts/unit-types/",	
	BEHAVIOR_SCENE: "scripts/behaviors/scenes/",
	BEHAVIOR_UNIT: "scripts/behaviors/units/",
};