if (DEBUG == undefined){var DEBUG = {}};
if (DEBUG.text == undefined){DEBUG.text == false};
if (DEBUG.hitbox == undefined){DEBUG.hitbox == false};

DEBUG.canvas = null;
DEBUG.fps = {
	prev:Date.now(),
	current:Date.now(),
	averages:[],
	freeze:0,
	iterator:0
}

function DEBUG_TEXT_WRITE(){
	if (DEBUG.text){
		DEBUG.fps.prev = DEBUG.fps.current
		DEBUG.fps.current = Date.now();
		DEBUG.fps.iterator ++;
		DEBUG.fps.averages.push((DEBUG.fps.current - DEBUG.fps.prev)/1000);
		if (DEBUG.fps.averages.length > 15){DEBUG.fps.averages.splice(0,1)};
		if (DEBUG.fps.iterator == 15){
			DEBUG.fps.iterator = 0
			var delta = 0
			for (var i = 0; i < DEBUG.fps.averages.length; i++) {delta += DEBUG.fps.averages[i]};
			delta = delta / DEBUG.fps.averages.length;
		
			var ctx = DEBUG.canvas.getContext("2d");
			ctx.clearRect(0,0,DEBUG.canvas.width,DEBUG.canvas.height);

			var FPS = Math.round(100/delta)/100;

			ctx.font = "12px Arial";
			ctx.fillStyle = "#900";
			ctx.fillRect(0,0,90,40)
			ctx.fillStyle = "#cff";
			ctx.fillText('FPS: ' + FPS,10,15);
			ctx.fillText('Units: ' + MMG.stage.units.length,10,30);

		

			if (FPS < 0){DEBUG.fps.freeze++}
			if (DEBUG.fps.freeze == 10){DEBUG.text = false}
			
			
		};
	};
}

function DEBUG_HITBOX(hitX, hitY, hitPosX, hitPosY, ctx){
	if (DEBUG.hitbox){		
		ctx.beginPath();
		ctx.rect(hitPosX,hitPosY,hitX,hitY);
		ctx.stroke();
		ctx.closePath();
	}
}