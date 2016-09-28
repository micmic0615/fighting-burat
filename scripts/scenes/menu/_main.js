define(function () {return function(SCENE){
	SCENE.icons = {};

	SCENE.newLayer({ zIndex: 0, alias: 'ui', bgColor:'#333'});

	SCENE.newUnit("ui", "knight", {
		alias:'knight',
		locX:(SCENE.getScreen().width/4)*1,
		locY: 180,
		zIndex: 100,
		hidden: true,
		clickable: true,
		clicked: function(){
			selectCharacters('knight')
		}
	});

	SCENE.newUnit("ui", "berserker", {
		alias:'berserker',
		locX:(SCENE.getScreen().width/4)*2,
		locY: 180,
		zIndex: 100,
		hidden: true,
		clickable: true,
		clicked: function(){
			selectCharacters('berserker')
		}
	});

	SCENE.newUnit("ui", "trickster", {
		alias:'trickster',
		locX:(SCENE.getScreen().width/4)*3,
		locY: 180,
		zIndex: 100,
		hidden: true,
		clickable: true,
		clicked: function(){
			selectCharacters('trickster')
		}
	});

	var char_name = SCENE.drawObj("floatingText", {
		text: "Choose a Payter!", 
		textAlign: "center",
		color: "#999", 
		fontSize: 24,
		fontFamily: "Arial",
		x: (SCENE.getScreen().width/4)*2,
		y: 290,
	});

	var char_desc = SCENE.drawObj("floatingText", {
		text: "Payters have varying stats and skills", 
		textAlign: "center",
		color: "#999", 
		fontSize: 16,
		fontFamily: "Arial",
		x: (SCENE.getScreen().width/4)*2,
		y: 310,
	});

	var skill_name = SCENE.drawObj("floatingText", {
		text: " ", 
		textAlign: "left",
		color: "#fff", 
		fontSize: 16,
		fontFamily: "Arial",
		x: 90,
		y: 440,
	});

	var skill_desc = SCENE.drawObj("floatingText", {
		text: " ", 
		textAlign: "left",
		color: "#fff", 
		fontSize: 14,
		fontFamily: "Arial",
		x: 90,
		y: 458
	});

	

	SCENE.drawObj("rect", {
		x:10,
		y: 10,
		fontSize: 18,
		fontFamily: 'Arial',
		backgroundColor: "#f66",
		color: "#fff",
		width: 200,
		height: 40,
		zIndex: 1,
		text:'FIND MATCH',
		textAlign: "center",
		clicked: function(){
			if(char_buffs.length > 0){
				MMG.loadScene("findmatch")
			} else {
				alert("select a fighter!")
			}
			
		}
	});

	var icons_size = 80;
	var icons_margin = 5;
	var icons_count = 8;
	var icons_top = 340;
	var icons_left = SCENE.world.width/2 - (icons_size+icons_margin)*icons_count/2;

	var skill_highlighter = SCENE.drawObj("rect", {
		x: -200,
		y: -200,
		backgroundColor: "#ff6",
		opacity: 0.35,
		width: icons_size,
		height: icons_size,
		zIndex: 1,
	});


	var i = icons_count;
	while(i--){
		SCENE.icons["buffs_" + i] = SCENE.newUnit("ui", "buff_icons", {
			id_num: i,
			alias: "buffs_" + i, 
			clickable: true,
			freeSize: true,
			anchored: true,
			locX: icons_left + ((i * ((icons_size + icons_margin))) - (((icons_size + icons_margin) * icons_count) * Math.floor(i / icons_count))),
			locY: (icons_top - icons_margin) + (icons_size + icons_margin) * Math.floor(i / icons_count),
			width: icons_size,
			height: icons_size,
			opacity: 0.5,
			clicked: function(){
				if (this.animation.sprite != "_empty"){
					console.log(BUFFS[this.animation.sprite]);
					skill_name.text = BUFFS[this.animation.sprite].title + " [" + BUFFS[this.animation.sprite].cost +"]";
					skill_desc.text = BUFFS[this.animation.sprite].tooltip;
					skill_desc.color = "#fff"
					skill_highlighter.x = this.locX;
					skill_highlighter.y = this.locY;
				}
			}
		});
	}

	var char_buffs = [];

	function selectCharacters(alias){
		var characters = []
		characters.push(SCENE.getUnit("knight"));
		characters.push(SCENE.getUnit("berserker"));
		characters.push(SCENE.getUnit("trickster"));

		for (var i = 0; i < characters.length; ++i) {
			var p = characters[i];
			p.animation.loop = true;
			p.scaleX = 1;
			p.scaleY = 1;
			p.zIndex = 1;
			p.locX = (SCENE.getScreen().width/4)*(i+1);
			p.opacity = 0.35;
			p.setAnimation("stand");
		}

		requestAnimationFrame(function(){
			switch(alias){
				case "knight": 
					var play_anim = "guard"; 
					var looper = true; 
					var x_offset = 80; 
					char_name.text = "-Bato-"; 
					char_desc.text = "Skills are defense and healing based. Relies on destroying enemy armor first.";
					char_buffs = [
						"defense",
						"thorns",
						"armorbreak",
						"armorbreak",
						"armorbreak",
						"acid",
						"vanguard",
						"transmute"
					]
					break;
				case "berserker": 
					var play_anim = "attack"; 
					var looper = false; 
					var x_offset = -80; 
					char_name.text = "-Kidlat-"; 
					char_desc.text = "Skills are attack focused. Willing to use hp to deal more damage.";
					char_buffs = [
						"damage",
						"transmute",
						"transmute",
						"transmute",
						"lifesteal",
						"bleed",
						"focus",
						"regen"
					]
					break;
				case "trickster": 
					var play_anim = "counter"; 
					var looper = true; 
					var x_offset = -120; 
					char_name.text = "-Asero-"; 
					char_desc.text = "Balanced attack and defense. Skills are focused on debuffs.";
					char_buffs = [
						"damage",
						"defense",
						"bash",
						"focusbreak",
						"force",
						"regen",
						"poison",
						"peacemaker"
					]
					break;
			}
			
			for (var i = 0; i < char_buffs.length; ++i) {
				var p = char_buffs[i];
				SCENE.icons["buffs_" + i].setAnimation(p);
				SCENE.icons["buffs_" + i].opacity = 1;
			}

			var unit = SCENE.getUnit(alias);
			unit.animation.loop = looper;
			unit.scaleX = 1.5;
			unit.scaleY = 1.5;
			unit.zIndex = 2;
			unit.opacity = 1;
			unit.locX += x_offset;
			unit.setAnimation(play_anim);

			skill_highlighter.x = -200;
			skill_highlighter.y = -200;
			skill_name.text = " ";
			char_name.color = "#fff";
			char_desc.color = "#fff";
			skill_desc.color = "#999"
			skill_desc.text = "click a skill to view details";

			GLOBALS.my_buffs = char_buffs;	
			GLOBALS.my_character = alias;
		})
	}

	return SCENE
}})