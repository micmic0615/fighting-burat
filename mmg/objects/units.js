MMG.units = {};

function UNIT(type){
	this.prop("locX", 0);
	this.prop("locY", 0);
	this.prop("zIndex", 0);

	this.prop("scaleX", 1);
	this.prop("scaleY", 1);

	this.prop("state.moveable", true)
	this.prop("state.ghost", false);

	this.prop("opacity", 1);

	this.prop("collision.active", true);
	this.prop("collision.offsetX", 0);
	this.prop("collision.offsetY", 0);
	this.prop("collision.size", [80,80]);

	this.prop("collision.with", []);

	this.prop("clickable", false);
	this.prop("anchored", false);
	this.prop("freeSize", false);

	this.prop("animation.speed", 1);
	this.prop("animation.origin", "center");
	this.prop("animation.loop", true);

	this.prop("screen.left", 0);
	this.prop("screen.right", 0);
	this.prop("screen.top", 0);
	this.prop("screen.bottom", 0);

	this.prop("onDie", []);
	this.prop("onKill", []);
	this.prop("onBirth", []);
	this.prop("onClick", []);

	this.prop("animation.list.default", {file:['shitty_wizard.png', 'shitty_wizard.png'],width:80,height:120,colliderWidth:80,colliderHeight:120,frames:1,fps:1});

	this.setType(type || "shittyUnit");
};

UNIT.prototype.collideCheck = function(array){
	this.collision.with = [];

	var x1 = this.locX - this.collision.size[0]*0.5*Math.abs(this.scaleX);
	var y1 = this.locY - this.collision.size[1]*0.5*Math.abs(this.scaleY);
	var x2 = this.locX + this.collision.size[0]*0.5*Math.abs(this.scaleX);
	var y2 = this.locY + this.collision.size[1]*0.5*Math.abs(this.scaleY);

	for (var i = 0; i < array.length; i++) {
		var p = array[i];
		if (p._id != this._id){
			if (x1 < p.x2 && x2 > p.x1 && y1 < p.y2 && y2 > p.y1) {
				this.collision.with.push(p.index)
			};
		};
	};
}

UNIT.prototype.moveTo = function(x,y){
	if (this.state.moveable){
		this.locX = x;
		this.locY = y;
		this.collision.active = true;
	}
}

UNIT.prototype.moveBy = function(x,y){
	if (this.state.moveable){
		this.locX += x;
		this.locY += y;
		this.collision.active = true;
	}
}

UNIT.prototype.always = function(func, alias){
	MMG.calculations.push({ref:{type:"unit",id:this._id},func:func,alias:alias});
}

UNIT.prototype.remove = function(){
	for (var i = 0; i < MMG.calculations.length; i++) {
		var p = MMG.calculations[i];
		if (p.ref.type == "unit" && p.ref.id == this._id){MMG.calculations.splice(i,1); i--};
	};

	for (var i = 0; i < MMG.stage.layers.length; i++) {
		var p = MMG.stage.layers[i];

		for (var i2 = 0; i2 < p.units.length; i2++) {
			var p2 = p.units[i2];
			if (p2._id == this._id){p.units.splice(i2,1); i2--};
		};
	};

	for (var i = 0; i < MMG.stage.units.length; i++) {
		var p = MMG.stage.units[i];
		if (p._id == this._id){MMG.stage.units.splice(i,1); i--};
	};
}

UNIT.prototype.birth = function(){};


UNIT.prototype.clicked = function(){
	for (var i = 0; i < this.onClick.length; ++i) {this.onClick[i]()}
};


UNIT.prototype.kill = function(target){
	for (var i = 0; i < this.onKill.length; ++i) {this.onKill[i](target)}
	target.die(this);
}

UNIT.prototype.die = function(killer){
	for (var i = 0; i < this.onDie.length; ++i) {this.onDie[i](killer)}
	this.remove();
}

