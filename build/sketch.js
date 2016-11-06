"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//The mars voyage karlos g liberal (@patxangas) http://interzonas.info 6
var canvas, polygons;
var polis = [];
var pol = [];
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

//Soudn osc
var attackLevel = 1.0;
var releaseLevel = 0;
var attackTime = 0.001;
var decayTime = 0.2;
var susPercent = 0.2;
var releaseTime = 0.5;

function preload() {
  aleatorio = int(random(1, 842));
  //polygons = loadJSON("./planos2/plano839.json");
  polygons = loadJSON("./planos/plano" + aleatorio + ".json");
}

function setup() {
  canvas = createCanvas(1024, 768);
  canvas.parent('marte');
  smooth(2);
  gui = new Gui();
  Utils.init();
}

function draw() {
  for (var i = 0; i < pol.length; i++) {
    for (var x = 0; x < gui.text.speed; x++) {
      pol[i].pintar();
    }
  }
}

function mouseMoved() {
  var size = dist(mouseX, mouseY, 0, 0);
  var x = int(map(size, 0, 1250, 0, 4000));
  var sonidoColor = polis[x].color;
  for (var i = 0; i < 1000; i++) {
    polis[x].display();
  }
  console.log(polis);
  sonoridad.cambioFrecuencia(sonidoColor);
}

var PaisajeSonoro = function () {
  function PaisajeSonoro() {
    _classCallCheck(this, PaisajeSonoro);

    // filtro = this.fitro = new p5.LowPass();
    // ruido = this.ruido = new p5.Noise();
    // delay = this.delay = new p5.Delay();
    //
    // this.ruido.disconnect();
    // this.ruido.connect(filtro);
    // this.delay.process(ruido, .09, .30, 450)
    // this.ruido.start();
    env = new p5.Env();
    env.setADSR(attackTime, decayTime, susPercent, releaseTime);
    env.setRange(attackLevel, releaseLevel);

    triOsc = new p5.Oscillator('triangle');
    triOsc.amp(env);
    triOsc.start();
    triOsc.freq(220);
  }

  _createClass(PaisajeSonoro, [{
    key: "cambioFrecuencia",
    value: function cambioFrecuencia(freq) {
      env.play();
      // var freq = map(freq[0], 0, 255, 30, 500);
      // filtro.freq(freq);
      // filtro.res(60);
    }
  }]);

  return PaisajeSonoro;
}();

var Gui = function Gui() {
  _classCallCheck(this, Gui);

  this.text = new Controles();
  this.gui = new dat.GUI({ autoPlace: false });
  this.customContainer = document.getElementById('interfaz');
  this.customContainer.appendChild(this.gui.domElement);
  this.gui.add(this.text, 'speed', 1, 80);
  this.gui.add(this.text, 'rangos', 1, 20);
  this.gui.add(this.text, 'nuevoMapa');
  this.gui.add(this.text, 'reset');
};

var Controles = function Controles() {
  _classCallCheck(this, Controles);

  this.speed = 8;
  this.rangos = 1;
  this.nuevoMapa = function () {
    clear();
    ruido.stop();
    Utils.nuevoMapa();
  };
  this.reset = function () {
    clear();
    ruido.stop();
    Utils.init();
  };
};

var Conjunto = function () {
  function Conjunto(voronoi, inicio, fin) {
    _classCallCheck(this, Conjunto);

    this.voronoi = voronoi;
    this.inicio = inicio;
    this.fin = fin;
    this.positions = [];
  }

  _createClass(Conjunto, [{
    key: "pintar",
    value: function pintar() {
      if (this.inicio < this.fin) {
        this.inicio = this.inicio + 1;
        this.voronoi[this.inicio].display();
      }
    }
  }]);

  return Conjunto;
}();

var Voronoi = function () {
  function Voronoi(polygons) {
    _classCallCheck(this, Voronoi);

    this.polygons = polygons;
    this.color = polygons[0];
    var puntoEje = createVector(ceil(polygons[polygons.length - 1][0]), ceil(polygons[polygons.length - 1][1]));
    this.positions = puntoEje;
    positions.push(puntoEje);
  }

  _createClass(Voronoi, [{
    key: "display",
    value: function display() {
      strokeWeight(.3);
      stroke(255);
      var singlegon = this.polygons;
      stroke(255);
      beginShape();
      fill(this.color);
      sonoridad.cambioFrecuencia(this.color);
      //empezamos en 1 para oviar el color
      for (var k = 1, kL = singlegon.length; k < kL; k++) {
        vertex(singlegon[k][0], singlegon[k][1]);
      }
      endShape(CLOSE);
      //punto del poligono;
    }
  }]);

  return Voronoi;
}();

var Utils = function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  _createClass(Utils, null, [{
    key: "crearRango",
    value: function crearRango(numero) {
      var simultaneamente = polygons.length / numero;
      var rang = int(_.range(1, polygons.length, simultaneamente));
      var newRang = _.drop(rang);
      var concatRang = _.map(rang, function (v, i) {
        return [v, newRang[i]];
      });
      concatRang[concatRang.length - 1][1] = polygons.length - 1;
      return concatRang;
    }
  }, {
    key: "crearVoronois",
    value: function crearVoronois() {
      var arrayPolis = [];
      for (var i = 0; i < 4000; i++) {
        arrayPolis[i] = new Voronoi(polygons[i]);
      }
      return arrayPolis;
    }
  }, {
    key: "ordenarPorHsl",
    value: function ordenarPorHsl(polygons) {
      polygons = _.sortBy(polygons, [function (o) {
        return o[1];
      }]);
      var result = polygons.map(function (c, i) {
        // Convert to HSL 1nd keep track of original indices
        return { color: Utils.rgbToHsl(c[0]), index: i };
      }).sort(function (c1, c2) {
        // Sort by hue
        return c1.color[2] - c2.color[2];
      }).map(function (data) {
        // Retrieve original RGB color
        //console.log(polygons[data.index]);
        return polygons[data.index];
      });
      return result;
    }
  }, {
    key: "init",
    value: function init() {
      polygons = Utils.ordenarPorHsl(polygons);
      polis = Utils.crearVoronois();
      var rangoDeVoronois = Utils.crearRango(gui.text.rango);
      //TODO Tengo que ver como funciona la creación automatica de objeto en ES6
      for (var i = 0; i < rangoDeVoronois.length; i++) {
        pol[i] = new Conjunto(polis, rangoDeVoronois[i][0], rangoDeVoronois[i][1]);
      }
      sonoridad = new PaisajeSonoro();
    }
  }, {
    key: "nuevoMapa",
    value: function nuevoMapa() {
      aleatorio = int(random(1, 839));
      polygons = loadJSON("./planos/plano" + aleatorio + ".json", function () {
        Utils.init();
      });
    }
  }, {
    key: "rgbToHsl",
    value: function rgbToHsl(c) {
      var r = c[0] / 255,
          g = c[1] / 255,
          b = c[2] / 255;
      var max = Math.max(r, g, b),
          min = Math.min(r, g, b);
      var h,
          s,
          l = (max + min) / 2;

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
  }]);

  return Utils;
}();