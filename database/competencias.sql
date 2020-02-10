USE  competencias;


CREATE TABLE competencias(
    id INT(11) NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(150) NOT NULL,
    PRIMARY KEY(id)



);


INSERT INTO competencias (titulo) VALUES 
('Cual es la  mejor pelicula?'),
('Que drama te hizo llorar mas?'),
('Cual es la pelicula mas bizarra?');


ALTER TABLE competencias    
ADD genero_id INT(11);


ALTER TABLE competencias 
MODIFY genero_id INT(11) UNSIGNED ;


ALTER TABLE competencias 
ADD FOREIGN KEY(genero_id) REFERENCES genero(id);




ALTER TABLE competencias
ADD director_id INT(11) UNSIGNED;

ALTER TABLE competencias
ADD FOREIGN KEY(director_id) REFERENCES director(id)


ALTER TABLE competencias 
ADD actor_id INT(11) UNSIGNED;

ALTER TABLE competencias
ADD FOREIGN KEY(actor_id) REFERENCES actor(id);



ALTER TABLE competencias
ADD eliminada boolean DEFAULT false ;



