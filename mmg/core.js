var GLOBALS = {};
var BUFFS = {};
var SOCKET = null;
var USER = null;
var RAN = new mmj_random_seed();

MMG.uGroups = {};
MMG.uTypes = {};

MMG.iterator = {
	cps:0,
	fps:0
};

MMG.calculations = [];
MMG.pendingScripts = [];

MMG.nextScene = {
	name:null,
	func:null
};

MMG.createCanvas = function(alias, insertBefore){
	var cssText =  "width:"+window.innerWidth+"; height:"+ window.innerHeight + "; position:absolute; top:0px; left:0px";
	var cssText =  "width:100%; height:100%; position:absolute; top:0px; left:0px";

	var canvas = document.createElement('canvas');
	canvas.id = alias;
	canvas.style.cssText  = cssText;
	canvas.width = MMG.resolution.width;
	canvas.height = MMG.resolution.height;
	if (alias == "clicker"){canvas.getContext("2d"); canvas.setAttribute("tabIndex", "1")};
	if (insertBefore == undefined){document.body.appendChild(canvas)} else {document.body.insertBefore(canvas, insertBefore)};
	return canvas
}

MMG.loadScene = function(name){
	MMG.stage = undefined
	MMG.nextScene.name = name;
	MMG.nextScene.func = function () {
		if (MMG.scenes[name] != undefined){
			if (SOCKET != null){
				var socket_keys = Object.keys(SOCKET._callbacks);
				var reserved_listeners = ["connecting", "connect", "error", "connect_error", "connect_timeout", "disconnect"]
				for (var i = 0; i < socket_keys.length; ++i) {
					var p = socket_keys[i].split("$").join("");
					var is_reserved = false;
					for (var i2 = 0; i2 < reserved_listeners.length; ++i2) {
						var p2 = reserved_listeners[i2];
						if (p == p2){is_reserved = true}
					}

					if (!is_reserved){SOCKET.off(p)}
				}
			}

			document.body.innerHTML = "";

			MMG.iterator.cps = 0;
			MMG.iterator.fps = 0;
			MMG.calculations = [];
			MMG.pendingScripts = [];

			MMG.stage = MMG.scenes[name](new SCENE(PATHS.SCENE + name));

			MMG.stage.sprites = {};

			MMG.canvas = new MMG.createCanvas("draw");
			MMG.ctx = MMG.canvas.getContext("2d");

			DEBUG.canvas = new MMG.createCanvas("debugger");

			MMG.clickListener = new MMG.createCanvas("clicker");
			
			MMG.clickListener.addEventListener("click", function (e) {
				var pointX = (MMG.resolution.width / window.innerWidth) * e.clientX
				var pointY = (MMG.resolution.height / window.innerHeight) * e.clientY			
				
				for (var i = MMG.stage.units.length - 1; i >= 0; --i) {
					var p = MMG.stage.units[i];
					if (p.clickable) {
						if (pointX >= p.screen.left && pointX <= p.screen.right) {
							if (pointY >= p.screen.top && pointY <= p.screen.bottom) {
								p.clicked();
								break;
							}
						}
					}
				}	

				for (var i =  MMG.stage.drawings.length - 1; i >= 0; --i) {
					var p = MMG.stage.drawings[i];
					if (p.type == "rect" && p.clicked != undefined) {

						var sizeX = Math.round(MMG.scale(p.width));
						var sizeY = Math.round(MMG.scale(p.height));

						var posX = Math.round(MMG.scale(p.x));
						var posY = Math.round(MMG.scale(p.y));

						if (pointX >= p.screen.left && pointX <= p.screen.right) {
							if (pointY >= p.screen.top && pointY <= p.screen.bottom) {
								p.clicked();
								break;
							}
						}
					}
				}	
			});
	
			MMG.clickListener.focus();
			MMG.clickListener.addEventListener('keydown',function(e){if (KEYS.on){
				if (e.keyCode == 16){KEYS.shift = true};
				if (e.keyCode == 32){KEYS.text += " "};
				if (e.keyCode >= 48 && e.keyCode <= 57){ KEYS.text += KEYS.map[e.keyCode]};
				if (e.keyCode >= 65 && e.keyCode <= 90){ if (KEYS.shift){KEYS.text += KEYS.map[e.keyCode].toUpperCase()} else {KEYS.text += KEYS.map[e.keyCode].toLowerCase()}};
				
				if (e.keyCode == 8){KEYS.text = KEYS.text.substring(0, KEYS.text.length - 1)};
				
				KEYS.press(KEYS.map[e.keyCode]);				
			}},false);

			MMG.clickListener.addEventListener('keyup',function(e){if (KEYS.on){
				if (e.keyCode == 16){KEYS.shift = false};
			}},false);

			return true
		} else {
			return false
		}
	}
};

