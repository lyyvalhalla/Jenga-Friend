var http = require('http');
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
httpServer.listen(8080);

function requestHandler(req, res) {
	//read index.html
	fs.readFile(__dirname + '/index.html', 
		// Callback function for reading
		function (err, data) {
			// if there is an error
			if (err) {
				res.writeHead(500);
				return res.end('Error loading index.html');
			}
			// Otherwise, send the data, the contents of the file
			res.writeHead(200);
			res.end(data);
  		}
  	);
}

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', 
	// We are given a websocket object in our function
	function (socket) {
		console.log("We have a new client: " + socket.id);

		// When this user "send" from clientside javascript, we get a "message"
		// client side: socket.send("the message");  or socket.emit('message', "the message");
		
		// socket.on('Accel', 
		// 	// Run this function when a message is sent
		// 	function (data) {
		// 		console.log("Received: 'Accel' " + data);	
		// 		// Call "broadcast" to send it to all clients (except sender), this is equal to
		// 		// socket.broadcast.emit('message', data);
		// 		// socket.broadcast.emit('Accel', data);	
		// 		socket.broadcast.send(data);			
		// 		// To all clients, on io.sockets instead
		// 		// io.sockets.emit('message', "this goes to everyone");
		// 	}
		// );

		socket.on('AccelX', function(data) {
			// console.log("Received: AccelX " + data);
			socket.broadcast.emit('AccelX', data);
		});
		socket.on('AccelY', function(data) {
			// console.log("Received: AccelY " + data);
			socket.broadcast.emit('AccelY', data);
		});
		socket.on('AccelZ', function(data) {
			console.log("Received: AccelZ " + data);
			socket.broadcast.emit('AccelZ', data);
		});


		socket.on('touchX', function (data) {
			console.log("Touched: x " + data);
			socket.broadcast.emit('touchX', data);
		});
		socket.on('touchY', function (data) {
			console.log("Touched: y " + data);
			socket.broadcast.emit('touchY', data);
		});

		socket.on('mouseX', function (data) {
			console.log("mouseX: " + data);
			socket.broadcast.emit('mouseX', data);
		});


		// socket.on('AccelGrav', function (data) {
		// 	console.log("AccelerationWithGravity: " + data);
		// 	socket.broadbast.emit('AccelGrav', data);
		// });

		// socket.on('Rotation', function (data) {
		// 	console.log("Rotation: " + data);
		// 	socket.broadcast.emit('Rotation', data);
		// });

		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
		});

		
	}
);