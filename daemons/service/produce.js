var daemon = require('daemon');
var fs = require('fs');
var cronJob = require('cron').CronJob;
var client = require('redis').createClient();
var klass = require('klass');
var kue = require('kue')
	, jobs = kue.createQueue();

// Setup initial daemon directories if needed
// Log if it was unable to create the directory.
try{
  fs.mkdir(__dirname + '/logs');
}catch(err){
  console.log("Logs directory already exists");
}

// Globals
after = function(ms, cb){
  setTimeout(cb,ms);
}
every = function(ms, cb){
  setInterval(cb, ms);
}
var sequence = 0;

var Scoring = klass(function (pollTime){
  this.pollTime = pollTime;
  
})
  .methods({
    run: function(){
      every(this.pollTime, function(){
        var teams = [1,2,3,4];
        var services = ['ftp','ssh','http','https'];
        
        for(x=0,xlen=teams.length;x<xlen;x++){
          for(y=0,ylen=services.length;y<ylen;y++){
            var job = jobs.create('score', {
              team:teams[x],
              service:services[y]
            }).save();
          }
        }
      });
    }
  });

var sd = new Scoring(process.argv[2]).run();
	
daemon.daemonize(__dirname+'/logs/producer.log', '/tmp/yourprogram.pid', function(err, pid){
  if(err) console.log('Error starting daemon: ' + err);
  else console.log('Daemon started successfully with pid: ' + pid);
});