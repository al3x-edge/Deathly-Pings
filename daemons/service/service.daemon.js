var daemon = require('daemon');
var fs = require('fs');
var cronJob = require('cron').CronJob;
var client = require('redis').createClient();
var klass = require('klass');
	
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

var ServiceDaemon = klass(function (pollTime){
  this.pollTime = pollTime;
  this.teams = [];
  this.services = [];
})
  .methods({
    run: function(){
      every(this.pollTime, function(){
        console.log('Running');
      });
    }
  });
  
  
var Service = klass(function (name, port, team_number){
  this.name = name;
  this.port = port;
  this.team_number = team_number;
})
  .methods({
    report: function(success){
      if(success) client.hincrby("team#{@team_number}::#{@name}", "success", 1);
      else client.hincrby("team#{@team_number}::#{@name}", "failure", 1);
    }
  });
  
  
var Team = klass(function (name, number){
  this.name = name;
  this.number = number;
})
  .methods({
    score: function(){
      console.log('Scoring');
    },
    findAllServices: function(){
      console.log('Finding services')
    }
  });
    
var sd = new ServiceDaemon(1000);
sd.run()
	
daemon.daemonize(__dirname+'/logs/service.daemon.log', '/tmp/yourprogram.pid', function(err, pid){
  if(err) console.log('Error starting daemon: ' + err);
  else console.log('Daemon started successfully with pid: ' + pid);
});