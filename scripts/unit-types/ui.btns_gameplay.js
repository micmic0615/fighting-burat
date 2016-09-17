define(function () {var THIS_UNIT = function(){
	this.prop("group", "ui");	

	var animation_frame = {file:['shitty_wizard.png', 'shitty_wizard.png'], width:120, height:120, colliderWidth:120, colliderHeight:120, frames:1, fps:1};

	animation_frame.file = ['btns_gameplay/shuffle.png', 'btns_gameplay/shuffle.png']; 
	this.prop("animation.list.shuffle", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['btns_gameplay/menu.png', 'btns_gameplay/menu.png']; 
	this.prop("animation.list.menu", JSON.parse(JSON.stringify(animation_frame)));
};

THIS_UNIT.prototype.birth = function(){this.setAnimation("shuffle")};


return THIS_UNIT});

