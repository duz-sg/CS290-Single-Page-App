var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars').create({
    defaultLayout: 'main'
});
var mysql = require('mysql');
var pool = mysql.createPool({
    dateStrings: true,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs290_duz',
    password: '2314814Db',
    database: 'cs290_duz'
});

var app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

app.post('/edit', function(req, res, next) {
    console.log(req.body);
    if (req.body.id) {
        pool.query('SELECT * FROM workouts WHERE id = ?', req.body.id, function(err2, rows, fields) {
            if (err2) {
                next(err2);
                return;
            } else {
                res.render('edit', rows[0]);
            }
        })
    }
})

app.post('/delete', function(req, res, next) {
    console.log(req.body);
    pool.query('DELETE FROM workouts WHERE id = ?', req.body.id, function(err2, res2) {
        if (err2) {
            next(err2);
            return;
        } else {
            console.log(res2);
            res.send({
                status: 'ok'
            });
        }
    })
})

app.post('/add', function(req, res, next) {
    console.log(req.body);
    var row = {
        name: req.body.name,
        reps: req.body.reps,
        weight: req.body.weight,
        date: req.body.date,
        lbs: req.body.lbs
    };
    pool.query('INSERT INTO workouts set ?', row, function(err2, res2) {
        if (err2) {
            next(err2);
            return;
        } else {
            console.log(res2.insertId);
            pool.query('SELECT * FROM workouts WHERE id = ?', res2.insertId, function(err3, rows, fields) {
                if (err3) {
                    next(err3);
                    return;
                } else {
                    res.send(rows[0]);
                }
            })
        }
    });

});

app.post('/workouts', function(req, res, next) {
    console.log(req.body);
    if (req.body.name) {
        pool.query('UPDATE workouts SET name = ?, reps = ?, weight = ?, date = ?, lbs = ?  WHERE id = ?',
            [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs, req.body.id],
            function(err3, res3) {
                if (err3) {
                    next(err3);
                    return;
                } else {
                    res.render('home');
                }
            })
    }

})

app.get('/workouts', function(req, res, next) {
    res.render('home');
});

app.get('/get-all', function(req, res, next) {
    pool.query('SELECT * FROM workouts', function(err2, rows, fields) {
        if (err2) {
            next(err2);
            return;
        } else {
            res.send(rows);
        }
    })
});

app.get('/reset-table', function(req, res, next) {
    var context = {};
    pool.query("DROP TABLE IF EXISTS workouts", function(err) { //replace your connection pool with the your variable containing the connection pool
        var createString = "CREATE TABLE workouts(" +
            "id INT PRIMARY KEY AUTO_INCREMENT," +
            "name VARCHAR(255) NOT NULL," +
            "reps INT," +
            "weight INT," +
            "date DATE," +
            "lbs BOOLEAN)";
        pool.query(createString, function(err) {
            context.results = "Table reset";
            res.render('home', context);
        })
    });
});

app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
