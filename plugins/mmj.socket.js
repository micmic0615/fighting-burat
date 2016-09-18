function socket_setup(hostname){
	var socket_setup = io(hostname, {reconnection: false, timeout:5000});

	socket_setup.on("connect",  function(data){});
	socket_setup.on('error', function(data){alert("Error Connecting to Server"); init_socket()});	
	socket_setup.on('connect_error', function(data){alert("Error Connecting to Server"); init_socket()});
	socket_setup.on('connect_timeout', function(data){alert("Server Timeout"); init_socket()});

	socket_setup.on('disconnect', function() {
		alert("you have been disconnected...")
	});

	console.log(socket_setup)

	

	return socket_setup
}