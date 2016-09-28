define(function () {return function(SCENE){
	SCENE.newLayer({zIndex:0, alias:'main',  bgColor:'#000'});

	var prep_connect = 10;
	var reconnect_timer = 200;
	var reconnect_timeout = 200;
	var find_match_data = {};

	var ready_go = 0;

	SCENE.drawObj("floatingText", {
		text: "finding match", 
		color: "#0ff", 
		fontSize: 36,
		fontFamily: "Arial",
		x: SCENE.world.width/2, 
		y: SCENE.world.height/2,
		textAlign: "center"
	});
	
	SOCKET.on("res.find_match.finding", function(res){
		console.log("finding match...");
	})

	SOCKET.on("res.find_match.found", function(res){
		console.log("match found");
		GLOBALS.game_id = res.game._id;
		GLOBALS.turn_data = res.turn_data;
		GLOBALS.match_players = res.game.user_data;
		RAN.generate(res.random_seed);
		if (GLOBALS.match_players[0]._id == USER._id){GLOBALS.my_fighter = "hero"} else {GLOBALS.my_fighter = "enemy"};
		SOCKET.emit("req.find_match.ready", GLOBALS.game_id);
	});

	SOCKET.on("res.find_match.ready", function(res){
		ready_go++;
		if (ready_go == GLOBALS.match_players.length){console.log(res); MMG.loadScene("gameplay")};
	});

	SCENE.always(function () {
		if (prep_connect > 0) {prep_connect--}; 

		if (prep_connect == 2){
			SCENE.newUnit("main", GLOBALS.my_character, {
				alias: "me",
				hidden: true,
				locX: SCENE.getScreen().width*-1,
				locY: SCENE.getScreen().height*-1,
				zIndex: 100
			});
		}
		
		if (prep_connect == 1) {
			var my_unit = SCENE.getUnit("me");

			var my_derived_stats = {
				_actortype: GLOBALS.my_character,
				agility: my_unit.derived.agility,
				health_max: my_unit.derived.health,
				stamina_max: my_unit.derived.stamina,
				defense_max: my_unit.derived.defense,
				damage: my_unit.derived.damage,
				force: my_unit.derived.force,
				poise: my_unit.derived.poise,			
				stamina_cost: my_unit.derived.cost,
			};

			var my_current_stats = {
				health: my_unit.current.health,
				stamina: my_unit.current.stamina,
				defense: my_unit.current.defense,
				fracture:  my_unit.current.defense,
				block: my_unit.current.block,			
				buffs: my_unit.buffs,
				debuffs: my_unit.debuffs,
				staminaregen: my_unit.staminaregen,
			};

			find_match_data = {_id: USER._id, name: USER.name, stats: my_derived_stats, bases: my_current_stats, buffs: GLOBALS.my_buffs};
		};

		if (prep_connect == 0){
			if (reconnect_timer == reconnect_timeout){SOCKET.emit("req.find_match", find_match_data)};
			if (reconnect_timer > 0){reconnect_timer--} else {reconnect_timer = reconnect_timeout};
		};
	});

	return SCENE
}})