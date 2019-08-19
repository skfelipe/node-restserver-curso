const express = require("express"); // express npm install express --save
const bcrypt = require('bcrypt'); // encriptador npm install bcrypt --save
const jwt = require('jsonwebtoken'); //toket npm install jsonwebtoken --save
const Usuario = require('../models/usuario');
const app = express();




app.post('/login', (req, res) => {

    let body = req.body;

    //se verfica si el correo existe
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        //valida si el usuario existe
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario o Contraseña Incorrecto"
                }
            });
        }
        //valida si la contraseña es igual
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario o Contraseña Incorrecto"
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        //respuesta exitosa en caso de el usuario y contaseña sean correctos
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });






});















module.exports = app;