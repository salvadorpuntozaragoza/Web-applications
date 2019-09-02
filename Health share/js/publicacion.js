var db;
const COL_ORG = "Organizaciones";
var id;


//Estructura basica de cada documento guardado en FireBase
function Publicacion(empresa, contacto, estado, ciudad, short, large){
	this.id = id;
	this.empresa = empresa;
	this.contacto = contacto;
	this.estado = estado;
	this.ciudad = ciudad;
	this.descripcionShort = short;
	this.descripcionLarge = large;
	id++;
}

function getValue(string){
	return (document.getElementById(string).value);
}

function isChecked(string){
	return (document.getElementById(string).checked);
}

function enviarDatos(){
	guardar();
}

//Validar que todos los campos sean llenados
function validateFields(){
	if(!getValue('nombreID')
		|| !getValue('contactoID') 
		|| !getValue('estadoID')
		|| !getValue('ciudadID') 
		|| !getValue('shortDesc') 
		|| !getValue('longDesc')
		|| !isChecked('lblCheck'))
		return 0;
	else
		return 1;
}

//Guarda la publicacion en la base de datos
function guardar(){

	if(validateFields()){
		var publicacion = new Publicacion(getValue('nombreID'), getValue('contactoID'), 
		getValue('estadoID'), getValue('ciudadID'), 
		getValue('shortDesc'), getValue('longDesc'));

		var item = Object.assign({}, publicacion);
		db.collection(COL_ORG).add(item).then(
		data => {
			alert('Guardado');
			console.log("Datos guardados exitosamente!!!", data);
			window.close();
		},
		error => {
			alert('Error');
			console.error("Ocurrio un error al guardar los datos!!!", error);
		});
	}else{
		alert('Error: llena todos los campos.');
	}


	
}

function init(){
	id = 1;
	var config = {
		apiKey: "AIzaSyD_nJuObsymuk82AkQRzitv6H7Tdao_0Wg",
	    authDomain: "health-share-a0bc6.firebaseapp.com",
	    databaseURL: "https://health-share-a0bc6.firebaseio.com",
	    projectId: "health-share-a0bc6",
	    storageBucket: "health-share-a0bc6.appspot.com",
	    messagingSenderId: "516403798393"
  	};
	
	firebase.initializeApp(config);

    db = firebase.firestore();
}

function openWindow(win){
	window.open(win);
	window.close();
}

window.onload = init;