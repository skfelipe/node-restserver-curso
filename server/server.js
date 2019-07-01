require('./config/config');
const express = require("express");
const app = express();
const BodyParser = require("body-parser");


// parse application/x-www-form-urlencoded
app.use(BodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(BodyParser.json());




app.get('/usuario', (req, res)=>{
    res.json("Get Usuario");
});
app.post('/usuario', (req, res)=>{

    let body = req.body;
    if(body.nombre === undefined){
        res.status(400).json({
            ok: false,
            mensaje: 'El nombres es necesario'
        });
    }else{
        res.json({
            persona: body
        });
    }

    
});
app.put('/usuario/:id', (req, res)=>{
    let id = req.params.id;
    res.json({
        id
    });
});
app.delete('/usuario', (req, res)=>{
    res.json("Delete Usuario");
});
app.listen(process.env.PORT,()=>{
    console.log('Aplicacion ejecutandose en el puerto', process.env.PORT);
});