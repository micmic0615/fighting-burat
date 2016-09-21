define(function () {var THIS_UNIT = function(){
	this.prop("group", "ui");	

	var animation_frame = {file:['shitty_wizard.png', 'shitty_wizard.png'], width:120, height:120, colliderWidth:120, colliderHeight:120, frames:1, fps:1};

	animation_frame.file = ['buff_icons/_empty.png', 'buff_icons/_empty.png'];
	this.prop("animation.list._empty", JSON.parse(JSON.stringify(animation_frame)));

	var buff_keys = Object.keys(BUFFS);

	for (var i = 0; i < buff_keys.length; ++i) {
		var p = buff_keys[i];
		animation_frame.file = ['buff_icons/' + p + '.png', 'buff_icons/' + p + '.png']; 
		this.prop("animation.list." + p, JSON.parse(JSON.stringify(animation_frame)));
	}
};

THIS_UNIT.prototype.birth = function(){this.setAnimation("_empty")};


return THIS_UNIT});

