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

	var hero = this.newUnit("main", "knight", {
		alias:'hero',
		locX:(this.getScreen().width/4)*1,
		locY:245,
		zIndex: 100
	});
	
	var enemy = this.newUnit("main", "knight", {
		alias:'enemy',
		locX:(this.getScreen().width/4)*3,
		locY:245,
		scaleX:-1,
		zIndex: 10
	});

	generate_icons.bind(this)();
	
	while(player.buffs_current.length < COMBAT.buffs_max + COMBAT.buffs_foresight){
		this.buff_shuffle("init")
	}

	function click_icon(icon_name){
		this.buff_hero(icons[icon_name].animation.sprite, icons[icon_name].alias)
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

			texts["buffs_" + i] = this.drawFloatingText("", "#f0f", "16px Arial", 1, 15 + ( i * ( 95 ) ), this.getScreen().height - 105, {});
		}

		texts["mana_value"] = this.drawFloatingText("000", "#fff", "15px Arial", 1, this.getScreen().width/2, this.getScreen().height - 12, {});

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

		icons["shuffle"] = this.newUnit("ui", "btns_gameplay", {
			alias:"shuffle", clickable: true, freeSize: true, anchored: true,
			locX: this.getScreen().width - 100,
			locY: this.getScreen().height - 120,
			opacity:1,
			width: 90,
			height: 90,
		});

		icons["shuffle"].clicked = this.shuffle_buffs;
		icons["shuffle"].setAnimation("shuffle");

		texts["shuffle" ] = this.drawFloatingText("", "#f0f", "16px Arial", 1, this.getScreen().width - 90, this.getScreen().height - 100, {});

		

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
		bars.aggro = this.drawRect(10, 10, pBars_locX - 5, pBars_locX - 5, 1, "f00", "", {});

		this.drawRect((pBars_locX + 10), 10, 300, 10, 1, "#600", "", {});
		bars.current_health = this.drawRect((pBars_locX + 10), 10, 300, 10, 1, "#f00", "", {});

		this.drawRect((pBars_locX + 10), 23, 300, 5, 1, "#036", "", {});
		bars.current_defense = this.drawRect((pBars_locX + 10), 23, 300, 5, 1, "#09f", "", {});

		var speed_meter = 0;

		for (var i = 0; i < turn.sequence_max - 1; ++i) {
			var p = turn.sequence[i];
			bars["speed_" + i] = this.drawRect((((300 + 2)/(turn.sequence_max - 1))*i + pBars_locX + 10), 31, ((300 - (turn.sequence_max - 1)*2) /(turn.sequence_max - 1)), 4, 1, "#3c6", "", {});		
		}

		for (var i = 0; i < COMBAT.blocks_max; ++i) {
			bars["block_" + i] = this.drawRect((pBars_locX + 10) + 17*i, 40, 12, 12, 0.25, "#09f", "", {});
		}

		this.drawRect(10, (this.getScreen().height - 25), (this.getScreen().width - 20), 15, 1, "#606", "", {});
		bars.current_mana = this.drawRect(10, (this.getScreen().height - 25), 0, 15, 1, "#f0f", "", {});

		var hero_buffs = {}

		for (var i = 0; i < 13; ++i) {
			var p = [i];
			hero_buffs["num_" + i] = this.newUnit("ui", "buff_icons", {
				alias:'buff_stats_' + i,
				locX: 100 + (17*i),
				locY: 43,
				scaleX: 0.1,
				scaleY: 0.1,
				opacity: 0
			});
		}
	}

	function update_always(){
		if (player.reload <= 10 && player.reload > 0) {
			player.reload--;
		} else if (player.reload == 0) {
			MMG.loadScene("menu")
		} 

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

			if (player.buffs_available.length > 0){
				var buffs_used = player.buffs_used
				var buffs_max = player.buffs_available.length
				var shuffle_cost = Math.floor(player.mana_current*(0.2 - ( 0.2 * buffs_used/buffs_max))) + 10;

				if (player.mana_current >= shuffle_cost){
					icons["shuffle"].opacity = 1
				} else {
					icons["shuffle"].opacity = 0.35
				}
			} else {
				var shuffle_cost = "-"
			}

			texts["shuffle" ].text = String(shuffle_cost)

			for (var i = 0; i < COMBAT.buffs_use_max ; ++i) {
				if (i < hero.buffs.length){
					var p = hero.buffs[i];
					
					var opacity = 0.25  + 0.75 * (p.duration / p.max_duration);
					icons["usedbuffs_" + i].setAnimation(p.alias);
					icons["usedbuffs_" + i].opacity = opacity;
				} else {
					icons["usedbuffs_" + i].opacity = 0;
				}
			}

			if (turn.sequence.length > 0){
				var speed_meter = 0;

				for (var i = turn.index; i < turn.sequence_max + turn.index; ++i) {
					var p = turn.sequence[i];
					if (bars["speed_" + (i - turn.index)]) {bars["speed_" + (i - turn.index)].opacity = 0.25}
					if (p.origin == "hero"){speed_meter++}
				}

				for (var i = 0; i < turn.sequence_max - 1; ++i) {
					var p = turn.sequence[i];
					if (i < speed_meter){
						bars["speed_" + i].opacity = 1
					}
				}
			}	

			if (hero.current.stamina > 90){
				bars.aggro.color = "#f60";
			} else if (hero.current.stamina > 80){
				bars.aggro.color = "#d67517";
			} else if (hero.current.stamina > 70){
				bars.aggro.color = "#948c3b";
			} else if (hero.current.stamina > 60){
				bars.aggro.color = "#55a15c";
			} else if (hero.current.stamina > 50){
				bars.aggro.color = "#319e6d";
			} else if (hero.current.stamina > 40){
				bars.aggro.color = "#2e8766";
			} else if (hero.current.stamina > 30){
				bars.aggro.color = "#2b6e60";
			} else if (hero.current.stamina > 20){
				bars.aggro.color = "#27595c";
			} else if (hero.current.stamina > 10) {
				bars.aggro.color = "#244752";
			} else if (hero.current.stamina > 0) {
				bars.aggro.color = "#13262b";
			} else {
				bars.aggro.color = "#020404";
			}
		}

		var bar_health = Math.round(300 * (hero.current.health / hero.derived.health));
		var bar_defense = Math.round(300 * (hero.current.defense / hero.derived.defense));
		var bar_mana = (Math.round((this.getScreen().width - 20)) * (player.mana_current / player.mana_max));

		this.update_bars(bars.current_health, bar_health, 2);
		this.update_bars(bars.current_defense, bar_defense, 1);
		this.update_bars(bars.current_mana, bar_mana, 6);

		texts["mana_value"].text = Math.floor(player.mana_current)

		for (var i = 0; i < COMBAT.blocks_max; ++i) {
			var p = bars["block_" + i];
			if (hero.current.block > i){p.opacity = 1;} else {p.opacity = 0.35}
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