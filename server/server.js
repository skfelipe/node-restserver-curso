require('./config/config');
const express = require("express");
const mongoose = require("mongoose"); // server base mongo npm install mongoose --save
const app = express();
const BodyParser = require("body-parser"); // paseador de body npm install body-parser


// parse application/x-www-form-urlencoded
app.use(BodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(BodyParser.json());

//CONFIGURACION GLOBAL DE RUTAS
app.use(require('./routes/index'));


mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log('Base de datos ONLINE');
    }
});

app.listen(process.env.PORT, () => {
    console.log('Aplicacion ejecutandose en el puerto', process.env.PORT);
});