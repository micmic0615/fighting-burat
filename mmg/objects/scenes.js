MMG.scenes = {};

function SCENE(_DIR){
	this.prop("_DIR", _DIR);
	this.prop("_LOADED", {});

	this.prop("layers", []);
	this.prop("units", []);
	this.prop("images", {});
	this.prop("schema.layer_id", 0);
	this.prop("schema.unit_id", 0);

	this.prop("world.width", this.getScreen().width);
	this.prop("world.height", this.getScreen().height);

	// this.prop("draw.floatingText", []);
	// this.prop("draw.flyingText", []);
	// this.prop("draw.rect", []);
	// this.prop("draw.textInput", []);

	this.prop("draw_layer", []);

	this.prop("camera.locX", this.getScreen().width/2);
	this.prop("camera.locY", this.getScreen().height/2);
	this.prop("camera.refX", this.getScreen().width/2);
	this.prop("camera.refY", this.getScreen().height/2);
}

SCENE.prototype.always = function(func, alias){
	MMG.calculations.push({ref:{type:"scene",id:0},func:func,alias:alias});
}

SCENE.prototype.click = function(e){
	
}

SCENE.prototype.subscript = function(name, dependencies){
	var that = this;
	that._LOADED[name] = false;

	require([this._DIR + "/" + name + ".js"], function(func){
		var binder = func.bind(that); 
		var obj = {
			func:  binder,
			name: name,
			dependencies: dependencies
		}

		MMG.pendingScripts.push(obj)
	});
}

SCENE.prototype.newLayer = function(prm){
	var newLayer = new LAYER();
	var prmKeys = Object.keys(prm)
	for (var i = 0; i < prmKeys.length; i++) {var p = prmKeys[i]; newLayer[p] = prm[p]};

	newLayer["_id"] = this.schema.layer_id;
	this.schema.layer_id ++;

	this.layers.push(newLayer);
}

SCENE.prototype.getLayer = function(alias){
	for (var i = 0; i < this.layers.length; i++) {var p = this.layers[i]; if (p.alias == alias){return p}};
}

SCENE.prototype.newUnit = function(layer, type, prm){
	if (this.layers.length > 0){
		var newUnit = new UNIT(type);

		var prmKeys = Object.keys(prm);
		for (var i = 0; i < prmKeys.length; i++) {var p = prmKeys[i]; newUnit[p] = prm[p]};

		newUnit["_id"] = this.schema.unit_id;
		this.schema.unit_id ++;

		if (layer != undefined){var parentLayer = this.getLayer(layer)} else {var parentLayer = this.layers[0]};
		parentLayer.units.push(newUnit);
		this.units.push(newUnit);

		return newUnit;
	} else {
		console.log('Error: Unable to create units in a scene without layers.');
	};
}

SCENE.prototype.getUnit = function(alias){
	for (var i = 0; i < this.units.length; i++) {var p = this.units[i]; if (p.alias == alias){return p}};
}


SCENE.prototype.drawObj = function(type, prop){
	var drawObj = {
		type: null,
		x: 0,
		y: 0,
		origin: "left",
		width: 100,
		height: 100,
		life: 1,
		lifeMax: 1,
		angle: 0,
		color: "#000",
		backgroundColor: "#fff",
		text: "",
		textAlign: "left",
		fontFamily: "Arial"
	};

	drawObj.type = type;

	var prop_keys = Object.keys(prop)
	for (var i = 0; i < prop_keys.length; ++i) {
		var p = prop_keys[i]; drawObj[p] = prop[p];
		if (p == "life"){drawObj["life_max"] = prop[p]}
	}

	this.draw_layer.push(drawObj);
	return drawObj;
}

SCENE.prototype.getDrawObj = function(alias){
	for (var i = 0; i < this.draw_layer.length; ++i) {
		var p = this.draw_layer[i];
		if (p.alias == alias){return p};
	}
}





// SCENE.prototype.drawFlyingText = function(){
// 	this.draw.flyingText.push({
// 		text: text,
// 		color: color,
// 		life: life,
// 		life_max: life,
// 		font: font,
// 		x: x,
// 		y: y,
// 		angle: angle,
// 		aux: aux
// 	})
// }

// SCENE.prototype.drawFloatingText = function(text, color, font, opacity, x, y, alias, aux){
// 	var newText = {
// 		life: 1,
// 		opacity: opacity,
// 		text: text,
// 		color: color,
// 		font: font,
// 		x: x,
// 		y: y,
// 		alias:  alias,
// 		aux: aux
// 	};

// 	this.draw.floatingText.push(newText);

// 	return newText;
// }

// SCENE.prototype.drawRect = function(x, y, width, height, opacity, color, alias, aux){
// 	var newRect = {
// 		life:1,
// 		x: x, 
// 		y: y, 
// 		width: width, 
// 		height: height, 
// 		opacity: opacity,
// 		color: color, 
// 		alias: alias, 
// 		aux: aux
// 	};

// 	this.draw.rect.push(newRect);

// 	return newRect;
// }

// SCENE.prototype.drawTextInput = function(text, x, y, width, height, opacity, color, alias, aux){
// 	var newInput = {
// 		life: 1,
// 		text: text,
// 		x: x, 
// 		y: y, 
// 		width: width, 
// 		height: height, 
// 		opacity: opacity,
// 		color: color, 
// 		alias: alias,
// 		aux: aux
// 	};

// 	this.draw.rect.push(newInput);

// 	return newInput;
// }

SCENE.prototype.getDrawRect = function(alias){
	for (var i = 0; i < this.draw.rect.length; ++i) {
		var p = this.draw.rect[i];
		if (p.alias == alias){return p};
	}
}



SCENE.prototype.getScreen = function(type){
	var returnObj = {
		width:MMG.resolution.width/MMG.resolution.scale,
		height:MMG.resolution.height/MMG.resolution.scale
	};
	
	return returnObj;
}