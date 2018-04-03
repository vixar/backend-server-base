var express = require('express');


var app = express();

var mdAuth = require('../middlewares/auth');

var Localidad = require('../Models/localidad');
// var Equipo = require('../Models/equipo');
// var User = require('../Models/user');


//=========================================
// Obtener Hospitales
//=========================================


app.get('/', (req, res, next) => {

    Localidad.find({})
        // .populate('usuario', 'nombre email')
        .exec(
            (err, localidades) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando localidad',
                        errors: err
                    });

                }

                res.status(200).json({
                    ok: true,
                    localidades: localidades
                });


            })

});



//=========================================
// Crear un nuevo Hospital
//=========================================

app.post('/', mdAuth.verificaToken, (req, res) => {

    // recibir peticion mediante solicitud http, entonces usamos (leer el cuerpo)
    var body = req.body;

    /* para crear un usuario o crear un objeto del modelo que creamos, entonces usamos
     las propiedades del modelo */
    var localidad = new Localidad({
        nombre: body.nombre,
        direccion: body.direccion,
        contacto: body.contacto,
        telefono: body.telefono,
        telefonoContacto: body.telefono_contacto,
        usuario: req.user._id
    });

    /* para guardarlo en la base de datos*/

    localidad.save((err, localidadSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error creando localidad',
                errors: 'Pista: el nombre debe de ser único',
                err
            });

        }

        res.status(201).json({
            ok: true,
            localidad: localidadSaved,
            user: req.user.nombre
        });

    });






});


// //=========================================
// // Actualizar un Usuario
// //=========================================

app.put('/:id', mdAuth.verificaToken, (req, res) => {

    // Cómo obtener el id
    var id = req.params.id;
    var body = req.body;

    // verificar si un usuario tiene este id
    Localidad.findById(id, (err, localidad) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar localidad',
                errors: err
            });

        }

        if (!localidad) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La localidad con el id ' + id + 'no existe',
                errors: { message: 'No existe una localidad con ese ID' }
            });
        }

        localidad.nombre = body.nombre;
        localidad.direccion = body.direccion;
        localidad.contacto = body.contacto;
        localidad.telefono = body.telefono;
        localidad.telefonoContacto = body.telefono_contacto;
        localidad.usuario = req.user._id;


        localidad.save((err, localidadSaved) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar localidad',
                    errors: err
                });

            }

            res.status(200).json({
                ok: true,
                localidad: localidadSaved,
                user: req.user.nombre
            });


        });

    });

});

// //=========================================
// // Eliminar un Usuario: usando id   
// //=========================================

app.delete('/:id', mdAuth.verificaToken, (req, res) => {

    var id = req.params.id;
    var nombre = req.user.nombre;

    Localidad.findByIdAndRemove(id, (err, localidadBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar localidad con el id =>' + id,
                errors: err
            });

        }

        if (!localidadBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una localidad con ese id',
                errors: { message: 'No existe una localidad con ese id' }
            });

        }

        res.status(200).json({
            ok: true,
            localidad: localidadBorrado,
            message: 'Localidad: ' + id + ': ' + localidadBorrado.nombre + ' => ha sido eliminado de la base de datos',
            usuario: req.user.nombre
        });
    })

});






// exportaciones de rutas
module.exports = app;