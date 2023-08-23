let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("./server");
let should = chai.should();

chai.use(chaiHttp);
describe("Register", () => {
  describe("/register user", () => {
    it("it should register user", (done) => {
      chai
        .request(server)
        .post("/register")
        .send({
          name: "testingName",
          password: "testingPassword",
          email: "testemail@gmail.com",
          location: "testlocation",
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.to.be.json;
          done();
        });
    });
    it("it should throw error as user is already registered", (done) => {
      chai
        .request(server)
        .post("/register")
        .send({
          name: "testingName",
          password: "testingPassword",
          email: "testemail@gmail.com",
          location: "testlocation",
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.to.be.json;
          done();
        });
    });
  });
});
