//The mars voyage karlos g liberal (@patxangas) http://interzonas.info 7
var canvas, polygons, fuente;
var polis = [];
var pol = []
var colores = [];
var positions = [];
var posicionIndice = [];
var gui;
var numerRango = 1;
var aleatorio;

//Soudn osc
var fft, ruido, filtro, reverb, sonoridad;
var attackLevel = 1.0;
var releaseLevel = 0;
var env;
var delay;
var osc;

var attackTime = 0.001
var decayTime = 0.2;
var susPercent = 0.2;
var releaseTime = 0.9;
var env, triOsc;


function preload() {
  aleatorio = int(random(1,842));
  //polygons = loadJSON("./planos2/plano839.json");
  polygons = loadJSON("./planos/plano"+aleatorio+".json");
  fuente = loadFont("css/fuente.ttf");
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
  sonoridad.cambioFrecuencia(sonidoColor);
}

class PaisajeSonoro {
  constructor() {
    filtro = this.fitro = new p5.LowPass();
    triOsc = this.triOsc = new p5.Oscillator('sine');
    delay = this.delay = new p5.Delay();
    this.triOsc.disconnect();
    this.triOsc.connect(filtro);
    this.delay.process(triOsc, .08, .50, 300);
    ruido = this.ruido = new p5.Noise();
    this.ruido.disconnect();
    this.ruido.connect(filtro);

    this.ruido.connect(triOsc);
    this.triOsc.amp(1.2, 0.5);
    this.triOsc.start();
    this.ruido.start();
  }
  cambioFrecuencia(freq){
    var freq = map(freq[0], 0, 255, 0, 260);
    filtro.freq(freq);
    triOsc.freq(randomGaussian(freq/2,freq));
    //filtro.res(freq);
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
    this.gui.add(this.text, 'disableLoopMap');
    this.gui.add(this.text, 'onlyNoise');
    this.gui.add(this.text, 'nuevoMapa');
    this.gui.add(this.text, 'reset');
  }
}

class Controles {
  constructor() {
    this.speed = 8;
    this.rangos = 1;
    this.disableLoopMap = true;
    this.onlyNoise = true;
    this.nuevoMapa = function(){
      clear();
      //ruido.stop();
      Utils.nuevoMapa();
    }
    this.reset = function(){
      clear();
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
      if(this.inicio > 3998){
        triOsc.amp(0.0);
        if(gui.text.disableLoopMap){
          setTimeout(function(){
            clear();
            Utils.nuevoMapa();
          }, 500)
        }
      }
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

  static ordenarPorHsl(polygons){
    polygons = _.sortBy(polygons, [function(o) { return o[1]; }])
    let result = polygons.map(function(c, i) {
      return {color: Utils.rgbToHsl(c[0]), index: i};
    }).sort(function(c1, c2) {
      return c1.color[2] - c2.color[2];
    }).map(function(data) {
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
    if(gui.text.onlyNoise){
      sonoridad = new PaisajeSonoro();
    }
  }
  static nuevoMapa(){
    aleatorio = int(random(1,839));
    var alphabet = ["ESP_035807_1885","ESP_035831_1760","ESP_037222_1820","ESP_037237_1435","ESP_037300_1825","ESP_037328_1845","ESP_037371_1350","ESP_037474_1380","ESP_037494_1685","ESP_037545_1730","ESP_037551_2540","ESP_037626_0985","ESP_037641_1560","ESP_037700_1710","ESP_037714_1935","ESP_037811_0985","ESP_037877_0985","ESP_038022_0985","ESP_038044_1965","ESP_038117_1385","ESP_038143_2205","ESP_038224_1890","ESP_038227_2020","ESP_038299_0985","ESP_038646_1805","ESP_038798_1665","ESP_038821_1235","ESP_038851_1900","ESP_038877_1875","ESP_038877_2135","ESP_038896_1255","ESP_038903_1115","ESP_038904_1430","ESP_038918_1650","PSP_006254_1885","PSP_006261_1410","PSP_006262_1080","PSP_006268_1995","PSP_006270_0955","PSP_006271_2210","PSP_006736_1325","PSP_006745_1715","PSP_006745_2250","PSP_006760_1370","PSP_006769_1595","PSP_006773_1735","PSP_006806_2215","PSP_006820_1760","PSP_006835_1535","PSP_006991_1905","PSP_006999_1965","PSP_007004_2000","PSP_007006_1765","PSP_007013_1105","PSP_007033_1445","PSP_007035_1670","PSP_007055_2015","PSP_007059_1975","PSP_007080_2565","PSP_007095_2020","PSP_007119_1700","PSP_007124_1765","PSP_007126_1210","PSP_007143_1370","PSP_007151_1445","PSP_007153_2505","PSP_007392_2650","PSP_007394_1750","PSP_007403_1670","PSP_007417_1755","PSP_007430_1725","PSP_007464_1985","PSP_007481_1560","PSP_007492_2265","PSP_007493_2650","PSP_007494_2580"];
    textFont(fuente);
    textSize(44);
    text("loading...",  width / 2, height / 2);
    var cararTexto = setInterval(function(){
      console.log("movida");
      clear()
      var randomTextNumber = int(random(0, 24));
      text(alphabet[randomTextNumber],  width / 2, height / 2);
    }, 100);

    polygons = loadJSON("./planos/plano"+aleatorio+".json",function(){
      clear()
      clearInterval(cararTexto);
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
