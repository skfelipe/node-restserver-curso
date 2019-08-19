const express = require("express"); // express npm install express --save
const app = express();


app.use(require('./usuario'));
app.use(require('./login'));


module.exports = app;