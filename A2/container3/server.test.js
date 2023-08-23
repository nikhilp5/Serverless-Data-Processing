let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("./server");
let should = chai.should();

chai.use(chaiHttp);
describe("Details and logout", () => {
  describe("/details ", () => {
    it("brings details of user", (done) => {
      chai
        .request(server)
        .post("/details")
        .send({
          id: "zXwSuVmVAwV0OPVT8vJ2",
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.to.be.json;
          done();
        });
    });
    it("logsout user", (done) => {
      chai
        .request(server)
        .post("/logout")
        .send({
          id: "zXwSuVmVAwV0OPVT8vJ2",
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.to.be.json;
          done();
        });
    });
  });
});
