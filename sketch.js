var colorThief = new ColorThief();
var canvas, polygons;
var polis = [];
var pol = []
var colores = [];
var fft, noise, filter, reverb;


var FizzyText = function() {
  this.speed = 2;
  this.explode = function(){
      clear();
      noise.amp(0, 0.2)
  }
};

window.onload = function() {
  var text = new FizzyText();
  var gui = new dat.GUI({autoPlace: false});
  var customContainer = document.getElementById('interfaz');
  customContainer.appendChild(gui.domElement);
  gui.add(text, 'speed', 1, 20);
  gui.add(text, 'explode');
};

function preload() {
  polygons = loadJSON("./planos/plano18.json");
}



function setup() {
  canvas = createCanvas(1024, 768);
  canvas.parent('marte');
  smooth(2);
  const numeroPoligonos = polygons.length;
  polygons = _.sortBy(polygons, [function(o) { return o[1]; }])

var sortedRgbArr = polygons.map(function(c, i) {
  // Convert to HSL 1nd keep track of original indices
  return {color: Utils.rgbToHsl(c[0]), index: i};
}).sort(function(c1, c2) {
  // Sort by hue
  return c1.color[0] - c2.color[0];
}).map(function(data) {
  // Retrieve original RGB color
  //console.log(polygons[data.index]);
  return polygons[data.index];
});

  polygons = sortedRgbArr;
  polis = Utils.crearVoronois();
  var concatRang = Utils.crearRango(1);

  for (var i = 0; i < concatRang.length; i++) {
    pol[i] = new Conjunto(polis, concatRang[i][0], concatRang[i][1]);
  }

 filter = new p5.BandPass();
 noise = new p5.Noise();

 // disconnect unfiltered noise,
 // and connect to filter
 noise.disconnect();
 noise.connect(filter);
 noise.start();

 fft = new p5.FFT();

}

function draw(){
  for (var i = 0; i < pol.length; i++) {
    for (var x = 0; x < 17; x++) {
      pol[i].pintar();
    }
  }
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

  static rgbToHsl(c) {
    var r = c[0] / 255,
        g = c[1] / 255,
        b = c[2] / 255;
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return new Array(h * 360, s * 100, l * 100);
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
    var freq = map(this.color[1], 0, 255, 20, 4000);
    filter.freq(freq);
    filter.res(50);
    //empezamos en 1 para oviar el color
    for (let k = 1, kL = singlegon.length; k < kL; k++){
      vertex(singlegon[k][0], singlegon[k][1]);
    }
    endShape(CLOSE);
  }
}
