USE competencias ;

CREATE TABLE votos(
    id INT(11) NOT NULL AUTO_INCREMENT,
    pelicula_id  INT(11) UNSIGNED NOT NULL,
    competencia_id INT(11) NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(pelicula_id)REFERENCES pelicula(id),
    FOREIGN KEY(competencia_id) REFERENCES competencias(id)


)

ALTER TABLE votos 
ADD eliminado boolean DEFAULT false 