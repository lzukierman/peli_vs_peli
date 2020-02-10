const dotenv = require('dotenv');
dotenv.config()
const express = require('express');
const path = require('path');
const competencias = require('./controller/competencias');
const generos = require('./controller/generos');
const directores = require('./controller/directores');
const actores =  require('./controller/actores');

const app =  express();

//middleware
app.use(express.urlencoded({ extended: true }))


//settings
app.use("/competencias", competencias);
app.use('/generos', generos);
app.use('/directores', directores);
app.use('/actores', actores);
app.use(express.static(path.resolve('cliente/html')));
app.use(express.static(path.resolve('cliente')));



//puerto 
app.listen(process.env.PORT, function () {
    console.log( "Escuchando en el puerto " + process.env.PORT);
  });



