define(function () {return function(SCENE){
	SCENE.newLayer({ zIndex: 0, alias: 'ui', bgColor:'#333'});

	SCENE.newUnit("ui", "knight", {
		alias:'knight',
		locX:(SCENE.getScreen().width/4)*1,
		locY: 140,
		zIndex: 100,
		hidden: true,
		clickable: true,
		clicked: function(){
			select_character('knight')
		}
	});

	SCENE.newUnit("ui", "berserker", {
		alias:'berserker',
		locX:(SCENE.getScreen().width/4)*2,
		locY: 140,
		zIndex: 100,
		hidden: true,
		clickable: true,
		clicked: function(){
			select_character('berserker')
		}
	});

	SCENE.newUnit("ui", "trickster", {
		alias:'trickster',
		locX:(SCENE.getScreen().width/4)*3,
		locY: 140,
		zIndex: 100,
		hidden: true,
		clickable: true,
		clicked: function(){
			select_character('trickster')
		}
	});

	var char_name = SCENE.drawObj("floatingText", {
		text: " ", 
		textAlign: "center",
		color: "#fff", 
		fontSize: 24,
		fontFamily: "Arial",
		x: (SCENE.getScreen().width/4)*2,
		y: 280,
	});

	var char_description = SCENE.drawObj("floatingText", {
		text: " ", 
		textAlign: "center",
		color: "#fff", 
		fontSize: 16,
		fontFamily: "Arial",
		x: (SCENE.getScreen().width/4)*2,
		y: 300,
	});

	SCENE.drawObj("rect", {
		x: SCENE.world.width - 210,
		y: SCENE.world.height - 50,
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

	var char_buffs = [];

	function select_character(alias){
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
					char_description.text = "Skills are defense and healing based. Relies on destroying enemy armor first.";
					char_buffs = [
						"defense",
						"thorns",
						"regen",
						"heal",
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
					char_description.text = "Skills are attack focused. Willing to use hp to deal more damage.";
					char_buffs = [
						"damage",
						"agility",
						"armorbreak",
						"thorns",
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
					char_description.text = "Balanced attack and defense. Skills are focused on debuffs.";
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

			var unit = SCENE.getUnit(alias);
			unit.animation.loop = looper;
			unit.scaleX = 1.5;
			unit.scaleY = 1.5;
			unit.zIndex = 2;
			unit.opacity = 1;
			unit.locX += x_offset;
			unit.setAnimation(play_anim);

			GLOBALS.my_buffs = char_buffs;	
			GLOBALS.my_character = alias;
		})
	}

	return SCENE
}})