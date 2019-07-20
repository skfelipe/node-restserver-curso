const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let rolesValidos ={
    values:['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};
let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre:{
        type: String,
        required: [true, 'El Nombre es Necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true,  'El Email es Necesario']
    },
    password: {
        type: String,
        required: [true,  'La contraseña es Obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        required: true,
        default: true
    },
    google: {
        type: Boolean,
        required: true,
        default: false
    },
});

//funcion para eliminar el regreso de la contraseña en el response del post
usuarioSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}
usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser ùnico'});

module.exports = mongoose.model('Usuario', usuarioSchema);