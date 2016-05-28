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
	// connect a client	
	var client = new pg.Client(connectionString);
	client.connect(function(err) {
		if(err) {
			console.log('[alex] error in connecting to database, trying to fetch:' + err);

			// Major bodge here.
			res.send([
				{
					place: 'Lo siento!',
					memory: 'Hemos encontrado un error :('
				}
			]);
		}
	});

	
	// array to hold results	
	var results = [];

	// connect to db and pull memories
	var query = client.query("SELECT * FROM memories ORDER BY id DESC LIMIT 20"); // dead simple, mate
	query.on('row', function(data) {
		results.push(data);	
	});

	query.on('end', function() {
		client.end();
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

	console.log('[alex] place and memory to be inserted: ' + place, memory);

	var client = new pg.Client(connectionString);
	client.connect(function(err) {			
		if(err) {
			console.log('[alex] error in connecting to database, trying to insert: ' + err);

			// In absence of better things, we're just going to ignore the fact that this didn't work
			client.end();
			res.redirect('error');
			res.end();
		}
	});

	var sql = "INSERT INTO memories(place, memory) values($1, $2)";
	var params = [place, memory];

	var query = client.query(sql, params, function(err, result) {
		if(err) {
			console.log('[alex] error querying to insert memory: ' + err);
			// we should probably return an error page or something
		}
	});

	query.on('end', function() {
		client.end();
		res.redirect('/');
		res.end();
	});
});


module.exports = router;
