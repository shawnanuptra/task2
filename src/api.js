const express = require('express');
const { redirect } = require('express/lib/response');
const app = express();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./assetsDB.db');

const multer = require('multer');
const upload = multer();

/**
 * @api {get} /assets Displays in JSON all available assets
 * @apiVersion 1.0.0
 * @apiName GetAllAssets
 * @apiGroup Inventory
 *
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    [{
 *      "id": 1,
 *      "type": "printer",
 *      "location": "St Peters"
 *    },
 *      {
 *      "id": 2,
 *      "type": "phone",
 *      "location": "CitySpace"
 *      }]
 * @apiErrorExample {json} List error
 *   HTTP/1.1 500 Internal Server Error
 */
app.get('/assets', (req, res) => {
    db.all('select * from assets', (err, rows) => {
        //prints error, if err is not null
        err && console.log(err.message);

        //show results, or message if there are none
        (rows) ? res.jsonp(rows) : res.send('No assets registered');
    })
})

/**
 * @api {get} /assets/:id Show asset with the specified id
 * @apiVersion 1.0.0
 * @apiName GetAssetFromID
 * @apiGroup Inventory
 *
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    [{
 *      "id": 1,
 *      "type": "printer",
 *      "location": "St Peters"
 *    }]
 * @apiErrorExample {json} List error
 *   HTTP/1.1 500 Internal Server Error
 */
app.get('/assets/:id', (req, res) => {
    const id = req.params.id
    db.get(`select * from assets where id = ${id}`, (err, rows) => {
        //prints error, if err is not null
        err && console.log(err.message);

        //show results, or message if there are none
        (rows) ? res.jsonp(rows) : res.send('No assets with specified id');
    })
})

/**
 * @api {get} /assets/:type Show asset with the specified type
 * @apiVersion 1.0.0
 * @apiName GetAssetsFromType
 * @apiGroup Inventory
 *
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    [{
 *      "id": 3,
 *      "type": "monitor",
 *      "location": "Northallerton"
 *    }]
 * @apiErrorExample {json} List error
 *   HTTP/1.1 500 Internal Server Error
 */
app.get('/assets/type/:type', (req, res) => {
    const type = req.params.type;
    db.all(`select * from assets where type like '${type}'`, (err, rows) => {
        //prints error, if err is not null
        err && console.log(err.message);

        //show results, or message if there are none
        (rows) ? res.jsonp(rows) : res.send('No assets with specified type');
    })
})

/**
 * @api {get} /assets/:location Show asset with the specified location
 * @apiVersion 1.0.0
 * @apiName GetAssetsFromLocation
 * @apiGroup Inventory
 *
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    [{
 *      "id": 2,
 *      "type": "monitor",
 *      "location": "CitySpace"
 *    }]
 * @apiErrorExample {json} List error
 *   HTTP/1.1 500 Internal Server Error
 */
app.get('/assets/location/:location', (req, res) => {
    const location = req.params.location;
    db.all(`select * from assets where upper(location) like upper('%${location}%')`, (err, rows) => {
        //prints error, if err is not null
        err && console.log(err.message);

        //show results, or message if there are none
        (rows) ? res.jsonp(rows) : res.send('No assets with specified location');
    })
})


/**
 * @api {post} /add Add new asset to database
 * @apiVersion 1.0.0
 * @apiName Addasset
 * @apiGroup Inventory
 * @apiParam {String} type The type of asset that is going to be added. e.g. monitor, phone, laptop, etc.
 * @apiParam {String} location The location of the asset. CitySpace, St Peters, or Northallerton
 *
 * @apiParamExample {json} Input
 *    {
 *      "type": "phone",
 *      "location": "CitySpace"
 *    }
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 * 
 * @apiErrorExample Error-response:
 *    HTTP/1.1 500 Server error
 */
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

/**
 * @api {put} /assets/:id Edit an asset with specified id
 * @apiVersion 1.0.0
 * @apiName EditAsset
 * @apiGroup Inventory
 * @apiParam {Number} id The id of the asset
 * @apiParam {String} type The type of asset that is going to be updated. e.g. monitor, phone, laptop, etc.
 * @apiParam {String} location The location of the asset. CitySpace, St Peters, or Northallerton
 *
 * @apiParamExample {json} Input
 *    {
 *      "id" : 3,
 *      "type": "phone",
 *      "location": "CitySpace"
 *    }
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 * 
 * @apiErrorExample Error-response:
 *    HTTP/1.1 500 Server error
 */
app.put('/assets/:id', upload.array(), (req, res) => {

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

/**
 * @api {delete} /assets/:id Delete the asset from the database with the specified id
 * @apiVersion 1.0.0
 * @apiName DeleteAsset
 * @apiGroup Inventory
 * @apiParam {id} id The id of the asset that is going to be deleted
 *
 * @apiParamExample {json} Input
 *    {"id" : 3}
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 * 
 * @apiErrorExample Error-response:
 *    HTTP/1.1 500 Server error
 */
app.delete('/assets/:id', function (req, res) {

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

// GET /assets/search?type=__&?location=__ - show assets that passes the queries
// Shows all assets if there are no parameters
app.get('/search', (req, res) => {

    //get the type and location params
    const type = req.query.type || null;
    const location = req.query.location || null;

    //logic based on type and location params
    switch (true) {

        //if type and location is not null
        case (type !== null && location !== null):
            db.all(`select * from assets where upper(type) like upper('%${type}%') AND upper(location) like upper('%${location}%')`, (err, rows) => {
                //show results, or message if there are none
                (rows) ? res.jsonp(rows) : res.send('No assets with specified queries');
            })
            break;

        //if type is not null, but location is
        case (type !== null && location === null):
            //redirect to /type/:type
            res.redirect(`../location/${type}`)

            break;

        //if type is null, but location is not null
        case (type === null && location !== null):
            //redirect to /location/:location
            res.redirect(`../location/${location}`)
            break;

        //if both queries are null
        case (type === null && location === null):
            //redirect to /assets
            res.redirect('../assets')
            break;

        default:
            res.send('No results');
            break;

    }
})



//export for start.js - allows testing and publishing
module.exports = app; 