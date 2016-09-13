Object.prototype.prop = function(key, value){
	var keys = key.split('.');
	var that = this;
	recurse(that, keys[0], 0);

	function recurse(obj, key, index){
		if (index < keys.length - 1){
			index ++;
			if (obj[key] === undefined){obj[key] = {}};
			recurse(obj[key], keys[index], index);
		} else {
			obj[key] = value;
		}
	}
}