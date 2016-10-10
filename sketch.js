var colorThief = new ColorThief();
var canvas, polygons;
var pol1, pol2, pol3, pol4, pol5, pol6, pol7, pol8;
var polis = [];
var pol = []
var numeroConguntos = 100;
var simultaneamente;



function preload() {
  polygons = loadJSON("plano5.json");
}

function setup() {
  canvas = createCanvas(1024, 768);
  smooth(2);
  for (let i = 0; i < 4000; i++) {
    polis[i] =new Voronoi(polygons[i]);
  }
  var concatRang = Rangos.crearRango(100);
  for (var i = 0; i < concatRang.length; i++) {
    pol[i] = new Conjunto(polis, concatRang[i][0], concatRang[i][1]);
  }
}

function draw(){
  for (var i = 0; i < pol.length; i++) {
    pol[i].pintar();
  }
}

class Rangos{
  static crearRango(numero){
    let simultaneamente = polygons.length / numeroConguntos;
    let rang = int(_.range(1, polygons.length, simultaneamente));
    let newRang = _.drop(rang);
    let concatRang = _.map(rang, function(v, i) { return [v, newRang[i]]; });
    concatRang[concatRang.length-1][1] = polygons.length-1;
    return concatRang;
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
