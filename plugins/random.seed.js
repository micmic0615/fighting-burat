function mmj_random_seed(){
	this.seed = [];
	this.seed_index = 0;
}

mmj_random_seed.prototype.generate = function(seed){
	this.seed = seed;
	this.seed_index = 0;
}

mmj_random_seed.prototype.get = function(){
	if (this.seed[this.seed_index] != undefined){
		var random_return = this.seed[this.seed_index];
		if (random_return >= 1){random_return = 0.999};
		if (random_return <= 0){random_return = 0.001};
		this.seed_index++;
		return random_return;
	} else {
		return Math.random();
	}
}

mmj_random_seed.prototype.set_seed = function(index){
	this.seed_index = index;
}


mmj_random_seed.prototype.clear = function(index){
	this.seed = [];
	this.seed_index = 0;
}