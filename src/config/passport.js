const passport  = require('passport');
//manera de autentificar el usuario facebook,twiter,correo,etc
const LocalStrategy = require('passport-local').Strategy;

//hay que acotar que para que la verificacion de nombre o email y como la contraseña para eso necesitamos llamar al modelo
//de base de datos
const User = require('../models/Usuarios');

//definifir una nueva estrategia de autentificacion
passport.use(new LocalStrategy({
    //que parametro el usuario va enviar par autentificar
      usernameField:'email',
      passwordField: 'contra'
      //acontinuacionb del objeto
      //va a crear una funcion
      //para recivir los datos y definir los datos para la autentificacion
}, async (email,contra,done) =>{
    //realizamo la busqueda del email
    const user = await User.findOne({email:email});
    //si no existe el usuario
    if(!user){
           //null para el error //false para el usuario -> le sigue con un mensaje dependiendo el resultado basicamente 
            return done(null,false,{ message: 'Email del usuario no registrado!'});
    }else{
        ///en el caso que si existe el usuario
        //ahora validamos su contraseña
        const mathResultado  = await user.CompararContra(contra);
        //ahora validamos en el caso que salga bien la autentificacion
        if(mathResultado){
             //le agregamos null para el error ya que salio todo bien
             // y de segundo parametro le agregamos un user ya que si se encontro el usuario que se 
             //buscaba
                return done(null,user);
        }else{
             return done(null,false, {message : 'Error en la contraseña!, Incorrecta'});
        }
    }
}));

//Una vez que el usuario se autentique tendra que ser almacenado en algun lugar 
// y es por eso, tenemos que ver la forma de guardar a ese usuario en una ssesion
passport.serializeUser((user,done) => {
   //entonces le pasamos los siguiente
   //el backdone tendra
   //null en error y un usuario con su id
    done(null,user.id);
});

//aqui hacemos el caso inverso 
//coma un id y genera un usuario
passport.deserializeUser((id,done) => {
    //tomamos el id y generamos un usuario
    User.findById(id,(err,user) => {
        //si encuentra al usuario
        //deserializamos y creamos la session del usuario por cada usuario
        done(err,user);
    });
}); 











/*  const passport  = require('passport');
//manera de autentificar el usuario facebook,twiter,correo,etc
const LocalStrategy = require('passport-local').Strategy;

//hay que acotar que para que la verificacion de nombre o email y como la contraseña para eso necesitamos llamar al modelo
//de base de datos
const User = require('../models/Usuarios');
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "contra"
    },
    async (email, contra, done) => {
      // Match Email's User
      const user = await User.findOne({ email: email });

      if (!user) {
        return done(null, false, { message: "Not User found." });
      } else {
        // Match Password's User
        const match = await user.CompararContra(contra);
        if (match) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect Password." });
        }
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
 */



