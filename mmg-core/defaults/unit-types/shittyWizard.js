define(function () {return function(){
	this.prop("group", "actors");

	this.prop("animation.origin", "center");
	this.prop("animation.loop", true);

	this.prop("animation.list.default", {
		file:'default.png',
		width:80,
		height:80,
		frames:8,
		fps:24
	});
}})