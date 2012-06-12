define(function(require , exports , module){
	var c = require('./c');

	return {
		init : function(){
			console.log('b');
			c.init();
		}
	}
});