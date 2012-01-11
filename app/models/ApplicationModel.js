module.exports = require('./BaseModel').extend(function(){
	this.mongo = require('mongoose');
	this.Schema = this.mongoose.Schema;
	switch(app.settings.env){
		case 'development':
			this.mongoose.connect('mongodb://localhost/deathlypings_development');
		break;
		case 'production':
			this.mongoose.connect('mongodb://localhost/deathlypings_production');
		break;
	}
});
