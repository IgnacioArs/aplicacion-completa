const express = require('express');
const router = express.Router();

//creamos la primera ruta
router.get('/',(req,res) =>{
    res.render('index');
});

//sobre la pagina
router.get('/about',(req,res) =>{
    res.render('about');
})







module.exports = router;
