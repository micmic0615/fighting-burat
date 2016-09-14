define(function () {return function(SCENE){

	

	SOCKET.on("res.select_buff",  function (data) {
		alert(data.user + " have selected " + data.buff)
	})

	SCENE.icons = {};
	SCENE.bars = {};

	SCENE.newLayer({ zIndex: 0, alias: 'ui', bgColor:'#333'});
	var buff_keys = Object.keys(BUFFS);

	var icons_top = 10;
	var icons_size = 60;
	var icons_row_max = 5;

	
	var select_min = 3;



	var buffs_selected = {
		0:{items:[], max:4, color:"#f00"},
		1:{items:[], max:4, color:"#00f"},
		2:{items:[], max:4, color:"#ff0"},
		3:{items:[], max:3, color:"#0f0"},
		4:{items:[], max:1, color:"#000"}
	};
	
	var select_max = 0;
	for (var i = 0; i < 5; ++i) {var p = buffs_selected[i]; select_max += p.max};

	var selected_alias = "";
	var selected_index = "";


	var selector = SCENE.drawRect(0 - icons_size, 0 - icons_size, icons_size, icons_size, 0.5, "#ff0", "", {});

	for (var i = 0; i < buff_keys.length; ++i) {
		var p = buff_keys[i];
		
			SCENE.icons["buffs_" + p] = SCENE.newUnit("ui", "buff_icons", {
				id_num: i,
				alias: "buffs_" + p, clickable: true, freeSize: true, anchored: true,
				locX: 5 + ((i * ((icons_size + 5))) - (((icons_size + 5) * icons_row_max) * Math.floor(i / icons_row_max))),
				locY: (icons_top - 5) + (icons_size + 5) * Math.floor(i / icons_row_max),
				width: icons_size,
				height: icons_size,
			});

			SCENE.bars["buffs" + p] = SCENE.drawRect(
				icons_size - 13 + ((i * ((icons_size + 5))) - (((icons_size + 5) * icons_row_max) * Math.floor(i / icons_row_max))),
				(icons_top - 2) + (icons_size + 5) * Math.floor(i / icons_row_max),
				icons_size*0.2, 
				icons_size*0.2, 
				0.75, 
				buffs_selected[BUFFS[p].slot].color,
				"",
				{}
			);

			SCENE.icons["buffs_" + p].clicked = select_buff;

			SCENE.icons["buffs_" + p].setAnimation(p);
			
	};

	for (var u = 0; u < 5; ++u) {
		var b = buffs_selected[u];
		for (var i = 0; i < b.max; ++i) {		
			SCENE.bars["buff_slot_" + u + "_" + i] = SCENE.drawRect(SCENE.world.width - (icons_size + 5) - (i * ((icons_size + 5))), 5 + (icons_size + 5) * u, icons_size, icons_size, 0.5, b.color, "", {});
		};

		for (var i = 0; i < b.max; ++i) {
			SCENE.icons["buff_slot_" + u + "_" + i] =  SCENE.newUnit("ui", "buff_icons", {
				id_num: i,
				alias: "buff_slot_" + u + "_" + i, clickable: true, freeSize: true, anchored: true,
				locX: SCENE.world.width - (icons_size + 5) - (i * ((icons_size + 5))),
				locY: 5 + (icons_size + 5) * u,
				width: icons_size,
				height: icons_size,
				opacity:0
			});

			SCENE.icons["buff_slot_" + u + "_" + i].clicked = remove_buff;
		};
	};

	
	var buff_title = SCENE.drawFloatingText("", "#fff", "18px Arial", 1, 10, SCENE.world.height - 100, {});
	var buff_tooltip = SCENE.drawFloatingText("", "#fff", "14px Arial", 1, 10, SCENE.world.height - 80, {});

	

	// var BTN_DETAILS = SCENE.newUnit("ui", "menu", {
	// 	alias: "BTN_DETAILS", clickable: true, freeSize: true, anchored: true,
	// 	locX: SCENE.world.width - 500,
	// 	locY: SCENE.world.height - 50,
	// }); BTN_DETAILS.setAnimation("view_details");

	// var BTN_ADD = SCENE.newUnit("ui", "menu", {
	// 	alias: "BTN_ADD", clickable: true, freeSize: true, anchored: true,
	// 	locX: SCENE.world.width - 335,
	// 	locY: SCENE.world.height - 50,
	// }); BTN_ADD.setAnimation("add_selected"); BTN_ADD.clicked = add_buff;

	var BTN_START = SCENE.newUnit("ui", "btns_menu", {
		alias: "BTN_START", clickable: true, freeSize: true, anchored: true,
		locX: SCENE.world.width - 170,
		locY: SCENE.world.height - 50,
	}); BTN_START.setAnimation("start_game"); BTN_START.clicked = go_play

	function remove_buff(){
		var slot = parseInt(this.alias.split("_")[2]);

		var index = parseInt(this.alias.split("_")[3]);
		buffs_selected[slot].items.splice(index, 1);

		
		for (var u = 0; u < 5; ++u) {
			var b = buffs_selected[u];
			for (var i = 0; i < b.max; ++i) {
				if (i < b.items.length){
					SCENE.icons["buff_slot_" + u + "_" + i].setAnimation(b.items[i]);
					SCENE.icons["buff_slot_" + u + "_" + i].opacity = 1;
					SCENE.bars["buff_slot_" + u + "_" + i].opacity = 0;
				} else {
					SCENE.icons["buff_slot_" + u + "_" + i].opacity = 0;
					SCENE.bars["buff_slot_" + u + "_" + i].opacity = 0.5;
				};
			};
		};
	}

	function select_buff(){
		var alias = this.alias.split("buffs_").join("");
		SOCKET.emit("req.select_buff", {user:USER.name, buff:BUFFS[alias].title})
		
		
		buff_title.text = BUFFS[alias].title + " [" + BUFFS[alias].cost + "]"
		buff_tooltip.text = BUFFS[alias].tooltip
		if (alias != selected_alias){
			selector.x = this.locX;
			selector.y = this.locY;

			selected_alias = alias;
			selected_index = this.id_num;
		} else {
			add_buff();
		}
	}
	
	function add_buff(){
		if (selected_alias != ""){	
			
			if (BUFFS[selected_alias].slot != 4){
				var slot = BUFFS[selected_alias].slot

				if (buffs_selected[slot].items.length < buffs_selected[slot].max){
					var buff_index = buffs_selected[slot].items.length;
					SCENE.bars["buff_slot_" + slot + "_" + buff_index].opacity = 0;
					SCENE.icons["buff_slot_" + slot + "_" + buff_index].opacity = 1;
					SCENE.icons["buff_slot_" + slot + "_" + buff_index].setAnimation(selected_alias);

					buffs_selected[slot].items.push(selected_alias);
				} else {
					alert("cannot add more buffs from this category")
				}	
			} else {
				alert("special abilities are not yet implemented")
			}					
		} else {
			alert("select a buff to add")
		}
	}

	var reload = 99;
	function go_play(){
		reload = 10;

		var buffs_to_export = [];

		for (var u = 0; u < 5; ++u) {
			var b = buffs_selected[u];
			for (var i = 0; i < b.items.length; ++i) {
				var p = b.items[i];
				buffs_to_export.push(p)
			}
		}


		UNV.buffs_available = buffs_to_export;		
	}

	SCENE.always(
		function () {
			if (reload <= 10 && reload > 0) {
				reload--;
			} else if (reload == 0) {
				MMG.loadScene("loader")
			}
		}
	) 

	return SCENE
}})