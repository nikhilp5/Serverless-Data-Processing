const express = require("express");
const cors = require("cors");
const app = express();
const route = require("./route");
app.use(cors());
app.use(express.json());
app.use("", route);

module.exports = app;