MMG.render = function(){
	if (MMG.stage != undefined){
		MMG.iterator.cps += MMG.cps/60;
		if (MMG.iterator.cps >= 1){if (MMG.stage != undefined){while(MMG.iterator.cps > 1){MMG.iterator.cps -= 1; if (MMG.collisions){MMG.collide()};  MMG.calculate()}}};

		MMG.iterator.fps += MMG.fps/60;
		if (MMG.iterator.fps >= 1){if (MMG.stage != undefined){while(MMG.iterator.fps > 1){MMG.iterator.fps -= 1;
			MMG.ctx.clearRect(0,0,MMG.canvas.width,MMG.canvas.height);

			MMG.stage.layers.sort(keysrt("zIndex"));
			MMG.stage.drawings.sort(keysrt("zIndex"));

			for (var i = 0; i < MMG.stage.layers.length; i++) {
				MMG.stage.layers[i].units.sort(keysrt("zIndex"));
				var p = MMG.stage.layers[i];

				if (p.bgColor != undefined){
					MMG.ctx.fillStyle = p.bgColor;
					MMG.ctx.fillRect(0,0,MMG.canvas.width,MMG.canvas.height);
				};

				
				for (var i2 = 0; i2 < MMG.stage.layers[i].units.length; i2++) {
					var p2 = MMG.stage.layers[i].units[i2];
					
					if (p2.scaleX*p2.scaleY > 0){var item_number = 0} else {var item_number = 1}
					
					var spriteName = p2.animation.list[p2.animation.sprite].file[item_number];
					if (MMG.stage.sprites[spriteName] == undefined){
						var img = new Image();
						img.src = 'images/' + p2.animation.list[p2.animation.sprite].file[item_number];				
						MMG.stage.sprites[spriteName] = img;
					};

					MMG.ctx.globalAlpha = p2.opacity;

					if (!p2.freeSize){
						var sizeX = Math.round(MMG.scale(p2.width*Math.abs(p2.scaleX)));
						var sizeY = Math.round(MMG.scale(p2.height*Math.abs(p2.scaleY)));
						var originX = sizeX*0.5;
						var originY = sizeY*0.5;

						var hitX = Math.round(MMG.scale(p2.collision.size[0]*Math.abs(p2.scaleX)));
						var hitY = Math.round(MMG.scale(p2.collision.size[1]*Math.abs(p2.scaleY)));	
						var hitOriginX = hitX*0.5;
						var hitOriginY =  hitY*0.5;					
					} else {
						var sizeX = Math.round(MMG.scale(p2.width));
						var sizeY = Math.round(MMG.scale(p2.height));
						var originX = 0;
						var originY = 0;	

						var hitX = Math.round(MMG.scale(p2.width));
						var hitY = Math.round(MMG.scale(p2.height));	
						var hitOriginX = 0;
						var hitOriginY = 0;				
					}

					if (!p2.anchored){
						var posX = Math.round(MMG.scale(p2.locX - (MMG.stage.camera.locX - MMG.stage.camera.refX)) - originX);
						var posY = Math.round(MMG.scale(p2.locY - (MMG.stage.camera.locY - MMG.stage.camera.refY)) - originY);

						var hitPosX = Math.round(MMG.scale(p2.locX - (MMG.stage.camera.locX - MMG.stage.camera.refX)) - hitOriginX);
						var hitPosY = Math.round(MMG.scale(p2.locY - (MMG.stage.camera.locY - MMG.stage.camera.refY)) - hitOriginY);	
					} else {
						var posX = Math.round(MMG.scale( p2.locX - originX));
						var posY = Math.round(MMG.scale( p2.locY - originY));

						var hitPosX = Math.round(MMG.scale(p2.locX - hitOriginX));
						var hitPosY = Math.round(MMG.scale(p2.locY - hitOriginY));	
					}

					var clipX = p2.animation.list[p2.animation.sprite].width;
					var clipY = p2.animation.list[p2.animation.sprite].height;	

					MMG.ctx.drawImage(MMG.stage.sprites[spriteName], (p2.animation.frameCurrent*p2.width), 0, clipX, clipY, posX, posY, sizeX, sizeY);
					
					MMG.ctx.globalAlpha = 1;

					p2.screen.left = hitPosX;
					p2.screen.right = hitPosX + hitX;
					p2.screen.top = hitPosY;
					p2.screen.bottom = hitPosY + hitY;

					if (p2.group != "ui" || p2.anchored || p2.freeSize){DEBUG_HITBOX(hitX, hitY, hitPosX, hitPosY, MMG.ctx)}

					if (p2.animation.frameCount > 1){
						p2.animation.iterator += (p2.animation.fps/p2.animation.speed)/MMG.fps;
						if (p2.animation.iterator >= 1){while(p2.animation.iterator > 1){p2.animation.iterator -= 1; p2.setAnimationFrame(p2.animation.frameCurrent + 1)}};
					};				
				};
			};

			for (var i = 0; i < MMG.stage.drawings.length; ++i) {var p = MMG.stage.drawings[i]; if (p.type != null && p.life > 0){
				switch (p.type){
					case "flyingText": 
						p.life--;
						MMG.ctx.font = p.fontSize + "px " + p.fontFamily;
						MMG.ctx.fillStyle = p.color;					
						MMG.ctx.globalAlpha = p.life/p.life_max;

						var life_ratio = Math.pow(p.life/p.life_max,3);
						var radian_angle = p.angle*Math.PI/180;
						
						p.x += Math.cos(radian_angle)*(life_ratio)*8;
						p.y += Math.sin(radian_angle)*(life_ratio)*8;
						p.y += 1.5;

						var posX = Math.round(MMG.scale(p.x - MMG.ctx.measureText(p.text).width*0.5));
						var posY =  Math.round(MMG.scale(p.y));

						MMG.ctx.fillText(p.text, posX, posY);
						MMG.ctx.globalAlpha = 1;
						break;

					case "floatingText":
						MMG.ctx.font = p.fontSize + "px " + p.fontFamily;
						MMG.ctx.fillStyle = p.color;	
						if (isNaN(p.opacity)){MMG.ctx.globalAlpha = 1} else {MMG.ctx.globalAlpha = p.opacity;};

						var posX = Math.round(MMG.scale(p.x));
						var posY = Math.round(MMG.scale(p.y));

						var textWidth = MMG.ctx.measureText(p.text).width;

						switch(p.textAlign){
							case "left": var textX = posX; break;
							case "right": var textX = posX - textWidth; break;
							case "center": var textX = posX - textWidth/2; break;
						}

						MMG.ctx.fillText(p.text, textX, posY);
						MMG.ctx.globalAlpha = 1;
						break;

					case "rect":
						var sizeX = Math.round(MMG.scale(p.width));
						var sizeY = Math.round(MMG.scale(p.height));

						var posX = Math.round(MMG.scale(p.x));
						var posY = Math.round(MMG.scale(p.y));

						p.screen.left = posX;
						p.screen.right = posX + sizeX;
						p.screen.top = posY;
						p.screen.bottom = posY + sizeY;

						if (isNaN(p.opacity)){MMG.ctx.globalAlpha = 1} else {MMG.ctx.globalAlpha = p.opacity};
						
						MMG.ctx.fillStyle = p.backgroundColor;
						MMG.ctx.beginPath();
						MMG.ctx.fillRect(posX,posY,sizeX,sizeY);
						MMG.ctx.closePath();
						MMG.ctx.globalAlpha = 1;

						if (p.text != ""){
							MMG.ctx.font = p.fontSize + "px " + p.fontFamily;
							
							var textHeight = Math.round(MMG.scale(p.fontSize));
							var textWidth = MMG.ctx.measureText(p.text).width;
							var textY = posY + sizeY/2 + textHeight/4;

							switch(p.textAlign){
								case "left": var textX = posX; break;
								case "right": var textX = posX + sizeX - textWidth; break;
								case "center": var textX = posX + sizeX/2 - textWidth/2; break;
							}


							MMG.ctx.fillStyle = p.color;
							MMG.ctx.fillText(p.text, textX, textY);
							
						}
						break
				}


			} else {MMG.stage.drawings.splice(i,1); i--}}

			DEBUG_TEXT_WRITE();	
		}}};
	} else {
		if (MMG.nextScene.name != null && MMG.nextScene.func != null){
			var run_check = MMG.nextScene.func(MMG.nextScene); 
			if (run_check){
				MMG.nextScene.func = null;
				MMG.nextScene.name = null;
			};
		};
	};

	requestAnimationFrame(MMG.render)
};

