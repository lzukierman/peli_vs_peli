const express = require('express');
const query = require('../db');
const router = express.Router();

router.get('/', (req, res, next) => {
    query(`SELECT *  from competencias
            WHERE eliminada != true`)
        .then((data) => {
            res.send(data);
        }).catch(next);
})

router.get('/:id/peliculas', async (req, res, next) => {
    try {
        const [competencia] = await query('SELECT * FROM competencias WHERE id = ?', req.params.id)

        if (!competencia) {
            res.sendStatus(404);
            return;
        }
        console.log(competencia)
        const peliculas = await query(`
            SELECT DISTINCT p.id ,titulo,poster
            from pelicula p
            JOIN actor_pelicula ap
            ON p.id = ap.pelicula_id
            JOIN director_pelicula dp
            ON p.id = dp.pelicula_id
            WHERE genero_id = COALESCE(?, genero_id)
            AND ap.actor_id = COALESCE(?, ap.actor_id)
            AND dp.director_id = COALESCE(?,dp.director_id)
            ORDER BY RAND()
            LIMIT 2 `, [competencia.genero_id, competencia.actor_id,competencia.director_id])

        res.send({
            competencia: competencia.titulo,
            peliculas: peliculas
        })
    } catch (e) {
        next(e)
    }
})

router.put('/:id',(req,res,next)=>{
query('UPDATE competencias SET titulo = ? WHERE id = ?', [req.body.nombre, req.params.id])
.then(()=>{
    res.sendStatus(204)
})
.catch(next)
})



router.delete('/:id',(req,res,next)=>{
    query('UPDATE competencias SET eliminada = true WHERE id = ?', req.params.id)
    .then(() => {
        res.sendStatus(204);
    })
    .catch(next);
})



router.post('/:id/voto', (req, res, next) => {
    query('INSERT INTO votos(competencia_id,pelicula_id) VALUES (?,?)', [req.params.id, req.body.idPelicula])
        .then((data) => {
            res.status(201);
            res.send({
                id: data.insertId,
                peliculas_id: req.body.idPelicula,
                competencia_id: req.params.id,

            });
        })
        .catch(next);
})


router.delete('/:id/votos', (req, res, next) => {
    query('UPDATE votos SET eliminado = true WHERE competencia_id = ?', req.params.id)
        .then(() => {
            res.sendStatus(204);
        })
        .catch(next);
})



router.get('/:id/resultados', (req, res, next) => {
    Promise.all([
        query('SELECT titulo FROM competencias WHERE id = ?', req.params.id),
        query(`SELECT pelicula_id, COUNT(1) AS votos, p.titulo, p.poster
        FROM votos v
        JOIN pelicula p ON v.pelicula_id = p.id
        WHERE v.competencia_id = ?
        AND eliminado != true
        GROUP BY v.pelicula_id 
        ORDER BY votos DESC 
        LIMIT 3`, req.params.id)
    ]).then(([[competencia], peliculas]) => {
        if (!competencia) {
            res.sendStatus(404);
            return;
        }
        res.send({
            competencia: competencia.titulo,
            resultados: peliculas
        });
    })
        .catch(next)
})


// ME FALTA AGREGAR LA VALIDACION PARA QUE POR LO MENOS DOS PELICULAS CUMPLAN CON LOS REQUISISTOS DE LA COMPETENCIA CREADA. 
router.post('/', (req, res, next) => {
    const generoId = req.body.genero === "0" ? null : req.body.genero;
    const directorId = req.body.director === "0" ? null : req.body.director;
    const actorId = req.body.actor === "0" ? null : req.body.actor;
    console.log(req.body.nombre, generoId, directorId, actorId)
    query('INSERT INTO competencias(titulo, genero_id, director_id, actor_id) values(?, ?, ?, ?)', [req.body.nombre, generoId, directorId, actorId])
        .then(() => {
            res.sendStatus(201);
        })
        .catch(next)
})



router.get('/:id', (req, res, next) => {
    query(`SELECT c.titulo, g.nombre AS genero_nombre, d.nombre AS director_nombre,a.nombre AS actor_nombre
    from competencias c
    LEFT JOIN genero g 
    ON c.genero_id = g.id
    LEFT JOIN director d
    on c.director_id = d.id
    LEFT JOIN actor a 
    on c.actor_id = a.id
     WHERE c.id = ?`, req.params.id)
        .then(([data]) => {
            res.send(data);
        })
        .catch(next);
})


module.exports = router;