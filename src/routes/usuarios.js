const express = require('express');
const Usuarios = require('../models/Usuarios');
const router = express.Router();
//AQUI MANDAMOS A PEDIR EL MODELO MONGO DE USUARIOS
//requerimos el modelo de user
const User = require('../models/Usuarios');
//aqui requerimos passport para la utentificacion del login
const passport = require('passport');

//llamos la pagina login la cual tendra el archivo hbs y lo renderizara
router.get('/usuarios/login',(req,res) =>{
    res.render('usuarios/login');
});

// ahora con el metodo post podemos realizar la utentificacion
//(local) se lo asigna de forma automatica 
router.post('/usuarios/login', passport.authenticate('local',{
    successRedirect: '/notas',
    failureRedirect:  '/usuarios/login',
    failureFlash: true
}));

//aqui creamos otra ruta la cual nos ayudara a cerrar session
router.get('/usuarios/logout', (req,res) =>{
    //utilizar un metodo que viene de passport que para cerrar session
    req.logOut();
    res.redirect('/');
});
















router.get('/usuarios/registro',(req,res) =>{
    res.render('usuarios/registro');
});

router.post('/usuarios/registro', async (req,res) =>{
    const {nombre,email,contra,contrados} = req.body;
    //aqui creamos cada una de las funciones la cual necesita nuestro formnulario
    const error = [];
    console.log(req.body);
    //lo minimo que debemos hacer para que los errores se validen es. validar 1 campo como minimo
    //en este caso el campo nombre esta siendo validado
    if(nombre.length <=0){
        error.push({textoerror: 'Por favor ingrese un nombre'});
    }
    
    if(contra.length <=0){
        error.push({textoerror: 'Por favor ingrese una contraseña'});
    }
    
    if(contrados.length <=0){
        error.push({textoerror: 'Por favor ingrese una segunda contraseña'});
    }

    //las contraseñas son distintas
    if(contra != contrados){
            error.push({textoerror: 'Las contraseñas no coiciden'});
    }
    
    if(contra.length < 4){
        error.push({textoerror: 'La contraseña debe ser mayor que 4 caracteres'});
    }


    if(error.length > 0){
            res.render('usuarios/registro',{error,nombre,email,contra,contrados});
    }else{
                //aqui validamos si existe el email
                const emailRepetido = await User.findOne({email:email});
                if(emailRepetido){
                    req.flash('error_msg','Error El email ya existe!');
                    res.redirect('/usuarios/registro');
                    
                }else{
                           ///aqui ingresamos al usuario completo
                const crearUsuario = new Usuarios({nombre,email,contra,contrados})
                crearUsuario.contra = await crearUsuario.encryptarContra(contra);
                await  crearUsuario.save(); 
                req.flash('success_msg','Usuario registrado correctamente!');
                res.redirect('/usuarios/login')
                }
        
             
    }
    
    //si las contraseñas son menos a cuatro dijitos
    


 /*    console.log('nombre',nombre);
    console.log('email',email);
    console.log('contra',contra);
    console.log('segunda contraseña',contrados); */
    
});



module.exports = router;
