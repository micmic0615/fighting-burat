function socket_setup(){
	var hostname = 'http://ec2-52-221-248-87.ap-southeast-1.compute.amazonaws.com:9000';
	// var hostname = 'http://192.168.1.2:9000';
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