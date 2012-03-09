express = require 'express'
app = express.createServer()
coffeeDir = __dirname + '/coffee'
publicDir = __dirname + '/public'
app.configure () -> 
  app.use express.compiler(src: coffeeDir, dest: publicDir, enable: ['coffeescript'])
  app.use express.static publicDir
  app.use express.errorHandler
    dumpExceptions: true
    showStack: true
app.listen 4000
