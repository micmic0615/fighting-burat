define(function () {return function(SCENE){

	// SOCKET.on("res.select_buff",  function (data) {
	// 	alert(data.user + " have selected " + data.buff)
	// })

	// SOCKET.emit("req.select_buff", {user:USER.name, buff:BUFFS[alias].title})

	SCENE.newLayer({zIndex:0, alias:'main',  bgColor:'#000'});

	var reload = 25;

	SCENE.always(
		function () {
			if (reload > 0) {
				reload--;
			} 

			if (reload == 2){
				SCENE.newUnit("main", GLOBALS.my_fighter, {
					alias: "me",
					hidden: true,
					locX: SCENE.getScreen().width*-1,
					locY: SCENE.getScreen().height*-1,
					zIndex: 100
				});
			}
			
			if (reload == 1) {
				var my_unit = SCENE.getUnit("me");
	
				var my_derived_stats = {
					agility: my_unit.derived.agility,
					health_max: my_unit.derived.health,
					stamina_max: my_unit.derived.stamina,
					defense_max: my_unit.derived.defense,
					damage: my_unit.derived.damage,
					force: my_unit.derived.force,
					poise: my_unit.derived.poise,			
					stamina_cost: my_unit.derived.cost,
				}

				var my_current_stats = {
					health: my_unit.current.health,
					stamina: my_unit.current.stamina,
					defense: my_unit.current.defense,
					block: my_unit.current.block,			
					buffs: my_unit.buffs,
					debuffs: my_unit.debuffs,
					staminaregen: my_unit.staminaregen,
				}

				var find_match_data = {_id: USER._id, stats: my_derived_stats, bases: my_current_stats, buffs: GLOBALS.my_buffs};

				console.log(find_match_data)

				SOCKET.emit("req.find_match", find_match_data)

				SOCKET.on("res.find_match.finding", function(res){
					console.log("finding match")
				})

				SOCKET.on("res.find_match.found", function(res){
					GLOBALS.game_id = res.game._id;
					GLOBALS.turn_data = res.turn_data;

					if (res.game.user_data[0]._id == USER._id){
						GLOBALS.my_fighter = "hero"
					} else {
						GLOBALS.my_fighter = "enemy"
					}
					
					MMG.loadScene("gameplay");
				});
			}
		}
	)

	

	return SCENE
}})