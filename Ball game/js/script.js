var canvas;
var context;

var cantInicial = 5;
var baseSpeed = 3;

var pelotas = [];
var currentColor = "black";
var colores = [
	"red",
	"blue",
	"black",
	"pink",
	"gray",
	"purple",
	"orange",
	"yellow",
	"brown",
	"green",
	"cyan"
];

var texto = "Pelotas restantes: ";
var puntuacion = 0;
var nivel = 1;
var hit = 0;

function getRandomColor(){
	var intervalo = colores.length;
	var pos = (Math.random() * intervalo);
	var index = parseInt(pos);
	return colores[index];
}

function Rectangulo(x, y, lado1, lado2, color){
	this.x = x;
	this.y = y;
	this.lado1= lado1;
	this.lado2 = lado2;
	this.color = color;

	this.draw = function(){
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.lado1, this.lado2);
	}
}

function Circulo(x,y,radio,color, velx, vely){
	this.x = x;
	this.y = y;
	this.radio = radio;
	this.color = color;
	this.velx = velx;
	this.vely = vely;

	this.draw = function(){
		context.fillStyle = this.color;
		context.beginPath();
		context.arc(this.x,this.y, radio, 0, Math.PI * 2, false);
		context.fill();
		context.stroke();
	}

	this.update = function(){
		this.x += this.velx;
		this.y += this.vely;
		
		if( (this.x + this.radio ) >= canvas.width || ( (this.x - this.radio) <= 0) ){
				this.velx = -this.velx;
				this.color = getRandomColor();
			}

		if( (this.y + this.radio ) >= canvas.width || ( (this.y - this.radio) <= 0) ){
				this.vely *= -1;
				this.color = getRandomColor();
			}	 
		
		this.draw();
	}
}

function getRandomVel(intervalo){
	return (Math.random() - 0.5) * intervalo;
}

function getRandomPoint(intervalo){
	return (Math.random() * (intervalo - 1)) + 30;
}

function init(){
	canvas = document.getElementById('myCanvas');
	context = canvas.getContext("2d");
	context.font = '30px Arial';
	context.strokeText(texto, 5,5);

	for(let i = 0 ; i < cantInicial ; i++){
		var rx = getRandomPoint(100);
		var ry = getRandomPoint(80);

		var rvx = getRandomVel(3);
		var rvy = getRandomVel(3);

		var c = new Circulo(rx,ry,30,getRandomColor(), rvx, rvy);
		pelotas.push(c);
		c.draw();
	}

	initUpdates();
}

function initUpdates(){
	requestAnimationFrame(initUpdates);

	context.clearRect(0,0, canvas.width, canvas.height);
	for(let j = 0 ; j < pelotas.length ; j++){
		pelotas[j].update();
	}

	drawCuadrito();
	context.strokeText(texto + pelotas.length,5,30);
	context.strokeText("Nivel: " + nivel, 480,30);
	context.strokeText("Puntuacion: " + puntuacion, 5, 590);
}

function drawCuadrito(){
	context.fillStyle = currentColor;
	context.fillRect(mouse.x, mouse.y, 10, 10);
}

function detectColision(){
	console.log('Boton clickado');
	for(let i = 0 ; i < pelotas.length ; i++){
		if( ( ( (mouse.x + 5) < (pelotas[i].x + pelotas[i].radio) ) 
			&& ( (mouse.x + 5) > (pelotas[i].x - pelotas[i].radio) ) ) 
			&& ( ( (mouse.y + 5) < (pelotas[i].y + pelotas[i].radio) ) 
			&& ( (mouse.y + 5) > (pelotas[i].y - pelotas[i].radio) ) ) ){
				if(pelotas[i].color === currentColor){
					pelotas.splice(i, 1);
					currentColor = getRandomColor();
					puntuacion += (5 * nivel);
					hit = 1;
					if(pelotas.length === 0){
						baseSpeed += 3;
						cantInicial += 5;
						nivel++;
						for(let i = 0 ; i < cantInicial ; i++){
							var rx = getRandomPoint(100);
							var ry = getRandomPoint(80);

							var rvx = getRandomVel(baseSpeed);
							var rvy = getRandomVel(baseSpeed);

							var c = new Circulo(rx,ry,30,getRandomColor(), rvx, rvy);
							pelotas.push(c);
							c.draw();
						}
					}
				}else{
					pelotas.push(new Circulo(getRandomPoint(100), getRandomPoint(80), 
						30, getRandomColor(), getRandomVel(baseSpeed), getRandomVel(baseSpeed)));
				}
		}
	}

	if(hit === 0){
		pelotas.push(new Circulo(getRandomPoint(100), getRandomPoint(80), 
						30, getRandomColor(), getRandomVel(baseSpeed), getRandomVel(baseSpeed)));
		puntuacion -= (1 * nivel)
	}

	hit = 0;


}

var mouse = {
	x: 0,
	y: 0
};

function mouseMove(e){
	console.log(e.x, e.y);
	mouse.x = e.x;
	mouse.y = e.y;
}

function clickDerecho(e){
	currentColor = getRandomColor();
	e.preventDefault();
}


window.onmousemove = mouseMove;
window.onclick = detectColision;
window.addEventListener("contextmenu", clickDerecho);

window.onload = init;

