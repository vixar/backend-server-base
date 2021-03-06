var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var localidadSchema = new Schema({
    nombre: ({ type: String, unique: [true, 'El nombre no debe coincidir con otro ya creado'], required: [true, 'El nombre es necesario'] }),
    direccion: ({ type: String, required: [true, 'El La dirección es necesaria'] }),
    contacto: ({ type: String, required: [true, 'El nombre de un contacto es necesario'] }),
    telefono: ({ type: Number, required: [true, 'Al menos un número es necesario'] }),
    telefonoContacto: ({ type: Number, required: [true, 'Al menos un número de contacto necesario'] }),
    img: { type: String, required: false },

    equipo: [({ type: Schema.Types.ObjectId, ref: 'Equipo' })],
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }
}, { collection: 'localidades' });





// exportacion

module.exports = mongoose.model('Localidad', localidadSchema);