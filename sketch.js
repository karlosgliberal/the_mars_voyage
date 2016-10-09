var img;
var smallPoint, largePoint;


var myImg;
var polygons;
var pixelColors = [];
var scanLine = 0;
var regla = [];
var colorThief = new ColorThief();
var plano =[];
var plano_objeto = {};
var fr = 60;
var c, width, height, polydraw, colorArr, vertices, voronoi, polygons, colorDominat, paleta;

function preload() {
  polygons = loadJSON("plano5.json");
}

function setup() {
  frameRate(fr)
  c = createCanvas(1024, 768);
  scanLine = 0;
  smooth(2);
  console.log(polygons[1]);

}

function draw(){
  strokeWeight(.3);
  stroke(255);
    let incremento = frameCount;
    var color = polygons[incremento][0];
    polygons[incremento].shift();
    var singlegon = polygons[incremento];
    stroke(255);
    beginShape();
    fill(color);
    for (var k = 0, kL = singlegon.length; k < kL; k++){
      vertex(singlegon[k][0], singlegon[k][1]);
    }
    endShape(CLOSE);
}

function mousePressed() {
  save("voronoi.jpg");
}

function mouseMoved(){
  incremento = int(map(mouseX,0,1024,1,3999));
  console.log(incremento);
}
