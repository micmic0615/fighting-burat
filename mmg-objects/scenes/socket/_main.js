define(function () {return function(SCENE){
	SCENE.newLayer({zIndex:0, alias:'background', bgColor:'#000'});
	var init_socket = function(){MMG.loadScene("menu")}

	SOCKET = io('http://192.168.1.2:9090/', {reconnection: false, timeout:5000});

	SOCKET.on("connect",  function(data){alert("Successfully Connected to Server"); init_socket()});
	SOCKET.on('connect_error', function(data){alert("Error Connecting to Server"); init_socket()});
	SOCKET.on('error', function(data){alert("Error Connecting to Server"); init_socket()});	
	SOCKET.on('connect_timeout', function(data){alert("Server Timeout"); init_socket()});

	SOCKET.on('disconnect', function() {
		console.log('disconnected');
	});

	SOCKET.on('user_connect', function (data) {
		SOCKET.emit('user_login', { message: 'a user has logged in' });
	});

	return SCENE;
}})