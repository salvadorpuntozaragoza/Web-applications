var db;

//Nombre de la coleccion en FireBase
const COL_USERS = "usuarios";
const COL_PUBL = "publicaciones";
const COL_COMENT = "comentarios";

var container;
var places;

var documents;
var usuarios;
var comentarios;

var searchBar;

var modalHeader;
var modalBody;
var modalFooter;
var modalComents;
var opened_modal;

var fecha;

var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto",
"Septiembre", "Octubre", "Noviembre", "Diciembre"];

var regLugar;
var regDesc;

function Publicacion(lugar, descripcion){
	this.id = 0;
	this.idUsuario = 0;
	this.lugar = lugar;
	this.descripcion = descripcion;
	this.mes = meses[fecha.getMonth()];
	this.dia = fecha.getDate();
	this.hora = fecha.getHours();
	this.minuto = fecha.getMinutes();
}

function Comentario(mensaje){
	this.id = 0;
	this.idUsuario = 0;
	this.idPublicacion = 0;
	this.mensaje = mensaje;
}

//Renderiza las tarjetas que aparecen en index.html
//dentro del contenedor indicado
function renderNewCard(item){

	container.innerHTML += `<div class="card cards" style="width: 18rem;">
			  <div class="card-body">
			    <h5 class="card-title">${item.lugar}</h5>
			    <h6>${item.mes} ${item.dia}, a las: ${item.hora}:${item.minuto}</h6>
			    <p class="card-text">${item.descripcion}</p>
			    <button class="btn btn-dark" type="button" data-toggle="modal" onclick = "fillModal('${item.id}')" data-target="#myModal">Mas informacion</button>
			  </div>
			</div>`;
}

function filtrar(lugar){

	var item;

	if(!lugar)
		item = getValue('idBuscar');
	else
		item = lugar;

	container.innerHTML = '';

	if(!item){
		alert("No has introducido texto");
		for(let i = 0 ; i < documents.length ; i++){
			renderNewCard(documents[i]);
		}
	}
	else{
		for(let i = 0 ; i < documents.length ; i++){
			if(documents[i].descripcion.indexOf(item) >= 0 || documents[i].lugar === item )
				container.innerHTML += `<div class="card cards" style="width: 18rem;">
			  	<div class="card-body">
			    	<h5 class="card-title">${documents[i].lugar}</h5>
			    	<h6>${documents[i].mes} ${documents[i].dia}, a las: ${documents[i].hora}:${documents[i].minuto}</h6>
			    	<p class="card-text">${documents[i].descripcion}</p>
			    	<button class="btn btn-dark" type="button" data-toggle="modal" onclick = "fillModal('${documents[i].id}')" data-target="#myModal">Mas informacion</button>
			  	</div>
				</div>`;
		}
	}
}

function addLugar(lugar){

	var add = true;

	if(places.length === 0){
		places.push(lugar);
	}else{
		for(let i = 0 ; i < places.length ; i++){
			if(places[i] === lugar) add = false;
		}
	}

	if(add){
		places.push(lugar);
		var sideBar = document.getElementById('sideBar');
		console.log('1');
		sideBar.innerHTML += `<h4 id="sidePlaces" onclick="filtrar('${lugar}')">${lugar}</h4>`;
		console.log('2');
	}
}

//Busca el elemento HTML por medio del ID
//y regresa el valor escrito en el
function getValue(string){
	return (document.getElementById(string).value);
}

function findDocumentByID(id){
	var item;
	var i = 0;
	
	while (!item  && (i < documents.length)){
		if(documents[i].id === id)
			item = documents[i];
		i++;
	}

	if(item)
		return item;
	else
		return 0;
}

function findUserByID(id){
	var item;
	var i = 0;
	
	while (!item  && (i < usuarios.length)){
		if(usuarios[i].id === id)
			item = usuarios[i];

		i++;
	}

	if(item)
		return item;
	else
		return 0;
}


//Renderiza dentro del modal localizado en index.html
//los datos de la publicacion que fue presionada por medio del
//ID del documento en la BD
function fillModal(id){
	var item;
	opened_modal = id;
	
	// for(let i = 0 ; i < documents.length ; i++){
	// 	if(documents[i].id === id)
	// 		item = documents[i];
	// }

	item = findDocumentByID(id);

	var usr;
	var i = 0 ;

	// while(!usr){
	// 	if(usuarios[i].id === item.idUsuario)
	// 		usr = usuarios[i].usuario;
	// 	i++;
	// }

	usr = findUserByID(item.idUsuario);

	modalHeader.innerHTML = `<h5>${item.lugar}</h5>
								<h6>Pubished by: ${usr.usuario}</h6>`;

	modalBody.innerHTML = `<article><h5>Deal:</h5>
			<p>${item.descripcion}</p>
	</article>`;

	modalComents.innerHTML = '';
	for(let i = 0 ; i < comentarios.length ; i++){
		if(comentarios[i].idPublicacion === id){
			usr = findUserByID(comentarios[i].idUsuario);
			modalComents.innerHTML +=`<h6 class = "user-comments">${usr.usuario} dice: </h6>
													<h6>${comentarios[i].mensaje}</h6>`; 
		}	
	}

}


