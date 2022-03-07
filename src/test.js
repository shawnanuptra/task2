//DECLARATIONS
const app = require('./api.js')
const supertest = require('supertest');
const res = require('express/lib/response');
const request = supertest(app)

//TESTS

//1. testing GET /assets
describe('GET /assets', () => {
    it('respond with JSON of all assets in database', (done) => {
        request
            .get('/assets')
            .set('Accept', 'application/JSON')
            .expect('content-type', /json/)
            .expect(200, done)
    });
});

//2. testing GET /assets/:id
describe('GET /assets/2', () => {
    it('respond with JSON of asset with the specified :id of 2', (done) => {
        request
            .get('/assets/2')
            .set('Accept', 'application/json')
            .expect('content-type', /json/)
            .expect(200, { "id": 2, "type": "printer", "location": "St Peters" }, done)
    });
});

//3. testing GET /type/:type
describe('GET /type/:type', () => {
    it('respond with JSON of assets with specified type', (done) => {
        request
            .get('/type/printer')
            .set('Accept', 'application/JSON')
            .expect('content-type', /json/)
            .expect(200, done)
    });
});

//4. testing GET /location/:location
describe('GET /location/:location', () => {
    it('respond with JSON of assets with specified location', (done) => {
        request
            .get('/assets/location/CitySpace')
            .set('Accept', 'application/JSON')
            .expect('content-type', /json/)
            .expect(200, done)
    });
});

//5. testing POST /add
describe('POST /add', () => {
    it('sends a 200 success code', (done) => {
        request
            .post('/add')
            .field('type', 'phone')
            .field('location', 'Northallerton')
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                done();
            })
    });
});

//6. testing PUT /assets/:id
describe('PUT /assets/1', () => {
    it('sends a 200 success code', (done) => {
        request
            .put('/assets/1')
            .field('type', 'monitor')
            .field('location', 'CitySpace')
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                done();
            })
    })
});

//7. testing DELETE /assets/:id
describe('DELETE /assets/1', () => {
    it('sends a 200 success code', (done) => {
        request
            .delete('/assets/1')
            .end((err, res) => {
                if (err) return done(err);
                done();
            })
    })
});

//8. testing GET /search with 2 params
describe('GET /search?location__&type=__', () => {
    it('displays in JSON the results', (done) => {
        request
            .get('/search?location=city&type=printer')
            .set('Accept', 'application/JSON')
            .expect('content-type', /json/)
            .expect(200, done)
    });
});
//9. testing GET /search with 'type'
describe('GET /search?type=__', () => {
    it('displays in JSON the results', (done) => {
        request
            .get('/search?type=printer')
            .expect(302, done)
    });
});
//10. testing GET /search with 'location'
describe('GET /search?location__', () => {
    it('displays in JSON the results', (done) => {
        request
            .get('/search?location=city')
            .expect(302, done)
    });
});

//11. testing GET /search with no params
describe('GET /search', () => {
    it('displays in JSON the results', (done) => {
        request
            .get('/search')
            .expect(302, done)
    });
});