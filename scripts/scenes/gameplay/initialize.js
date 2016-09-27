define(function () {return function(){
	var turn = this.turn;
	var player = this.player;

	var icons = this.icons;
	var bars = this.bars;
	var texts = this.texts;
	
	this.newLayer({zIndex:0, alias:'background', bgColor:'#cff'});
	this.newLayer({zIndex:1, alias:'main'});
	this.newLayer({zIndex:2, alias:'ui'});


	var floor = this.newUnit("background", "floor", {
		alias:'myFloor',
		locX:this.getScreen().width/2,
		locY:this.getScreen().height - 100,
		scaleY: 2
	})



	this.newUnit("main", GLOBALS.match_players[0].stats._actortype, {
		alias:'hero',
		locX:(this.getScreen().width/4)*1,
		locY:245,
		zIndex: 100
	});
	
	this.newUnit("main", GLOBALS.match_players[1].stats._actortype, {
		alias:'enemy',
		locX:(this.getScreen().width/4)*3,
		locY:245,
		scaleX:-1,
		zIndex: 10
	});

	var sfx_dummy_count = 40;
	while(sfx_dummy_count > 0){
		sfx_dummy_count--;
		this.sfx_dummies.push(this.newUnit("main", "buff_sfx", {zIndex: 101}));
	}


	var my_fighter = this.getUnit(GLOBALS.my_fighter);

	generate_icons.bind(this)();
	
	while(player.buffs_current.length < COMBAT.buffs_max + COMBAT.buffs_foresight){
		this.buff_shuffle("init")
	}

	function click_icon(icon_name){
		this.buff_my_fighter(icons[icon_name].animation.sprite, icons[icon_name].alias)
	}

	function generate_icons(){
		for (var i = 0; i < COMBAT.buffs_max; ++i) {
			icons["buffs_" + i] = this.newUnit("ui", "buff_icons", {
				alias:"buffs_" + i, clickable: true, freeSize: true, anchored: true,
				locX: 10 + ( i * ( 95 ) ),
				locY: this.getScreen().height - 120,
				width:90,
				height:90,
				opacity:1,
			});

			icons["buffs_" + i].clicked = click_icon.bind(this, "buffs_" + i);

			texts["buffs_" + i] = this.drawObj("floatingText",{text:"", color: "#f0f", fontSize: 16, x: 15 + ( i * ( 95 ) ), y: this.getScreen().height - 105});
		}

		

		for (var i = 0; i < COMBAT.buffs_foresight; ++i) {
			icons["nextbuffs_" + i] = this.newUnit("ui", "buff_icons", {
				alias:"nextbuffs_" + i, clickable: false, freeSize: true, anchored: true,
				locX: (15 + ( COMBAT.buffs_max * ( 95 ) )) + i * 40,
				locY: this.getScreen().height - 70,
				width:40,
				height:40,
				opacity:0.25,
			});
		}

		// icons["shuffle"] = this.newUnit("ui", "btns_gameplay", {
		// 	alias:"shuffle", clickable: true, freeSize: true, anchored: true,
		// 	locX: this.getScreen().width - 100,
		// 	locY: this.getScreen().height - 120,
		// 	opacity:1,
		// 	width: 90,
		// 	height: 90,
		// });

		// icons["shuffle"].clicked = this.shuffle_buffs;
		// icons["shuffle"].setAnimation("shuffle");

		// texts["shuffle" ] = this.drawObj("floatingText",{text:"", color: "#f0f", fontSize: 16, x: this.getScreen().width - 90, y: this.getScreen().height - 100});

		for (var i = 0; i < COMBAT.buffs_use_max; ++i) {
			icons["usedbuffs_" + i] = this.newUnit("ui", "buff_icons", {
				alias:"usedbuffs_" + i, clickable: false, freeSize: true, anchored: true,
				locX: (this.getScreen().width - 85) - (i * 35),
				locY: 10,
				width:30,
				height:30,
				opacity:0.25,
			});
		}

		for (var i = 0; i < player.buffs_current.length; ++i) {
			var p = player.buffs_current[i];

			if (i >= 3){
				var opacity = 0.2;
				var scaleX = 0.7;
				var scaleY = 0.65;
				var clickable = false;
			} else {
				var opacity = 1;
				var scaleX = 0.9;
				var scaleY = 0.85;
				var clickable = true;
			}

			player.icons["mybuffs_" + i] = this.newUnit("ui", "buff_icons", {
				alias:'mybuffs_' + i,
				locX:((( this.getScreen().width - 180) / player.buffs_current.length ) * (i + 0.5) ) + 10,
				locY: this.getScreen().height - 80,
				scaleX: scaleX,
				scaleY: scaleY,
				opacity: opacity,
				clickable: clickable
			});
		}	

		var pBars_locX = 47; 
		bars.aggro = this.drawObj("rect", {x: 10, y: 10, width: pBars_locX - 5, height: pBars_locX - 5, backgroundColor: "f00"});

		this.drawObj("rect", {x: (pBars_locX + 10), y: 10, width: 300, height: 13, backgroundColor: "#600"});
		bars.current_health = this.drawObj("rect", {x: (pBars_locX + 10), y: 10, width: 300, height: 13, backgroundColor: "#f00", zIndex:2});

		this.drawObj("rect", {x: (pBars_locX + 10), y: 26, width: 300, height: 7, backgroundColor: "#036"});
		bars.current_defense = this.drawObj("rect", { x: (pBars_locX + 10), y: 26, width: 300, height: 7, backgroundColor: "#09f", zIndex:2});
		
		for (var i = 0; i < COMBAT.blocks_max; ++i) {
			bars["block_" + i] = this.drawObj("rect", { x: (pBars_locX + 10) + 20*i, y: 37, width: 15, height: 15, opacity: 0.25, backgroundColor: "#09f"});
		}

		this.drawObj("rect", {x: 10, y: (this.getScreen().height - 25), width: (this.getScreen().width - 20), height: 15, backgroundColor: "#606"});
		bars.current_mana = this.drawObj("rect", {x: 10, y: (this.getScreen().height - 25), width: 0, height: 15, backgroundColor: "#f0f", zIndex:3});
		texts["mana_value"] = this.drawObj("floatingText",{text:"000", color: "#fff", fontSize: 15, x: this.getScreen().width/2, y: this.getScreen().height - 12, zIndex:3});

		var my_fighter_buffs = {}

		for (var i = 0; i < 13; ++i) {
			var p = [i];
			my_fighter_buffs["num_" + i] = this.newUnit("ui", "buff_icons", {
				alias:'buff_stats_' + i,
				locX: 100 + (17*i),
				locY: 43,
				scaleX: 0.1,
				scaleY: 0.1,
				opacity: 0
			});
		}

		if (GLOBALS.match_players[0]._id == USER._id){
			var hero_color = "#000";
			var enemy_color = "#f00";
		} else {
			var hero_color = "#f00";
			var enemy_color = "#000";
		}

		texts["hero_name"] = this.drawObj("floatingText",{text: GLOBALS.match_players[0].name, color: hero_color, fontSize: 12, x: this.getUnit("hero").locX , y: this.getUnit("hero").locY - 75, textAlign: "center"});
		texts["enemy_name"] = this.drawObj("floatingText",{text: GLOBALS.match_players[1].name, color: enemy_color, fontSize: 12, x: this.getUnit("enemy").locX , y: this.getUnit("enemy").locY - 75, textAlign: "center"});
	}

	function update_always(){
		if (player.reload <= 10 && player.reload > 0) {
			player.reload--;
		} else if (player.reload == 0) {
			MMG.loadScene("menu")
		} 

		texts["hero_name"].x = this.getUnit("hero").locX ;
		texts["enemy_name"].x = this.getUnit("enemy").locX ;

		if (turn.phase <= 0 || turn.phase <= 2){
			for (var i = 0; i < COMBAT.buffs_max; ++i) {
				if (player.buffs_current.length > 0){var p = player.buffs_current[i]} else {var p = "_empty"};
				
				icons["buffs_" + i].setAnimation(p);

				if (p != "_empty"){
					var ref_buff = BUFFS[p]

					texts["buffs_" + i].text = ref_buff.cost

					if (ref_buff.cost > player.mana_current) {
						icons["buffs_" + i].opacity = 0.35;
						texts["buffs_" + i].opacity = 1;
						texts["buffs_" + i].color = "#60c";
					} else {
						icons["buffs_" + i].opacity = 1;
						texts["buffs_" + i].opacity = 1;
						texts["buffs_" + i].color = "#f0f";
					}
				} else {
					texts["buffs_" + i].text = "";
					icons["buffs_" + i].opacity = 1;
				}
			}

			for (var i = 0; i < COMBAT.buffs_foresight; ++i) {
				var p = player.buffs_current[i + COMBAT.buffs_max];
				icons["nextbuffs_" + i].setAnimation(p)
			}

			for (var i = 0; i < COMBAT.buffs_use_max ; ++i) {
				if (i < my_fighter.buffs.length){
					var p = my_fighter.buffs[i];
					
					var opacity = 0.25  + 0.75 * (p.duration / p.max_duration);
					icons["usedbuffs_" + i].setAnimation(p.alias);
					icons["usedbuffs_" + i].opacity = opacity;
				} else {
					icons["usedbuffs_" + i].opacity = 0;
				}
			}

			if (my_fighter.current.stamina > 90){
				bars.aggro.backgroundColor = "#f60";
			} else if (my_fighter.current.stamina > 80){
				bars.aggro.backgroundColor = "#d67517";
			} else if (my_fighter.current.stamina > 70){
				bars.aggro.backgroundColor = "#948c3b";
			} else if (my_fighter.current.stamina > 60){
				bars.aggro.backgroundColor = "#55a15c";
			} else if (my_fighter.current.stamina > 50){
				bars.aggro.backgroundColor = "#319e6d";
			} else if (my_fighter.current.stamina > 40){
				bars.aggro.backgroundColor = "#2e8766";
			} else if (my_fighter.current.stamina > 30){
				bars.aggro.backgroundColor = "#2b6e60";
			} else if (my_fighter.current.stamina > 20){
				bars.aggro.backgroundColor = "#27595c";
			} else if (my_fighter.current.stamina > 10) {
				bars.aggro.backgroundColor = "#244752";
			} else if (my_fighter.current.stamina > 0) {
				bars.aggro.backgroundColor = "#13262b";
			} else {
				bars.aggro.backgroundColor = "#020404";
			}
		}

		var bar_health = Math.round(300 * (my_fighter.current.health / my_fighter.derived.health));
		var bar_defense = Math.round(300 * (my_fighter.current.defense / my_fighter.derived.defense));
		var bar_mana = (Math.round((this.getScreen().width - 20)) * (player.mana_current / player.mana_max));

		this.update_bars(bars.current_health, bar_health, 2);
		this.update_bars(bars.current_defense, bar_defense, 1);
		this.update_bars(bars.current_mana, bar_mana, 6);

		texts["mana_value"].text = Math.floor(player.mana_current)

		for (var i = 0; i < COMBAT.blocks_max; ++i) {
			var p = bars["block_" + i];
			if (my_fighter.current.block > i){p.opacity = 1;} else {p.opacity = 0.35}
		}
	}

	var menu_btn = this.newUnit("ui", "btns_gameplay", {
		alias:"menu", clickable: true, freeSize: true, anchored: true,
		locX: this.getScreen().width - 45,
		locY: 5,
		opacity:1,
		width: 40,
		height: 40,
	});

	menu_btn.setAnimation("menu")
	menu_btn.clicked = function(){player.reload = 10};

	this.always(update_always.bind(this));
}})