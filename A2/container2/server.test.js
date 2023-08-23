let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("./server");
let should = chai.should();

chai.use(chaiHttp);
describe("Login", () => {
  describe("/login user", () => {
    it("it should login user", (done) => {
      chai
        .request(server)
        .post("/login")
        .send({
          password: "testingPassword",
          email: "testemail@gmail.com",
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.to.be.json;
          done();
        });
    });
    it("invalid credentials", (done) => {
      chai
        .request(server)
        .post("/login")
        .send({
          password: "invalidPassword",
          email: "invalid@gmail.com",
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.should.to.be.json;
          done();
        });
    });
  });
});
