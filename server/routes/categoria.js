const express = require('express');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
let app = express();
let Categoria = require('../models/categoria.js');

// ============================= //
// Mostrar todas las categorias  //
// ============================= //
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion') // filtro por orden
        .populate('usuario','nombre email') //filtro de muestra de datos de esquema
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });

        })
});

// ============================= //
// Mostrar una categorias por id //
// ============================= //
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El id no es valido'
                }
            });
        }

        res.json({
            ok: true,
            Categoria: categoriaDB
        });

    });

});

// ============================= //
// Crear una categorias por id //
// ============================= //
app.post('/categoria', verificaToken, (req, res) => {
    // requesa la nueva categoria

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ============================= //
// actualizar  categorias por id //
// ============================= //
app.put('/categoria/:id', verificaToken, (req, res) => {
    // requesa la nueva categoria

    let id = req.params.id;
    let body = req.body;
    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });


});

// ============================= //
// delete  categorias por id //
// ============================= //
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // requesa la nueva categoria
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria Borrada'
        })

    })


});





module.exports = app;