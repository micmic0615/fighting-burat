define(function () {var THIS_UNIT = function(){

	this.prop("group", "doodads");	
	this.prop("unit", null);
	this.prop("life", 0);


	var animation_frame = {file:['shitty_wizard.png', 'shitty_wizard.png'], width:400, height:400, colliderWidth:0, colliderHeight:0, frames:1, fps:12};
	this.prop("animation.list._empty", JSON.parse(JSON.stringify(animation_frame)));

	var buff_keys = Object.keys(BUFFS);

	for (var i = 0; i < buff_keys.length; ++i) {
		var p = BUFFS[buff_keys[i]].sfx;
		
		for (var i2 = 0; i2 < p.length; ++i2) {
			var p2 = p[i2];
			if (this.animation.list[p2] == undefined){
				animation_frame.file = ['buff_sfx/' + p2.sprite + '.png', 'buff_sfx/' + p2.sprite + '.png']; 
				animation_frame.frames = p2.frames;
				this.prop("animation.list." + p2.sprite, JSON.parse(JSON.stringify(animation_frame)));
			}
		}
	}
};

THIS_UNIT.prototype.birth = function(){
	
};

THIS_UNIT.prototype.always = function(){
	if (this.unit != null && this.life > 0){
		this.life--;
		this.locX = MMG.stage.getUnit(this.unit).locX;
		this.locY = MMG.stage.getUnit(this.unit).locY;
	} else {
		this.locX = -500;
		this.locY = -500;
	}	
};


return THIS_UNIT});

