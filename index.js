// Empezar el server
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const natural = require('natural');

// Mostrar la ventana del chat
app.get('/', (req, res) => {
	res.sendFile(`${__dirname}/index.html`);
});
let clf;

// Definición del los eventos del socket


io.on('connection', (socket) => {
	socket.on('chatFromClient', (msg) =>{

		io.emit('chatFromServer', msg);
		let response;

		const target = clf.classify(msg);

		switch(target){
			case 'música':
				response = "Aquí está la canción del momento";
				break;
			case 'notificacion':
				response = "Notificación enviada";
				break;
			case 'entretenimiento':
				response = "Toq toq...";
				break;
		}

		io.emit('chatFromServer', response);
	})
});

function _trainClassifier(){
	console.log("Entrenando el clasificador");
	// Instancia de algoritmo
	const classifier = new natural.BayesClassifier(natural.PorterStemmerEs);

	// Entrenar algoritmo
	classifier.addDocument('Pón música', 'música');
	classifier.addDocument('Pón una canción', 'música');
	classifier.addDocument('Quiero bailar', 'música');

	classifier.addDocument('Envía un mensaje', 'notificacion');
	classifier.addDocument('Envía un correo', 'notificacion');
	classifier.addDocument('Avísale a fulanito', 'notificacion');

	classifier.addDocument('Cuentame un chiste', 'entretenimiento');
	classifier.addDocument('Dime algo divertivo', 'entretenimiento');
	classifier.addDocument('Entretenme', 'entretenimiento');

	classifier.train();

	classifier.save('classifier.json', function(err, classifier){
		clf = classifier;
	});
}

http.listen(3000, () => {
	console.log('listening on port:3000');

	// Lógica de entrenamiento
	natural.BayesClassifier.load('classifier.json', null, function(err, classifier){
		if (classifier) {
			console.log("Ya existe el clasificador");
			clf = classifier;
		} else {
			_trainClassifier();
		}
	});
});
