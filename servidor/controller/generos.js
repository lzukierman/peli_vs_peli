const express = require('express');
const query = require('../db');
const router = express.Router();


router.get('/',(req,res,next)=>{
    query('select * from genero')
    .then((data)=>{
        res.send(data);
    }).catch(next);

    })
    




module.exports = router;