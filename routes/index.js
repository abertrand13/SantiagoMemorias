var express = require('express');
var router = express.Router();

var pg = require('pg'); // postgres

var connectionString = process.env.DATABASE_URL;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home');
});

// get test page
router.get('/test', function(req, res, next) {
	res.render('index', {title: 'HELLO WORLD!'});
});

router.get('/memories', function(req, res, next) {	
	console.log('[alex] database connection string:' + connectionString);	
	
	// connect a client	
	var client = new pg.Client(connectionString);
	client.connect(function(err) {
		// this callback gets called when there's an error
		console.log('[alex] error in connecting to database:' + err);

		// Major bodge here.
		res.send([
			{
				place: 'Lo siento!',
				memory: 'Hemos encontrado un error :('
			}
		]);
	});

	
	// array to hold results	
	var results = [];

	// connect to db and pull memories
	var query = client.query("SELECT * FROM memories"); // dead simple, mate
	query.on('row', function(data) {
		results.push(data);	
	});

	query.on('end', function() {
		client.end();
		console.log(results);
		return res.json(results);
	});
});

router.get('/baquedano', function(req, res, next) {
	res.render('submit');
});

router.post('/submit', function(req, res) {
	var place = req.body.lugar;
	var memory = req.body.memoria;

	// INSERT VALIDATION HERE

	console.log(place, memory);

	var client = new pg.Client(connectionString);
	client.connect();

	var sql = "INSERT INTO memories(place, memory) values($1, $2)";
	var params = [place, memory];

	var query = client.query(sql, params, function(err, result) {
		console.log(err);	
		console.log(result);
	});

	query.on('end', function() {
		client.end();
		res.render('home');
	});
});


module.exports = router;
