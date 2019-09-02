
var db;
const COL_USERS = "usuarios";
var usuarios = [];

function Usuario(usuario, correo, contra){
	this.id = 0;
	this.usuario = usuario;
	this.contra = contra;
	this.correo = correo;
}

function getValue(string){
	return (document.getElementById(string).value);
}

function validar(){
	if(!getValue('usuarioID') 
		|| !getValue('contraID'))
		return 0 ;
	else
		return 1 ;
}

function iniciarSesion(){
	if(validar()){
		var i = 0;
		var item;
		while( (i < usuarios.length)){
			if(( (getValue('usuarioID') === usuarios[i].usuario) 
				|| (getValue('usuarioID') === usuarios[i].correo)) 
				&& (getValue('contraID') === usuarios[i].contra)){
				item = usuarios[i];
				logedUser = item;
				//converts to JSON string the Object
			   account = JSON.stringify(logedUser);
			   //creates a base-64 encoded ASCII string
			   account = btoa(account);
			   //save the encoded accout to web storage
			   localStorage.setItem('_account', account);
				window.open('index.html');
				window.close();
			}
			
			i++; 
		}

		if(!item){
			console.log('userNotFound');
			alert('Usuario no encontrado')
		}
	}else {
		alert('Llena todos los campos');
	}
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
					console.log("Este cambio", item);
					usuarios.push(item);
				}
			});
		},
		error => {
			console.error("Error al escuchar", error);
		}
	);
}

function openWindow(){
	window.open('register.html');
}

function init(){
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

    console.log('Page reloaded');

    leer();
}

window.onload = init;
