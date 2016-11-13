##The mars voyage
**Serie Voronoi** #0

![Alt text](https://cdn.rawgit.com/karlosgliberal/be3d9c8f34219630d04491ecc7067032/raw/7996e057e4bb02a4978d849a32a859d562a32c99/martesTresColres.svg)

Este proyecto es una interpretación de las imágenes que obtiene la cámara [HiRISE]("http://www.uahirise.org/katalogos.php") de la sonda MRO. Esta sonda lleva desde el 2008 sacando fotos y ahora están en dominio publico para su uso.

The mars voyage se ha realizado con [p5.js](http://p5.js) esta herramienta de la funcación processing esta pensada para fucionar con un navegador.

El proyecto se divide en dos parte, la primera ([gist](https://gist.github.com/karlosgliberal/0e9e61d9f427c2c9c6c2cb06ded3052a)) con la que generamos el plano de coordenadas y colores, desde el marco del diagrama de voronoi (creado con [d3.js](https://d3js.org/)). Y la segunda (este proyecto), que interpreta el plano para crear una visualización de marte desde nuestro punto de vista.

#install
```javascript
npm install
gulp watch
```

El gulp lo usamos para poder convertir el sketch de es6 a es2015.

Tanto la visualización como el sonido se ha realizados con [p5js](http://p5js.org).

[@patxangas](http://twitter.com/patxangas)