MMG.collide = function(){
	var units = [];

	for (var i = 0; i < MMG.stage.units.length; i++) {
		var unit  = MMG.stage.units[i];
		if (unit.group == 'actors' || unit.group == 'tiles'){
			unit.index = i;				

			var x1 = unit.locX - unit.collision.size[0]*0.5*Math.abs(unit.scaleX);
			var y1 = unit.locY - unit.collision.size[1]*0.5*Math.abs(unit.scaleY);
			var x2 = unit.locX + unit.collision.size[0]*0.5*Math.abs(unit.scaleX);
			var y2 = unit.locY + unit.collision.size[1]*0.5*Math.abs(unit.scaleY);

			units.push({
				index:i,
				_id:unit._id,
				x1:x1,
				x2:x2,
				y1:y1,
				y2:y2
			})
		};
	};

	QUADTREE({
		x:0,
		y:0,
		width:MMG.stage.world.width,
		height:MMG.stage.world.height
	}, units, 0)
};

MMG.calculate = function(){
	for (var i = 0; i < MMG.calculations.length; i++) {
		MMG.calculations[i].func();
	};

	if (MMG.pendingScripts.length > 0){
		for (var i = 0; i < MMG.pendingScripts.length; ++i) {
			var p = MMG.pendingScripts[i];
			var runGo = true;
			if (p.dependencies != undefined){
				for (var i2 = 0; i2 < p.dependencies.length; ++i2) {
					var p2 = p.dependencies[i2];
					if (MMG.stage._LOADED[p2] != true){runGo = false}
				}
			}	

			if (runGo){
				if(MMG.stage._LOADED[p.name] == false){
					MMG.stage._LOADED[p.name] = true; 
					p.func();
					MMG.pendingScripts.splice(i,1); i--;
				}
			}
		}
	};
};

MMG.getImageSize = function(p2, sprite, img){
	addEvent(img, 'load', function(){
		p2.animation.list[sprite].naturalWidth =  img.naturalWidth;
		p2.animation.list[sprite].naturalHeight =  img.naturalHeight;
	});
};

MMG.scale = function(int){
	return Math.round(int*MMG.resolution.scale);
};