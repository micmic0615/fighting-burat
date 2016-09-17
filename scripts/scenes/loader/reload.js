define(function () {return function(){
	var reload_in = 10;
	this.newLayer({zIndex:0, alias:'background', bgColor:'#000'});

	function reload(){
		if (reload_in > 0){reload_in--} else {MMG.loadScene("gameplay")}
	}

	this.always(reload.bind(this));
}})