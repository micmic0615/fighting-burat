define(function () {var THIS_UNIT = function(){
	this.prop("group", "actors");	

	this.prop("primary.vig", 30);
	this.prop("primary.end", 10);
	this.prop("primary.str", 10);
	this.prop("primary.vit", 10);
	
	this.prop("gear.head", {name:"unarmored", def:1000, poise:25, weight:6});
	this.prop("gear.torso", {name:"unarmored", def:1000, poise:25, weight:6});
	this.prop("gear.arms", {name:"unarmored", def:1000, poise:25, weight:6});
	this.prop("gear.legs", {name:"unarmored", def:1000, poise:25, weight:6});
	this.prop("gear.weapon", {name:"basic_sword", atk:50, bns:5, cost:10, force:120, weight:5});

	var animation_frame = {file:['shitty_wizard.png', 'shitty_wizard.png'], width:330, height:230, colliderWidth:80, colliderHeight:120, frames:1, fps:12};

	animation_frame.file = ['knight2/attack.png', 'knight2/attack-reverse.png']; animation_frame.frames = 6;
	this.prop("animation.list.attack", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['knight2/counter.png', 'knight2/counter-reverse.png']; animation_frame.frames = 10;
	this.prop("animation.list.counter", JSON.parse(JSON.stringify(animation_frame)));
	
	animation_frame.file = ['knight2/flinch.png', 'knight2/flinch-reverse.png']; animation_frame.frames = 7;
	this.prop("animation.list.flinch", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['knight2/cast.png', 'knight2/cast-reverse.png']; animation_frame.frames = 10;
	this.prop("animation.list.cast", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['knight2/guard.png', 'knight2/guard-reverse.png']; animation_frame.frames = 8;
	this.prop("animation.list.guard", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['knight2/resist.png', 'knight2/resist-reverse.png']; animation_frame.frames = 7;
	this.prop("animation.list.resist", JSON.parse(JSON.stringify(animation_frame)));
	
	animation_frame.file = ['knight2/stand.png', 'knight2/stand-reverse.png']; animation_frame.frames = 10;
	this.prop("animation.list.stand", JSON.parse(JSON.stringify(animation_frame)));

	animation_frame.file = ['knight2/walk.png', 'knight2/walk-reverse.png']; animation_frame.frames = 10;
	this.prop("animation.list.walk", JSON.parse(JSON.stringify(animation_frame)));
};

THIS_UNIT.prototype.birth = function(){this.setAnimation("stand")};


return THIS_UNIT});

