define(function () {return function(){
	
	var scene = new SCENE();
	
	scene.newLayer({
		zIndex:0,
		alias:'main',
		bgColor:'#aff'
	})

	var shittyWizard = scene.newUnit("main", "shittyWizard", {
		alias:'shittyWizard',
		locX:scene.getScreen().width/2,
		locY:scene.getScreen().height/2
	})

	return scene;
}})


