daemon = require 'daemon'
fs = require 'fs'
	
# Setup initial daemon directories if needed
fs.mkdir __dirname + '/logs'

# Globals
after = (ms, cb) -> setTimeout cb, ms
every = (ms, cb) -> setInterval cb, ms

class ServiceDaemon
  services = []
  teams = []
  
  constructor: () ->
  run: () ->
    every 1000, () ->
	    console.log 'Hello World'
  
class Service
  constructor: (@name,@port) ->

class Team
  constructor: (@name, @number) ->
  score: ->
    console.log "Scoring"
  findAllEntries: ->
    console.log "Looking in Redis for all entries"
    
sd = new ServiceDaemon
sd.run()
	
daemon.daemonize __dirname+'/logs/service.daemon.log', '/tmp/yourprogram.pid', (err, pid) ->
  if err then console.log 'Error starting daemon: ' + err
  console.log 'Daemon started successfully with pid: ' + pid