//Escucha los datos que se modifican, anaden o se borran de la BD en tiempo real
//y los renderiza en la pagina principal index.html 
function escuchar(){
	db.collection(COL_PUBL).onSnapshot(
		data => {
			data.docChanges().forEach(function(change){
				var action = change.type;
				if(action == "added" || action == "modified" || action == "removed"){
					var item = change.doc.data();
					var id = change.doc.id;
					item.id = id;
					console.log("Publicacion changed", item);
					if(item.mes === meses[fecha.getMonth()] && item.dia === fecha.getDate() && item.hora >= (fecha.getHours() - 2) ){
						documents.push(item);
						renderNewCard(item);
						addLugar(item.lugar);
					}
				}
			});
		},
		error => {
			console.error("Error al escuchar", error);
		}
	);
}

function leer(){
	db.collection(COL_USERS).onSnapshot(
		data => {
			data.docChanges().forEach(function(change){
				var action = change.type;
				if(action == "added" || action == "modified" || action == "removed"){
					var item = change.doc.data();
					var id = change.doc.id;
					item.id = id;
					console.log("Usuario changed", item);
					usuarios.push(item);
				}
			});
		},
		error => {
			console.error("Error al escuchar", error);
		}
	);
}

function validar(){
	if(!getValue('lugarID')
		|| !getValue('descID'))
		return 0 ;
	else
		return 1 ;
}

function guardar(){
	if(validar()){
		var publicacion = new Publicacion(getValue('lugarID'), getValue('descID'));
		publicacion.idUsuario = logedUser.id;

		var item = Object.assign({}, publicacion);
		db.collection(COL_PUBL).add(item).then(
		data => {
			// alert('Registrado!!!');
		},
		error => {
			alert('Error');
			console.error("Ocurrio un error al guardar los datos!!!", error);
		});
	}else{
		alert('Error: llena todos los campos.');
	}
}

function saveComment(){
	if(!getValue('mensajeID'))
		alert('Escribe un mensaje');
	else{
		var mensaje = new Comentario(getValue('mensajeID'));
		mensaje.idUsuario = logedUser.id;
		mensaje.idPublicacion = opened_modal;

		var item = Object.assign({}, mensaje);
		db.collection(COL_COMENT).add(item).then(
		data => {
			// alert('Mensaje enviado con exito!!!');
		},
		error => {
			alert('Error');
			console.error("Ocurrio un error al guardar los datos!!!", error);
		});

		var coment = document.getElementById('mensajeID');
		coment.value = '';
	}
}

function closeModal(){
	opened_modal = '';
}

function readComments(){
	db.collection(COL_COMENT).onSnapshot(
		data => {
			data.docChanges().forEach(function(change){
				var action = change.type;
				if(action == "added" || action == "modified" || action == "removed"){
					var item = change.doc.data();
					var id = change.doc.id;
					item.id = id;
					console.log("Comentario changed", item);
					comentarios.push(item);
					if(opened_modal === item.idPublicacion){
						var user = findUserByID(item.idUsuario);
						modalComents.innerHTML += `<h6 class = "user-comments">${user.usuario} dice: </h6>
													<h6>${item.mensaje}</h6>`;
					}
				}
			});
		},
		error => {
			console.error("Error al escuchar", error);
		}
	);
}

function logOff(){
	localStorage.removeItem('_account');
	window.open('login.html');
	window.close();
}

function init(){

	if(!localStorage.getItem('_account')){
		window.open('login.html');
		window.close();
	}

	//Inicializar arreglo de documentos
	documents = [];
	usuarios = [];
	comentarios = [];
	places = [];

	fecha = new Date();

	//Configuracion basica de firebase
	var config = {
		//Estos datos se deben modificar con la BD del administrador encargado
		apiKey: "AIzaSyD_nJuObsymuk82AkQRzitv6H7Tdao_0Wg",
	    authDomain: "health-share-a0bc6.firebaseapp.com",
	    databaseURL: "https://health-share-a0bc6.firebaseio.com",
	    projectId: "health-share-a0bc6",
	    storageBucket: "health-share-a0bc6.appspot.com",
	    messagingSenderId: "516403798393"
  	};
	
	firebase.initializeApp(config);

    db = firebase.firestore();

    //Get los elementos del HTML index.html
    container = document.getElementById('publicaciones');
    modalHeader = document.getElementById('modalTitleID');
    modalBody = document.getElementById('modalBodyID');
    modalFooter = document.getElementById('modalFooterID');
    modalComents = document.getElementById('comentsID');
    regLugar = document.getElementById('lugarID');
    regDesc = document.getElementById('descID');
    searchBar = document.getElementById('idBuscar');
    searchBar.addEventListener('keypress', function(args){
		if(args.key === 'Enter'){
			console.log('Hola mundo');
			filtrar();
		}
	});

    logedUser = localStorage.getItem('_account');
    //localStorage.removeItem('_account');
    //decodes a string data encoded using base-64
    logedUser = atob(logedUser);
    //parses to Object the JSON string
    logedUser = JSON.parse(logedUser);

    var t = document.getElementById('logedID');
    t.innerHTML += `${logedUser.usuario}`;

    leer();
    escuchar();
    readComments();
}

window.onload = init;