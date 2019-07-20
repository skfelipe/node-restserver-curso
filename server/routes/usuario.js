const express = require("express"); // express npm install express --save
const bcrypt = require('bcrypt'); // encriptador npm install bcrypt --save
const _ = require('underscore'); //filtra el ingreso de datos por json
const Usuario = require('../models/usuario');
const app = express();

app.get('/usuario', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    
    Usuario.find({estado: true},'nombre email role estado google img') // el string es el elemento para realizar filtros en la salida de datos
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }

            Usuario.countDocuments({estado: true}, (err, conteo)=>{
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });         
            
        })
});

app.post('/usuario', (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        estado: body.estado
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });


});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            usaurio: usuarioDB
        });

    });




});
app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;

    // Usuario.findByIdAndRemove(id, (err, usuarioEliminado)=>{
    //     if(err){
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     };

    //     if(!usuarioEliminado){
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrato.'
    //             }      
    //         });
    //     };

    //     res.json({
    //         ok: true,
    //         usuario: usuarioEliminado
    //     });
    // });

    //let body = _.pick(req.body, ['estado']);
    let cambiaEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true}, (err, usuarioupdate)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        res.json({
            ok: true,
            usaurio: usuarioupdate
        });
    });

});


module.exports = app;