//DECLARATIONS
const app = require('./api.js')
const supertest = require('supertest')
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

//3. testing GET /assets/type/:type
describe('GET /assets/type/:type', () => {
    it('respond with JSON of assets with specified type', (done) => {
        request
            .get('/assets/type/printer')
            .set('Accept', 'application/JSON')
            .expect('content-type', /json/)
            .expect(200, done)
    });
});

//4. testing GET /assets/location/:location
describe('GET /assets/location/:location', () => {
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
describe('delete /assets/1', () => {
    it('sends a 200 success code', (done) => {
        request
            .delete('/assets/1')
            .end((err, res) => {
                if (err) return done(err);
                done();
            })
    })
});