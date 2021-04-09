const express = require('express');
const router = express.Router();

//aqui ya mandamos a buscar el modelo de mongoose
//la cual se la pasamos a una constante
const Nota = require('../models/Notas');
//aqui llamos al archivo auth para ver si el usuario a sido autentificado
const {isAuthenticated} = require('../helpers/auth');


router.get('/notas/crearnotas', isAuthenticated,(req,res) =>{
//no olvidar agregar el metodo render, asi se mostrara el archivo a renderizar
//aqui en este metodo de ruta se muestra el formulario con su carpeta y archivo hbs
    res.render('notas/nueva-nota');
})


//esta ruta obtendra los datos al crear una nota 
router.post('/notas/nueva-nota',isAuthenticated, async (req,res) => {
    //siguiente linea de codigo obtendra los datos enviados por consola o en este caso  CDM! simbolo del sistema
    console.log(req.body);
    //ahora tembien podremos obtener los datos y guardarlos en una variable
    const {titulo,descripcion} = req.body;
    //creamos un error
    const error = [];
    //creamos las condiciones si estan vacios los campos
    if(!titulo){
        error.push({textoerror: 'Por favor ingrese un titulo!'});
    }

    if(!descripcion){
            error.push({textoerror: 'Por favor ingrese una descripcion!'});
    }

    //y ahora creamos un error la cual va verificar si existen error y si existe va volver a cargar el formulario
    if(error.length > 0){
        res.render('notas/nueva-nota',{
             error,
             titulo,
             descripcion
        });
    }else{
        const NotaCreada = new Nota({titulo,descripcion});
        //tambien le pasamos el id guardado en la session para saber quien guardo sus 
        //notas
        NotaCreada.user = req.user.id;
        //aqui insertamos los datos en la base de datos
        await NotaCreada.save();
        //aqui aplicamos flash luego de a haber creado la nota
        req.flash('success_msg','Nota creada exitosamente');
        //aqui muestra los datos insertados pero por consola
        console.log(NotaCreada);
        //para finalizar iremos a otra ruta donde se mostraran los datos que se han insertado
        res.redirect('/notas');
        //obtendra el archivo de la ruta notas que se encuentra en la parte de abajo del codigo
        /* res.send('ok! Nota guardada en la base de datos'); */
    }

    
});

//alistamos todas las notas y
//tambien que busque solo las notas que estan con el usuario atutentificado  await Nota.find({user: req.user.id}).sort({date: 'desc' })
router.get('/notas', isAuthenticated,async (req, res) => {
    await Nota.find({user: req.user.id}).sort({date: 'desc' })
      .then(documentos => { 
          
          const contexto = { DatosObtenidos: documentos.map(documento => {
            return {
                id:documento._id,
                titulo: documento.titulo,
                descripcion: documento.descripcion,
                fecha :documento.date
            }})

        }
        res.render('notas/lista-notas', {DatosObtenidos: contexto.DatosObtenidos }) 
          
      })
  });

  
  //aqui editamos una nota y tambien por otra parte la enviamos un  id
router.get('/notas/editarnotas/:id', isAuthenticated, async (req, res) => {
	// Ubicar los datos de la nota segun el id
	const nota = await Nota.findById(req.params.id).lean().exec();
    
    let respuesta = [];
    respuesta.push(nota);
    console.log("Los datos de la nota son el arreglo",nota);
    console.log(respuesta.length);
	res.render('notas/editar-notas', { info: respuesta });
});
 
//aqui ya actualizamos los datos
router.put('/notas/editar-notas/:id', isAuthenticated, async (req,res) =>{
        const {titulo,descripcion} = req.body;
        const enviarNuevaNota = await Nota.findByIdAndUpdate(req.params.id,{ titulo, descripcion });
        //nos ayudara a enviar siertos tipos de mensajes por cada actividad que realicemos
        req.flash('success_msg','Nota actualizada correctamente');
        res.redirect('/notas');
        console.log("hola estoy enviando estos datos editados",{enviarNuevaNota});
});

//aqui eleminaremos una nota
router.delete('/notas/eliminar-nota/:id', isAuthenticated, async  (req,res) =>{
  
     await Nota.findByIdAndDelete(req.params.id);
     req.flash('success_msg','Nota eliminada correctamente');
    res.redirect('/notas');
 
});


// Enviar el id de una nota a formulario actualizar ver el formulario con los datos

module.exports = router;
