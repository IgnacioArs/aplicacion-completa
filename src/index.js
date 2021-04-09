//requerimos nuestro framework
const express = require('express');
//aqui requerimos path la cual unira nuestro directorios
const path = require('path');
//requerimos el motor de plantillas
const exphbs = require('express-handlebars');
//requerimos otra middlewares para enviar tipos metodos
const metogOverride = require('method-override');
//tambien requerimos otra constante con su modulo de session
const session = require('express-session');
//este modulo hace que uno pueda enviar mensaje a multiples vistas
const flash = require('connect-flash');
//lo siguiente que vamos a requerir es passport
//ya que se realizo la configuracion para el inicio de sesion en /config/passport.js
const passport = require('passport');




//initializacion
const app = express();
//requerimos la base de datos para asi utilizarla al igual que los otros archivos
require('./database');
require('./config/passport');





//settings
app.set("port",process.env.PORT || 3000);
app.set("views",path.join(__dirname, "views"));

//configuracion del motor de plantillas
app.engine(".hbs",exphbs({   //contiene un objeto
    //main es el archivo donde se alojaran nuestros componentes (MAIN) es el archivo principal o plantilla principal
defaultLayout: 'main',
//aqui se asignamos la ruta de la carpeta layout concatenamos las rutas mediante sus directorios
layoutsDir:path.join(app.get("views"),'layouts'),
//aqui van las partes html que que podemos reutilizar en cualquier vista
partialsDir:path.join(app.get("views"),'partials'),
//esto sirve para saber que extension van tener nuestros archivos
extname: ".hbs",
}));
//aqui terminamos de configurar el motor de plantillas
app.set("view engine",".hbs");


//middlewares
//sirve para recibir los datos enviados por el usuario
app.use(express.urlencoded({extended:false}));
//sirve para enviar otros tipos de metodos put and delete y hace que la aplicacion lusca mas moderna
app.use(metogOverride("_method"));
//utilizamos session y creamos tambien configuramos un objeto
app.use(session({
    //con esto ya podremos guardar datos y configuraciones temporalmente o datos temporales
    //que quedaran guardados en la pagina
secret:"mysecretapp",
resave: true,
saveUninitialized:true
}));
//inicializamos passport y su metodo llamado initialice
app.use(passport.initialize());
//tambien asignamos la session de que esta arriba
app.use(passport.session());
//aqui utilizamos el modulo flash
app.use(flash()); 





//Global Variables
app.use((req, res, next) =>{
res.locals.success_msg = req.flash('success_msg');
res.locals.error_msg = req.flash('error_msg');
res.locals.error = req.flash('error');
//al momento que el usuario inicie de sesion se obtendra los datos de la siguiente forma
//el passport se encarga de guardar los datos en sessio, entonces el siguiente codigo
//obtendra los datos de un usuario autentificado ( todos sus datos); y si el usuario no existe sera nulo
res.locals.user = req.user || null;
    next();
});

//aqui almacenamos los mensajes con el modulo flash





//Routes
app.use(require("./routes/index"));
app.use(require("./routes/notas"));
app.use(require("./routes/usuarios"));




//Static Files  
app.use(express.static(path.join(__dirname,'public')));







//server is listening
app.listen(app.get("port"), ()  =>{
    console.log("Server on port",app.get("port"));
});


