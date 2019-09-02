
var db;
const COL_USERS = "usuarios";
var usuarios;

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
		|| !getValue('correoID') 
		|| !getValue('contraID'))
		return 0 ;
	else
		return 1 ;
}

function usuarioDisponible(){
	
	var i = 0 ;
	var disponible = 1;
	
	while(i < usuarios.length){
		if( (usuarios[i].usuario === getValue('usuarioID')) || (usuarios[i].correo === getValue('correoID')))
			disponible = 0;
		i++;
	}

	return disponible;
}

function guardar(){
	if(validar()){
		var usuario = new Usuario(getValue('usuarioID'), getValue('correoID'), 
									getValue('contraID'));

		var item = Object.assign({}, usuario);
		db.collection(COL_USERS).add(item).then(
		data => {
			alert('Registrado!!!');
			window.open('login.html');
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

function listenAll(){
	db.collection(COL_USERS).onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            if (change.type === "added") {
                //console.log("New city: ", change.doc.data());
                usuarios.push(change.doc.data());
            }
            if (change.type === "modified") {
                console.log("Modified city: ", change.doc.data());
            }
            if (change.type === "removed") {
                console.log("Removed city: ", change.doc.data());
            }
        });
    });
}

function init(){

	usuarios = [];

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

    listenAll();
}

window.onload = init;