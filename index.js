// Empezar el server
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// Mostrar la ventana del chat
app.get('/', (req, res) => {
	res.sendFile(`${__dirname}/index.html`);
});


let clf;

// Definición del los eventos del socket
io.on('connection', (socket) => {
	socket.on('chatFromClient', (msg) =>{

		io.emit('chatFromServer', msg);
		io.emit('chatFromServer', "Respuesta del asistente");
	})
});

http.listen(3000, () => {
	console.log('listening on port:3000');
});
