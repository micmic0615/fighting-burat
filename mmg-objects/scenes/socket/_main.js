define(function () {return function(SCENE){
	SCENE.newLayer({zIndex:0, alias:'background', bgColor:'#000'});
	var init_socket = function(){MMG.loadScene("menu")};

	SOCKET = io('http://192.168.1.2:9090/', {reconnection: false, timeout:5000});

	SOCKET.on("connect",  function(data){});
	SOCKET.on('error', function(data){alert("Error Connecting to Server"); init_socket()});	
	SOCKET.on('connect_error', function(data){alert("Error Connecting to Server"); init_socket()});
	SOCKET.on('connect_timeout', function(data){alert("Server Timeout"); init_socket()});


	SOCKET.on('disconnect', function() {
		alert("you have been disconnected...")
	});

	SOCKET.on('res.user_login', function (data) {
		USER = data;

		alert("Hello " + data.name + "!");
		localStorage.setItem("burat_user", JSON.stringify(data));
		init_socket();
	});

	function io_register(text){
		SOCKET.emit('req.user_login', { name: text});
	}

	function io_login(){
		USER = JSON.parse(localStorage.getItem("burat_user"))
		SOCKET.emit('req.user_login', USER);
	}

	if (localStorage.getItem("burat_user") != undefined){
		io_login()
	} else {
		try {
			var text = "";
			Cocoon.Dialog.showKeyboard({type: Cocoon.Dialog.keyboardType.TEXT}, {
				insertText: function(inserted) {
					text += inserted;
				},
				deleteBackward: function() {
					text = text.slice(0, text.length - 1);
				},
				done: function() {
					alert('wow');
					io_register(text)
				},
				cancel: function() {
					io_register("guest pc peasant " + new Date().getTime());
				}
			});
		} catch(err){
			io_register("guest pc peasant " + new Date().getTime());
		}
	}

	

	

	return SCENE;
}})