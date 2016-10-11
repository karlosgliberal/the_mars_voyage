var colorThief = new ColorThief();
var canvas, polygons;
var polis = [];
var pol = []

function preload() {
  polygons = loadJSON("plano5.json");
}

function setup() {
  canvas = createCanvas(1024, 768);
  smooth(2);
  const numeroPoligonos = polygons.length;
  polygons = _.sortBy(polygons, [function(o) { return o[1]; }])
  console.log(polygons);


  polis = Utils.crearVoronois();
  var concatRang = Utils.crearRango(10);

  for (var i = 0; i < concatRang.length; i++) {
    pol[i] = new Conjunto(polis, concatRang[i][0], concatRang[i][1]);
  }
}

function draw(){
  for (var i = 0; i < pol.length; i++) {
    pol[i].pintar();
  }
}

function mousePressed(){
  clear();
}

class Utils{
  static crearRango(numero){
    let simultaneamente = polygons.length / numero;
    let rang = int(_.range(1, polygons.length, simultaneamente));
    let newRang = _.drop(rang);
    let concatRang = _.map(rang, function(v, i) { return [v, newRang[i]]; });
    concatRang[concatRang.length-1][1] = polygons.length-1;
    return concatRang;
  }

  static crearVoronois(){
    let arrayPolis = [];
    for (let i = 0; i < 4000; i++) {
       arrayPolis[i] =new Voronoi(polygons[i]);
    }
    return arrayPolis;
  }
}

class Conjunto {
  constructor(voronoi, inicio, fin) {
    this.voronoi = voronoi;
    this.inicio = inicio;
    this.fin = fin;
  }

  pintar(){
    if (this.inicio < this.fin) {
      this.inicio = this.inicio + 1;
      this.voronoi[this.inicio].display();
    }
  }
}

class Voronoi {
  constructor(polygons) {
    this.polygons = polygons;
    this.color = polygons[0];
  }

  display(){
    strokeWeight(.3);
    stroke(255);
    let singlegon = this.polygons;
    stroke(255);
    beginShape();
    fill(this.color);
    //empezamos en 1 para oviar el color
    for (let k = 1, kL = singlegon.length; k < kL; k++){
      vertex(singlegon[k][0], singlegon[k][1]);
    }
    endShape(CLOSE);
  }
}
