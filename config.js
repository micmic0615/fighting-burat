var MMG = {};
var UNV = {};
var CONF = {};
var BUFFS = {};

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
	first: "socket",
	used: [
		"gameplay",
		"loader",
		"menu",
		"socket"
	],

	behaviors: [
		"buffs/type_0",
		"buffs/type_1",
		"buffs/type_2",
		"buffs/type_3",
		"buffs/type_4",
	]
};

CONF.units = {
	behaviors: [

	],
	groups:[
		"actors",
		"tiles",
	],
	types:  [
		"actors.demon", 
		"actors.knight", 
		"tiles.floor", 
		"ui.turn_icons", 
		"ui.buff_icons", 
		"ui.btns_menu", 
		"ui.btns_gameplay", 
	],
};

var SOCKET = null;

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
	SCENE: "mmg-objects/scenes/",
	UNIT_GROUP: "mmg-objects/unit-groups/",
	UNIT_TYPE: "mmg-objects/unit-types/",	
	BEHAVIOR_SCENE: "mmg-objects/behaviors/scenes/",
	BEHAVIOR_UNIT: "mmg-objects/behaviors/units/",
};