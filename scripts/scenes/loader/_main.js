define(function () {return function(SCENE){
	var reload_in = 10;
	SCENE.newLayer({zIndex:0, alias:'background', bgColor:'#000'});

	SCENE.always(function (){if (reload_in > 0){reload_in--} else {MMG.loadScene("gameplay")}});
	return SCENE;
}})


