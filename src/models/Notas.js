const mongoose = require('mongoose');
const {Schema} = mongoose;

const NotaSchema = new Schema({

    titulo:{type:String, required:true},
    descripcion: {type:String, required:true},
    date:{type:Date, default: Date.now},
    //el siguiente campo mostrara al usuario obtendra su ip
    user:{type:String}
});

module.exports = mongoose.model('Notas',NotaSchema);