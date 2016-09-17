define(function () {var THIS_UNIT = function(){
	this.prop("group", "ui");	

	var animation_frame = {file:['shitty_wizard.png', 'shitty_wizard.png'], width:60, height:60, colliderWidth:60, colliderHeight:60, frames:1, fps:1};

	animation_frame.file = ['turn_icons/p1_shield.png', 'turn_icons/p1_shield.png']; 
	this.prop("animation.list.p1_shield", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['turn_icons/p2_shield.png', 'turn_icons/p2_shield.png']; 
	this.prop("animation.list.p2_shield", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['turn_icons/p1_sword.png', 'turn_icons/p1_sword.png']; 
	this.prop("animation.list.p1_sword", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['turn_icons/p2_sword.png', 'turn_icons/p2_sword.png']; 
	this.prop("animation.list.p2_sword", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['turn_icons/blank.png', 'turn_icons/blank.png']; 
	this.prop("animation.list.blank", JSON.parse(JSON.stringify(animation_frame)));
};


THIS_UNIT.prototype.birth = function(){this.setAnimation("blank")};



return THIS_UNIT});

