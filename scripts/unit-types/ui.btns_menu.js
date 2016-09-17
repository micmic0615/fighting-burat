define(function () {var THIS_UNIT = function(){
	this.prop("group", "ui");	

	var animation_frame = {file:['shitty_wizard.png', 'shitty_wizard.png'], width:160, height:40, colliderWidth:160, colliderHeight:40, frames:1, fps:1};

	animation_frame.file = ['btns_menu/add_selected.png', 'btns_menu/add_selected.png']; 
	this.prop("animation.list.add_selected", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['btns_menu/view_details.png', 'btns_menu/view_details.png'];
	this.prop("animation.list.view_details", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['btns_menu/start_game.png', 'btns_menu/start_game.png'];
	this.prop("animation.list.start_game", JSON.parse(JSON.stringify(animation_frame)));


};

THIS_UNIT.prototype.birth = function(){this.setAnimation("add_selected")};


return THIS_UNIT});

