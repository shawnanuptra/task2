const express = require('express');
const app = express();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('assetsDB.db');

const multer = require('multer');
const upload = multer();


// GET /assets/ endpoint - shows all assets in json format
app.get('/assets', (req, res) => {
    db.all('select * from assets', (err, rows) => {
        res.jsonp(rows);
    })
})

// GET /assets/:id - show asset with specific id
app.get('/assets/:id', (req, res) => {
    const id = req.params.id
    db.get(`select * from assets where id = ${id}`, (err, rows) => {
        res.jsonp(rows);
    })
})

// GET /assets/:type - show asset with specific type
app.get('/assets/:type', (req, res) => {
    const type = req.params.type;
    db.all(`select * from assets where type = ${type}`, (err, rows) => {
        res.jsonp(rows)
    })
})

// GET /assets/:location - show asset with specific location
app.get('/assets/:location', (req, res) => {
    const location = req.params.location;
    db.all(`select * from assets where location = ${location}`, (err, rows) => {
        res.jsonp(rows)
    })
})

//TODO: maybe make parameter based queries? so there are more options for filtering
/**
// // GET /assets?type=__&?location=__ - show assets that passes the queries
// // Shows all assets if there are no parameters
// app.get('/assets', (req, res) => {

//     console.log('query = ', req.query)

//     //get the type and location params
//     const type = req.query.type || null;
//     const location = req.query.location || null;

//     console.log(type, location);


//     //logic based on type and location params
//     switch (true) {
//         //if type and location is not null
//         case (type && location):
//             db.all(`select * from assets where type = '${type}' and location = '${location}'`, (err, rows) => {
//                 res.jsonp(rows);
//             })
//             break;

//         //if type is not null, but location is
//         case (type && !location):
//             db.all(`select * from assets where type = '${type}'`, (err, rows) => {
//                 res.jsonp(rows);
//             })
//             break;

//         //if type is null, but location is not null
//         case (!type && location):
//             db.all(`select * from assets where location = '${location}'`, (err, rows) => {
//                 res.jsonp(rows);
//             })
//             break;

//         //if both queries are null
//         case (!type && !location):
//             db.all('select * from assets', (err, rows) => {
//                 res.jsonp(rows);
//             })
//             break;

//         default:
//             res.send('No results');
//             break;

//     }
// })
**/

// POST /add - add item to database through form fields
app.post('/add', upload.array(), (req, res) => {
    //get from POST form fields
    const type = req.body.type;
    const location = req.body.location;

    db.run('insert into assets (type, location) values (?, ?)',
        type, location, (error) => {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.status(201)
            }
            res.end();
        }
    )
})

// PUT /assets/:id - to edit an item with the selected id
app.put('/asssets/:id', upload.array(), (req, res) => {

    const id = req.params.id;
    //get from POST form fields
    const type = req.body.type;
    const location = req.body.location;

    db.run('update assets set type=?, location=? where id=?',
        type, location, id, (error) => {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.status(201)
            }
            res.end();
        }
    )
})

// DELETE /assets/:id - to delete an item with the selected id
app.delete('/asset/:id', function (req, res) {

    const id = req.params.id;

    db.run("DELETE from assets WHERE id=?",
        id, (error) => {
            if (error) {
                console.err(error);
                res.status(500); //error
            } else {
                res.status(201); //deleted 
            }
            res.end();
        });
});


//listening at port 3000: access through web browser
app.listen(3000); 