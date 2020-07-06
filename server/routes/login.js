const express = require("express"); // express npm install express --save
const bcrypt = require('bcrypt'); // encriptador npm install bcrypt --save
const jwt = require('jsonwebtoken'); //toket npm install jsonwebtoken --save

const { OAuth2Client } = require('google-auth-library'); // npm install google-auth-library --save
const client = new OAuth2Client(process.env.CLIENT_ID);

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

// Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];

    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);

    return {
        nombre: payload.name,
        email: payload.email,
        img:  payload.picture,
        google: true
    }
}
//verify().catch(console.error);


app.post('/google', async (req, res) => {

    let body = req.body;

    let googleUser = await verify(body.idtoken)
        .catch(e =>{
            return res.status(403).json({
                ok: false,
                err: e
            });
        });
    
    Usuario.findOne({email: googleUser.email}, (err, usuarioDB)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if(usuarioDB){
            if(usuarioDB.google === false){
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticación normal'
                    }
                });
            }else{
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token, 
                });
            }
        }else{
            // si el usuario no existe en nuestra base deatos.
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)'; // pasa a hash de 10 vueltas y nunca hara mach para el ingreso!.

            usuario.save((err, usuarioDB) =>{
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err: err
                    });
                };

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token, 
                });
                

            });
        }
    });

    // res.json({
    //     //token: body.idtoken
    //     usuario: googleUser
    // });


});















module.exports = app;