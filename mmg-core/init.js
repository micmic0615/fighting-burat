function INIT(){	
	if (MMG.not_init){
		require([
			"mmg-core/objects/scenes.js",
			"mmg-core/objects/units.js",
			"mmg-core/objects/layers.js",
			"mmg-core/behaviors/system/quadtree.js",
			"mmg-core/behaviors/system/debug.js"
		], function () {
			require(["mmg-core/defaults/scenes/defaultScene.js"], function (data) {
				MMG.scenes["defaultScene"] = data;
				for (var i = 0; i < CONF.scenes.used.length; ++i) { DECLARE_SCENE(CONF.scenes.used[i]) };

				for (var i = 0; i < CONF.scenes.behaviors.length; ++i) { DECLARE_BEHAVIOR_SCENE(CONF.scenes.behaviors[i]) };
			});

			require([
				"mmg-core/defaults/unit-groups/actors.js",
			], function (actors) {
				require([
					"mmg-core/defaults/unit-groups/doodads.js",
				], function (doodads) {
					require([
						"mmg-core/defaults/unit-groups/tiles.js",
					], function (tiles) {
						require([
							"mmg-core/defaults/unit-groups/ui.js",
						], function (ui) {
							MMG.uGroups["actors"] = actors;
							MMG.uGroups["doodads"] = doodads;
							MMG.uGroups["tiles"] = tiles;
							MMG.uGroups["ui"] = ui;
							for (var i = 0; i < CONF.units.groups.length; ++i) { DECLARE_UNIT_GROUP(CONF.units.groups[i]) };

							require(["mmg-core/defaults/unit-types/shittyWizard.js"], function (data) {
								MMG.uTypes["shittyWizard"] = data;
								for (var i = 0; i < CONF.units.types.length; ++i) { DECLARE_UNIT_TYPE(CONF.units.types[i]) };

								for (var i = 0; i < CONF.units.behaviors.length; ++i) { DECLARE_BEHAVIOR_UNIT(CONF.units.behaviors[i]) };
							});
						});
					});
				});
			});
		});
	}

	MMG.not_init = false

	function DECLARE_BEHAVIOR_SCENE(p){require([PATHS.BEHAVIOR_SCENE + p + ".js"], function() {
		if (CONF.scenes.loaded == undefined){CONF.scenes.loaded = 0};
		CONF.scenes.loaded++;
	})};

	function DECLARE_BEHAVIOR_UNIT(p){require([PATHS.BEHAVIOR_UNIT + p + ".js"], function() {
		if (CONF.units.loaded == undefined){CONF.units.loaded = 0};
		CONF.units.loaded++;
	})};


	function DECLARE_SCENE(p){require([PATHS.SCENE + p + "/_main.js"], function(data) {
		if (CONF.scenes.loaded == undefined){CONF.scenes.loaded = 0};
		MMG.scenes[p] = data;
		CONF.scenes.loaded++;
	})};

	function DECLARE_UNIT_GROUP(p){require([PATHS.UNIT_GROUP+ p + ".js"], function(data) {
		if (CONF.units.loaded == undefined){CONF.units.loaded = 0};
		MMG.uGroups[p] = data; 
		CONF.units.loaded++;
	})};

	function DECLARE_UNIT_TYPE(p){require([PATHS.UNIT_TYPE + p + ".js"], function(data) {
		if (CONF.units.loaded == undefined){CONF.units.loaded = 0};
		MMG.uTypes[p.split(".")[p.split(".").length-1]] = data; 
		CONF.units.loaded++;
	})};

	function INIT_TRY(){
		var checker = [];
		checker.push(Boolean(CONF.scenes.loaded == CONF.scenes.used.length + CONF.scenes.behaviors.length));
		checker.push(Boolean(CONF.units.loaded == CONF.units.behaviors.length + CONF.units.groups.length + CONF.units.types.length));

		var proceed = true;
		var checker_stat = 0;
		for (var i = 0; i < checker.length; ++i) {if (checker[i] == false){proceed = false} else {checker_stat++}};

		if (proceed){
			if (CONF.scenes.first != undefined){var firstScene = CONF.scenes.first} else {var firstScene = "defaultScene"};
			MMG.render();
			MMG.loadScene(firstScene);
		} else {
			setTimeout(INIT,500)
		}
	};
	
	INIT_TRY();
};

window.onload = function(){
	MMG.not_init = true;
	INIT();

	try{
		Cocoon.App.WebView.on("load", {
			success : function(){
				console.log("Android Build!")
			},
			error : function(){
				alert("Webview Load error!")
			}
		});
	} catch(err){
		console.log("Desktop Build")
	}
}