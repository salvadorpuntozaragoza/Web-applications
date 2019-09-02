var Methods = {
	GET: 'get',
	POST: 'post',
	PUT: 'put',
	PATCH: 'patch',
	DEL: 'delete'
};

function AJAX(metodo, url, data, onSucces, onError, convertir){
	var req = new XMLHttpRequest();
	req.onload= function(){
		console.log('lib: AJAX Method');
		console.log(req);
		if(req.status < 400){
			//todo bn
			var res = req.response;
			if(convertir) res = JSON.parse(res);
			onSucces(res, req.status);
		}
		else{
			//algo salio mal
			onError(req.response, req.status);
		}
	}

	

	req.open(metodo,url);
	req.setRequestHeader("Content-type", "application/json;charset=UTF-8");	
	if(!data){
		req.send();
	}else{
		req.send(data);
	}
}