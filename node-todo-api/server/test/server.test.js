const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
var connect = require('../../utils/dbConnection');

//Use describe to group a block of test cases
describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        //var text = 'Test todo text';

        //Make a request via Supertest
        request(app)
            .post('/todos')
            .send({ text })//The request was sent here
            //Start making assertions about the request
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);//We expect the value in the text tobe what was passed in text variable above
            })
            .end((error, res) => {
                if (error) {
                    return done(error);
                }

                connect.dbConn.then(function (conn) {
                    connection = conn;
                    return conn.query('SELECT * FROM todos');
                }).then(function (rows) {
                    console.log('Inside then function...');
                    expect(rows.length).toBe(9);//Make assertion
                    done();
                }).catch((error) => {
                    //res.status(400).send(error);
                    done(error);
                    console.log('An error occurred...' + error);
                });

            });
    });

    it('should not create todo with invalid object data', (done) => {
        //Make a request via Supertest
        request(app)
            .post('/todos')
            .send({})//The request was sent here
            //Start making assertions about the request
            //.expect(200)
            //.expect((res) => {
              //  expect(res.body.text).toBe(text);//We expect the value in the text tobe what was passed in text variable above
            //})
            .end((error, res) => {
                if (error) {
                    return done(error);
                }

                connect.dbConn.then(function (conn) {
                    connection = conn;
                    return conn.query('SELECT * FROM todos');
                }).then(function (rows) {
                    console.log('Inside then function...');
                    expect(rows.length).toBe(9);//Make assertion
                    done();
                }).catch((error) => {
                    //res.status(400).send(error);
                    done(error);
                    console.log('An error occurred...' + error);
                });

            });
    });
});