function QUADTREE (bounds, units, level){
	level++

	var halfWidth = bounds.width/2;
	var halfHeight = bounds.height/2;

	var quads = [
		{	
			x1:bounds.x,
		 	y1:bounds.y,
		 	x2:bounds.x + halfWidth,
		 	y2:bounds.y + halfHeight
		},
		{
			x1:bounds.x + halfWidth, 
			y1:bounds.y,
			x2:bounds.x + bounds.width,
			y2:bounds.y + halfHeight
		},
		{
			x1:bounds.x, 
			y1:bounds.y + halfHeight,
			x2:bounds.x + halfWidth,
			y2:bounds.y + bounds.height
		},
		{
			x1:bounds.x + halfWidth, 
			y1:bounds.y + halfHeight,
			x2:bounds.x + bounds.width,
			y2:bounds.y + bounds.height
		}
	]

	for (var i = 0; i < quads.length; i++) {
		var quad = quads[i];
		quad.units = [];

		for (var i2 = 0; i2 < units.length; i2++) {
			var unit = units[i2];

			if (quad.x1 < unit.x2 && quad.x2 > unit.x1 && quad.y1 < unit.y2 && quad.y2 > unit.y1) {
				quad.units.push(unit);
			};
		};	
		
		if (quad.units.length > 50 && level < 5){
			quadTree({
				x:quad.x1,
				y:quad.y1,
				width:halfWidth,
				height:halfHeight
			}, quad.units, level)
		} else {
			for (var i2 = 0; i2 < quad.units.length; i2++) {
				var unit = MMG.stage.units[quad.units[i2].index];
				unit.collideCheck(quad.units);
			}
		}	
	}
}