define(function () {return function(SCENE){
	SCENE.newLayer({zIndex:0, alias:'background', bgColor:'#000'});
	SCENE.waiting = true;
	
	var init_socket = function(){MMG.loadScene("menu")};
	
	SOCKET = socket_setup();

	SOCKET.on('res.user_login', function (data) {
		USER = data;
		localStorage.setItem("burat_user", JSON.stringify(data));
		init_socket();
	});

	var prep = 10;
	var text_input = null;
	SCENE.always(function(){
		if (prep > 0){prep--};

		if (prep == 1){
			bg_clicker = SCENE.drawObj("rect", {
				x: 0,
				y: 0,
				width: MMG.stage.world.width,
				height: MMG.stage.world.height,
				backgroundColor: "#000",
				clickable: true,
			})

			text_input = SCENE.drawObj("rect", {
				x: SCENE.world.width/2 - 200,
				y: 80,
				fontSize: 18,
				fontFamily: 'Arial',
				backgroundColor: "#fff",
				color: "#bbb",
				width: 400,
				height: 40,
				text:'input your name then press [ENTER]',
				textAlign: "center",
				clickable: true,
				clicked: function(){keyboardInit(text_input)}
			});

			SCENE.drawObj("rect", {
				x: SCENE.world.width/2 - 200,
				y: 80,
				fontSize: 18,
				fontFamily: 'Arial',
				backgroundColor: "#fff",
				color: "#bbb",
				width: 400,
				height: 40,
				zIndex: -1,
				text:'input your name then press [ENTER]',
				textAlign: "center"
			});

			SCENE.login_btn = SCENE.drawObj("rect", {
				x: SCENE.world.width/2 - 200,
				y: 135,
				fontSize: 18,
				fontFamily: 'Arial',
				backgroundColor: "#f66",
				color: "#fff",
				width: 400,
				height: 55,
				zIndex: 1,
				text:'LOG-IN',
				textAlign: "center",
				clicked: goToMenu
			});

			if (localStorage.getItem("burat_user") != undefined){
				USER = JSON.parse(localStorage.getItem("burat_user"));
				KEYS.text = USER.name
			}

			if (KEYS.text ==  ""){
				text_input.text = "input your name then press [ENTER]";
				text_input.color = "#bbb";
			} else {
				text_input.text = KEYS.text;
				text_input.color = "#000";
			}

			KEYS.text = "";
		}
	})


	function goToMenu(){
		if (SCENE.waiting){
			SCENE.waiting = true;

			var random_shit = [
				"boring_user",
				"i_have_no_lyf",
				"weabo_man",
				"fucking_johnny",
				"loser_shit",
				"kathniel_4ever",
				"i_suck_dick"
			]

			var random_name = Math.floor(Math.random()*random_shit.length);
			if (random_name > random_shit.length - 1){random_name = random_shit.length - 1}

			if (KEYS.text == ""){KEYS.text = random_shit[random_name]};

			SCENE.login_btn.text = "logging in as " + KEYS.text;
			SCENE.login_btn.backgroundColor = "#66f";

			if (USER != null){
				USER.name = KEYS.text;
				SOCKET.emit('req.user_login', USER);
			} else {
				SOCKET.emit('req.user_login', { name: KEYS.text});
			}

			
		}
	}

	function keyboardInit(text_input){
		updateText();
		try {
			var text = "";
			Cocoon.Dialog.showKeyboard({type: Cocoon.Dialog.keyboardType.TEXT}, {
				insertText: function(inserted) {
					text += inserted;
					KEYS.text = text;
					updateText();
				},
				deleteBackward: function() {
					text = text.slice(0, text.length - 1);
					KEYS.text = text;
					updateText();
				},
				done: function() {},
				cancel: function() {}
			});
		} catch(err){
			KEYS.start(function(inserted){
				if (inserted == "ENTER"){goToMenu()} 
				else {updateText()};
			});
		};

		

		function updateText(){
			if (KEYS.text ==  ""){
				text_input.text = "input your name then press [ENTER]";
				text_input.color = "#bbb";
			} else {
				text_input.text = KEYS.text;
				text_input.color = "#000";
			}
		}
	};
	
	return SCENE;
}})