var express = require('express');


var app = express();

var mdAuth = require('../middlewares/auth');

var Localidad = require('../Models/localidad');
var Equipo = require('../Models/equipo');
// var User = require('../Models/user');


//=========================================
// Obtener Hospitales
//=========================================


app.get('/', (req, res, next) => {

    Equipo.find({})
        .populate('localidad', 'nombre')
        .exec(
            (err, equipos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando equipos',
                        errors: err
                    });

                }

                res.status(200).json({
                    ok: true,
                    equipos: equipos
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
    var equipo = new Equipo({
        marca: body.marca,
        modelo: body.modelo,
        // categoria: body.categoria,
        // descripcion: body.descripcion,
        // refUbicacion: body.ubicacion,
        localidad: body.localidad,
        usuario: req.user._id
    });

    /* para guardarlo en la base de datos*/

    equipo.save((err, equipoSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error creando equipo',
                errors: err
            });

        }

        res.status(201).json({
            ok: true,
            equipo: equipoSaved,
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
    Equipo.findById(id, (err, equipo) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar equipo',
                errors: err
            });

        }

        if (!equipo) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El equipo con el id ' + id + 'no existe',
                errors: { message: 'No existe un equipo con ese ID' }
            });
        }

        equipo.marca = body.marca;
        equipo.modelo = body.modelo;
        equipo.localidad = body.localidad;
        // localidad.telefono = body.telefono;
        // localidad.telefonoContacto = body.telefono_contacto;
        // localidad.equipo = body.equipo;
        // localidad.usuario = req.user._id;


        equipo.save((err, equipoSaved) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar el equipo',
                    errors: err
                });

            }

            res.status(200).json({
                ok: true,
                equipo: equipoSaved,
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

    Equipo.findByIdAndRemove(id, (err, equipoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar equipo con el id =>' + id,
                errors: err
            });

        }

        if (!equipoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un equipo con ese id',
                errors: { message: 'No existe un equipo con ese id' }
            });

        }

        res.status(200).json({
            ok: true,
            equipo: equipoBorrado,
            message: 'Equipo: ' + id + ': ' + equipoBorrado.nombre + ' => ha sido eliminado de la base de datos',
            usuario: req.user.nombre
        });
    })

});






// exportaciones de rutas
module.exports = app;