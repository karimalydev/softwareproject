const request = require('supertest');
const chai = require('chai');
const app = require('./http.js');  // adjust the path to point to your main server file

const { expect } = chai;

describe('N-Queens API', () => {
  describe('GET /', () => {
    it('should return a greeting message', (done) => {
      request(app)
        .get('/')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal({ message: "Hello Group 7!" });
          done();
        });
    });
  });

  describe('GET /solutions', () => {
    it('should return solutions for a given N', (done) => {
      const N = 4;
      request(app)
        .get(`/solutions?queens_number=${N}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
  });
});
