//The mars voyage karlos g liberal (@patxangas) http://interzonas.info 2
var canvas, polygons;
var polis = [];
var pol = []
var colores = [];
var positions = [];
var posicionIndice = [];
var fft, ruido, filtro, reverb, sonoridad;
var gui;
var numerRango = 1;
var env;
var delay;
var osc;
var aleatorio;

function preload() {
  aleatorio = int(random(1,842));
  //polygons = loadJSON("./planos2/plano839.json");
  polygons = loadJSON("./planos/plano"+aleatorio+".json");
}

function setup() {
  canvas = createCanvas(1024, 768);
  canvas.parent('marte');
  smooth(2);
  gui = new Gui();
  Utils.init();
}

function draw(){
  for (var i = 0; i < pol.length; i++) {
    for (var x = 0; x < gui.text.speed; x++) {
      pol[i].pintar();
    }
  }
}

function mouseMoved(){
  var size = dist(mouseX, mouseY, 0, 0);
  let x = int(map(size,0,1250,0,4000));
  let sonidoColor = polis[x].color;
  for (var i = 0; i < 1000; i++) {
    polis[x].display();
  }
  console.log(polis);
  sonoridad.cambioFrecuencia(sonidoColor);
}

class PaisajeSonoro {
  constructor() {
    filtro = this.fitro = new p5.LowPass();
    ruido = this.ruido = new p5.Noise();
    delay = this.delay = new p5.Delay();

    this.ruido.disconnect();
    this.ruido.connect(filtro);
    this.delay.process(ruido, .09, .30, 450)
    this.ruido.start();
  }
  cambioFrecuencia(freq){
    var freq = map(freq[1], 0, 255, 30, 500);
    filtro.freq(freq);
    filtro.res(60);
  }
}

class Gui{
  constructor(){
    this.text = new Controles();
    this.gui = new dat.GUI({autoPlace: false});
    this.customContainer = document.getElementById('interfaz');
    this.customContainer.appendChild(this.gui.domElement);
    this.gui.add(this.text, 'speed', 1, 80);
    this.gui.add(this.text, 'rangos', 1, 20);
    this.gui.add(this.text, 'nuevoMapa');
    this.gui.add(this.text, 'reset');
  }
}

class Controles {
  constructor() {
    this.speed = 8;
    this.rangos = 1;
    this.nuevoMapa = function(){
      clear();
      ruido.stop();
      Utils.nuevoMapa();
    }
    this.reset = function(){
      clear();
      ruido.stop();
      Utils.init();
    }
  }
}

class Conjunto {
  constructor(voronoi, inicio, fin) {
    this.voronoi = voronoi;
    this.inicio = inicio;
    this.fin = fin;
    this.positions = [];
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
    let puntoEje = createVector(ceil(polygons[polygons.length-1][0]), ceil(polygons[polygons.length-1][1]));
    this.positions = puntoEje;
    positions.push(puntoEje);
  }

  display(){
    strokeWeight(.3);
    stroke(255);
    let singlegon = this.polygons;
    stroke(255);
    beginShape();
    fill(this.color);
    sonoridad.cambioFrecuencia(this.color);
    //empezamos en 1 para oviar el color
    for (let k = 1, kL = singlegon.length; k < kL; k++){
      vertex(singlegon[k][0], singlegon[k][1]);
    }
    endShape(CLOSE);
    //punto del poligono;
  };
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

  static  ordenarPorHsl(polygons){
    polygons = _.sortBy(polygons, [function(o) { return o[1]; }])
    let result = polygons.map(function(c, i) {
      // Convert to HSL 1nd keep track of original indices
      return {color: Utils.rgbToHsl(c[0]), index: i};
    }).sort(function(c1, c2) {
      // Sort by hue
      return c1.color[2] - c2.color[2];
    }).map(function(data) {
      // Retrieve original RGB color
      //console.log(polygons[data.index]);
      return polygons[data.index];
    });
    return result;
  }

  static init(){
    polygons = Utils.ordenarPorHsl(polygons);
    polis = Utils.crearVoronois();
    let rangoDeVoronois = Utils.crearRango(gui.text.rango);
    //TODO Tengo que ver como funciona la creación automatica de objeto en ES6
    for (var i = 0; i < rangoDeVoronois.length; i++) {
      pol[i] = new Conjunto(polis, rangoDeVoronois[i][0], rangoDeVoronois[i][1]);
    }
    sonoridad = new PaisajeSonoro();

  }
  static nuevoMapa(){
    aleatorio = int(random(1,839));
    polygons = loadJSON("./planos/plano"+aleatorio+".json",function(){
      Utils.init();
    });
  }
  static rgbToHsl(c){
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
