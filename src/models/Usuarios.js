//aqui pedimis el modulo de base de datos
const mongoose = require('mongoose');

const {Schema} = mongoose;

//ahora para poder encryptar la contraseña debemos
//debemos llamar al modulo bcryp
const bcrypt = require('bcryptjs');



const UsuarioSchema = new Schema({
    nombre:{type:String, required:true},
    email: {type:String, required:true},
    contra: {type:String, required:true},
    date:{type:Date, default: Date.now}
})

///aqui encriptamos la contraseña en si en este siguiente metodo
UsuarioSchema.methods.encryptarContra = async (contra) =>{
 const salto  =   await bcrypt.genSalt(10); //aplicamos el hash 10 se va a generar
 //aqui encriptamos la contraseña con ash junto con los saltos
 const criptada = bcrypt.hash(contra,salto);
return criptada;
}

//y aqui evaluamos la contraseña y la tomamos de forma encriptada para compararlo
UsuarioSchema.methods.CompararContra = async function (contra){
    return await bcrypt.compare(contra,this.contra);
}

module.exports = mongoose.model('Usuarios',UsuarioSchema);