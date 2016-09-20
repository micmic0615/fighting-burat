define(function () {var THIS_UNIT = function(){
	this.prop("group", "ui");	

	this.prop("buff", {});	

	var animation_frame = {file:['shitty_wizard.png', 'shitty_wizard.png'], width:120, height:120, colliderWidth:120, colliderHeight:120, frames:1, fps:1};


	animation_frame.file = ['buff_icons/_empty.png', 'buff_icons/_empty.png'];
	this.prop("animation.list._empty", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['buff_icons/agility.png', 'buff_icons/agility.png']; 
	this.prop("animation.list.agility", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['buff_icons/armorbreak.png', 'buff_icons/armorbreak.png']; 
	this.prop("animation.list.armorbreak", JSON.parse(JSON.stringify(animation_frame)));
	
	animation_frame.file = ['buff_icons/bash.png', 'buff_icons/bash.png']; 
	this.prop("animation.list.bash", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['buff_icons/bleed.png', 'buff_icons/bleed.png']; 
	this.prop("animation.list.bleed", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['buff_icons/damage.png', 'buff_icons/damage.png']; 
	this.prop("animation.list.damage", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['buff_icons/defense.png', 'buff_icons/defense.png']; 
	this.prop("animation.list.defense", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['buff_icons/deflect.png', 'buff_icons/deflect.png']; 
	this.prop("animation.list.deflect", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['buff_icons/encumber.png', 'buff_icons/encumber.png']; 
	this.prop("animation.list.encumber", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['buff_icons/focusbreak.png', 'buff_icons/focusbreak.png']; 
	this.prop("animation.list.focusbreak", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['buff_icons/force.png', 'buff_icons/force.png']; 
	this.prop("animation.list.force", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['buff_icons/lifesteal.png', 'buff_icons/lifesteal.png']; 
	this.prop("animation.list.lifesteal", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['buff_icons/poison.png', 'buff_icons/poison.png']; 
	this.prop("animation.list.poison", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['buff_icons/thorns.png', 'buff_icons/thorns.png']; 
	this.prop("animation.list.thorns", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['buff_icons/curse.png', 'buff_icons/curse.png']; 
	this.prop("animation.list.curse", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['buff_icons/acid.png', 'buff_icons/acid.png']; 
	this.prop("animation.list.acid", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['buff_icons/peacemaker.png', 'buff_icons/peacemaker.png']; 
	this.prop("animation.list.peacemaker", JSON.parse(JSON.stringify(animation_frame)));




	animation_frame.file = ['buff_icons/vanguard.png', 'buff_icons/vanguard.png']; 
	this.prop("animation.list.vanguard", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['buff_icons/transmute.png', 'buff_icons/transmute.png']; 
	this.prop("animation.list.transmute", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['buff_icons/heal.png', 'buff_icons/heal.png']; 
	this.prop("animation.list.heal", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['buff_icons/regen.png', 'buff_icons/regen.png']; 
	this.prop("animation.list.regen", JSON.parse(JSON.stringify(animation_frame)));
	
	animation_frame.file = ['buff_icons/focus.png', 'buff_icons/focus.png']; 
	this.prop("animation.list.focus", JSON.parse(JSON.stringify(animation_frame)));

	

	animation_frame.file = ['buff_icons/super_slash.png', 'buff_icons/super_slash.png']; 
	this.prop("animation.list.super_slash", JSON.parse(JSON.stringify(animation_frame)));
};

THIS_UNIT.prototype.birth = function(){this.setAnimation("_empty")};


return THIS_UNIT});

