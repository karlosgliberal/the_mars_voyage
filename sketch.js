var colorThief = new ColorThief();
var incremento = 0;
var incremento2 = 1000;
var incremento3 = 2000;
var incremento4 = 3000;
var incremento5 = 4000;
var canvas, polygons;
var pol1, pol2, pol3, pol4, pol5, pol6, pol7, pol8;
var polis = [];
var rang;
var pares;
var numeroConguntos = 10;
var simultaneamente;



function preload() {
  polygons = loadJSON("plano5.json");
}

function setup() {
  canvas = createCanvas(1024, 768);
  smooth(2);
  for (var i = 0; i < 4000; i++) {
    polis[i] =new Voronoi(polygons[i]);
  }

  simultaneamente = polygons.length / numeroConguntos;
  console.log(simultaneamente);
  rang = _.range(1, polygons.length, simultaneamente);
  pares = _.partition(rang, n => n % 2);
  console.log(pares);


  pol1 = new Conjunto(polis, 1, 500);
  pol2 = new Conjunto(polis, 500, 1000);
  pol3 = new Conjunto(polis, 1000, 1500);

}

function draw(){
  pol1.pintar();
  pol2.pintar();
  pol3.pintar();
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
