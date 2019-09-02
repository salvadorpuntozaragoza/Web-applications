var db;

//Nombre de la coleccion en FireBase
const COL_ORG = "Organizaciones";

var container;
var documents;
var modalHeader;
var modalBody;
var modalFooter;

//Renderiza las tarjetas que aparecen en index.html
//dentro del contenedor indicado
function renderNewCard(item){

	container.innerHTML += `<div class="card cards" style="width: 18rem;">
			  <div class="card-body">
			    <h5 class="card-title">${item.empresa}</h5>
			    <p class="card-text">${item.descripcionShort}</p>
			    <button class="btn btn-dark" type="button" data-toggle="modal" data-target="#myModal" onclick = "fillModal('${item.id}')">Mas informacion</button>
			  </div>
			</div>`;
}

//Busca el elemento HTML por medio del ID
//y regresa el valor escrito en el
function getValue(string){
	return (document.getElementById(string).value);
}


//Renderiza dentro del modal localizado en index.html
//los datos de la publicacion que fue presionada por medio del
//ID del documento en la BD
function fillModal(id){
	var item;
	
	for(let i = 0 ; i < documents.length ; i++){
		if(documents[i].id == id)
			item = documents[i];
	}

	modalHeader.innerHTML = `<h5>${item.empresa}</h5>
								<h6>${item.estado}, ${item.ciudad}</h6>`;

	modalBody.innerHTML = `<article><h5>Descripcion detallada</h5>
			<p>${item.descripcionLarge}</p>
	</article>`;

	modalFooter.innerHTML = `<h6>Contacto: ${item.contacto}</h6>
							<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`;

}


//Escucha los datos que se modifican, anaden o se borran de la BD en tiempo real
//y los renderiza en la pagina principal index.html 
function escuchar(){
	db.collection(COL_ORG).onSnapshot(
		data => {
			data.docChanges().forEach(function(change){
				var action = change.type;
				if(action == "added" || action == "modified" || action == "removed"){
					var item = change.doc.data();
					var id = change.doc.id;
					item.id = id;
					console.log("Este cambio", item);
					documents.push(item);
					renderNewCard(item);
				}
			});
		},
		error => {
			console.error("Error al escuchar", error);
		}
	);
}

function openWindow(win){
	window.open(win);
}

function init(){
	//Inicializar arreglo de documentos
	documents = [];

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
    escuchar();
}

window.onload = init;