UNIT.prototype.setType = function(type){
	this.prop("type", type);

	var typeObj = new MMG.uTypes[type]();
	var groupObj = new MMG.uGroups[typeObj.group]();

	var groupKeys = Object.keys(groupObj);
	for (var i = 0; i < groupKeys.length; i++) {recursiveSet(groupObj, groupKeys[i], this)};

	var typeKeys = Object.keys(typeObj);
	for (var i = 0; i < typeKeys.length; i++) {recursiveSet(typeObj, typeKeys[i], this)};

	var groupProto = Object.keys(groupObj.__proto__);
	for (var i = 0; i < groupProto.length; i++) {
		var p = groupProto[i];
		if (this.__proto__[p] == undefined){
			this.__proto__[p] = groupObj.__proto__[p]
		} else {
			switch(p){
				case "always": this.always(groupObj.__proto__[p].bind(this)); break;
				case "die": this.onDie.push(groupObj.__proto__[p].bind(this)); break;
				case "kill": this.onKill.push(groupObj.__proto__[p].bind(this)); break;
				case "birth": this.onBirth.push(groupObj.__proto__[p].bind(this)); break;
				case "clicked": this.onClick.push(groupObj.__proto__[p].bind(this)); break;
			}
		}
	};

	var typeProto = Object.keys(typeObj.__proto__);
	for (var i = 0; i < typeProto.length; i++) {
		var p = typeProto[i];
		if (this.__proto__[p] == undefined){
			this.__proto__[p] = typeObj.__proto__[p]
		} else {
			switch(p){
				case "always": this.always(typeObj.__proto__[p].bind(this)); break;
				case "die": this.onDie.push(typeObj.__proto__[p].bind(this)); break;
				case "kill": this.onKill.push(typeObj.__proto__[p].bind(this)); break;
				case "birth": this.onBirth.push(typeObj.__proto__[p].bind(this)); break;
				case "clicked": this.onClick.push(typeObj.__proto__[p].bind(this)); break;
			}
		}
	};

	this.setAnimation();
	for (var i = 0; i < this.onBirth.length; ++i) {this.onBirth[i]()};
	
	function recursiveSet(obj, key, parent){
		if(obj[key] !== undefined && obj[key] !== null && typeof obj[key] == "object"  && !(obj[key].constructor === Array )){if (parent[key] == undefined){parent[key] = {}}; var keys = Object.keys(obj[key]); for (var i = 0; i < keys.length; i++) {recursiveSet(obj[key], keys[i], parent[key])}} else {parent[key] = obj[key]}};
};

UNIT.prototype.setAnimation = function(alias){
	var proceed = false;
	var noError = true;

	if (this.animation.sprite == undefined){
		proceed = true;
		if (alias == undefined){alias = "default"};
	} else {
		if (alias != undefined && this.animation.sprite != alias){
			var keys = Object.keys(this.animation.list);
			noError = false;
			for (var i = 0; i < keys.length; ++i) {if (alias == keys[i]){proceed = true; noError = true; break}}
		}
	}
	
	if (proceed){
		this.prop("animation.frameCurrent", 0);
		this.prop("animation.iterator", 0);
		
		this.prop("animation.sprite", alias);
		this.prop("animation.frameCount", this.animation.list[alias].frames);
		this.prop("animation.fps", this.animation.list[alias].fps);

		if (!this.freeSize){
			this.prop("width", this.animation.list[alias].width);
			this.prop("height", this.animation.list[alias].height);
			this.prop("collision.size", [this.animation.list[alias].colliderWidth,this.animation.list[alias].colliderHeight]);
		}
	} else {
		if (!noError){
			console.log("ERROR: no such animation - " + alias)
		}
	}
}

UNIT.prototype.setAnimationFrame = function(frame){
	if (frame < (this.animation.frameCount) && frame > 0){this.prop("animation.frameCurrent", frame)} else {if(this.animation.loop){this.prop("animation.frameCurrent", 0)}};	
}