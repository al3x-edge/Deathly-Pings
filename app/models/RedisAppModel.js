module.exports = require('./BaseModel').extend(function(){
	this.redis = require("redis");
    this.client = this.redis.createClient();

	this.client.on("error", function (err) {
	    console.log("Error " + err);
	});
});