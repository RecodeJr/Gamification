var request = require("request");
var expect = require("expect.js")
var base_url = "http://localhost:5000/"

describe("Gamification", function() {


  describe("GET /sexo", function() {
    it("returns status code 200", function(done) {
      request.get(base_url + "sexo", function(err, res, body) {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });
  });




});
