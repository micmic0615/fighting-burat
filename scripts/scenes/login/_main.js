define(function () {return function(SCENE){
	SCENE.newLayer({zIndex:0, alias:'background', bgColor:'#000'});
	
	
	var init_socket = function(){MMG.loadScene("menu")};
	
	SOCKET = socket_setup('http://ec2-52-221-248-87.ap-southeast-1.compute.amazonaws.com:9000');

	SOCKET.on('res.user_login', function (data) {
		USER = data;
		localStorage.setItem("burat_user", JSON.stringify(data));
		init_socket();
	});

	function io_register(text){
		if (USER != null){
			USER.name = text;
			SOCKET.emit('req.user_login', USER);
		} else {
			SOCKET.emit('req.user_login', { name: text});
		}
	}
	
	var prep = 10;
	SCENE.always(function(){
		if (prep > 0){prep--};

		if (prep == 1){
			var text_input = SCENE.drawObj("rect", {
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
			});

			if (localStorage.getItem("burat_user") != undefined){
				USER = JSON.parse(localStorage.getItem("burat_user"));
				KEYS.text = USER.name
			}

			keyboard_init(text_input);
		}
	})

	function keyboard_init(text_input){
		update_text();
		try {
			var text = "";
			Cocoon.Dialog.showKeyboard({type: Cocoon.Dialog.keyboardType.TEXT}, {
				insertText: function(inserted) {
					text += inserted;
					KEYS.text = text;
					update_text();
				},
				deleteBackward: function() {
					text = text.slice(0, text.length - 1);
					KEYS.text = text;
					update_text();
				},
				done: function() {go_to_menu()},
				cancel: function() {go_to_menu()}
			});
		} catch(err){
			KEYS.start(function(inserted){
				if (inserted == "ENTER"){go_to_menu()} 
				else {update_text()};
			});
		};

		function go_to_menu(){
			if (KEYS.text == ""){KEYS.text = "boring user no. " + new Date().getTime()};
			io_register(KEYS.text);
		}

		function update_text(){
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