define(function () {var THIS_UNIT = function(){
	this.prop("group", "actors");	

	this.prop("primary.vig", 10);
	this.prop("primary.end", 10);
	this.prop("primary.str", 10);
	this.prop("primary.vit", 10);
	
	this.prop("gear.head", {name:"unarmored", def:600, poise:25, weight:5});
	this.prop("gear.torso", {name:"unarmored", def:600, poise:25, weight:5});
	this.prop("gear.arms", {name:"unarmored", def:600, poise:25, weight:5});
	this.prop("gear.legs", {name:"unarmored", def:600, poise:25, weight:5});
	this.prop("gear.weapon", {name:"basic_sword", atk:50, bns:5, cost:10, force:100, weight:5});

	var animation_frame = {file:['shitty_wizard.png', 'shitty_wizard.png'], width:400, height:400, colliderWidth:80, colliderHeight:120, frames:1, fps:12};

	animation_frame.file = ['knight/attack.png', 'knight/attack-reverse.png']; animation_frame.frames = 5;
	this.prop("animation.list.attack", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['knight/counter.png', 'knight/counter-reverse.png']; animation_frame.frames = 6;
	this.prop("animation.list.counter", JSON.parse(JSON.stringify(animation_frame)));
	
	animation_frame.file = ['knight/flinch.png', 'knight/flinch-reverse.png']; animation_frame.frames = 2;
	this.prop("animation.list.flinch", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['knight/cast.png', 'knight/cast-reverse.png']; animation_frame.frames = 1;
	this.prop("animation.list.cast", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['knight/guard.png', 'knight/guard-reverse.png']; animation_frame.frames = 2;
	this.prop("animation.list.guard", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['knight/resist.png', 'knight/resist-reverse.png']; animation_frame.frames = 2;
	this.prop("animation.list.resist", JSON.parse(JSON.stringify(animation_frame)));
	
	animation_frame.file = ['knight/stand.png', 'knight/stand-reverse.png']; animation_frame.frames = 2;
	this.prop("animation.list.stand", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['knight/walk.png', 'knight/walk-reverse.png']; animation_frame.frames = 6;
	this.prop("animation.list.walk", JSON.parse(JSON.stringify(animation_frame)));
};

THIS_UNIT.prototype.birth = function(){this.setAnimation("stand")};


return THIS_UNIT});

