//qui vamos autenticar a un usuario si existe un usuario o no
const helpers = {};
helpers.isAuthenticated = (req,res,next) => {
            //si esta el usuario autentificado o ha iniciado session
            if(req.isAuthenticated()){
                    return  next();
            }
            req.flash('error_msg','No autorizado!');
            res.redirect('/usuarios/login')
}

module.exports = helpers;