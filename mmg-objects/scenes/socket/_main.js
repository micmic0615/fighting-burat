define(function () {return function(SCENE){
	SCENE.newLayer({zIndex:0, alias:'background', bgColor:'#000'});
	var init_socket = function(){MMG.loadScene("menu")}

	var socket = io('http://192.168.1.2:9090/');

	socket.on("connect", init_socket);
	socket.on('error', function(data){alert(data); init_socket()});

	socket.on('user_connect', function (data) {
		alert(data.message);
		socket.emit('user_login', { message: 'a user has logged in' });
	});

	return SCENE;
}})