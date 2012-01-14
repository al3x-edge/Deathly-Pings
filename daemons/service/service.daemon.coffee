daemon = require 'daemon'
fs = require 'fs'
client = require("redis").createClient();
	
# Setup initial daemon directories if needed
# Log if it was unable to create the directory.
fs.mkdir __dirname + '/logs', (err) -> 
  console.log err

# Globals
after = (ms, cb) -> setTimeout cb, ms
every = (ms, cb) -> setInterval cb, ms

class ServiceDaemon
  teams = []
  services = []
  constructor: (@pollTime) ->
  run: () ->
    every @pollTime, () ->
	    console.log 'Running'
  
class Service
  constructor: (@name,@port,@team_number) ->
  report: (success) ->
    if success
      client.hincrby "team#{@team_number}::#{@name}", "success", 1
    else
      client.hincrby "team#{@team_number}::#{@name}", "failure", 1

class Team
  constructor: (@name, @number) ->
  score: ->
    console.log "Scoring"
  findAllServices: ->
    services = client.smembers();
    
sd = new ServiceDaemon
sd.run()
	
daemon.daemonize __dirname+'/logs/service.daemon.log', '/tmp/yourprogram.pid', (err, pid) ->
  if err then console.log 'Error starting daemon: ' + err
  console.log 'Daemon started successfully with pid: ' + pid