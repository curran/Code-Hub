express = require 'express'
app = express.createServer()

app.configure () ->
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use express.static(__dirname + '/static')

# NODE_ENV=development node app.js
app.configure 'development', () ->
  app.use express.errorHandler
    dumpExceptions: true,
    showStack: true

# NODE_ENV=production node app.js
app.configure 'production', () ->
  app.use express.errorHandler()

app.set 'views', __dirname + '/views'
app.set 'view engine', 'jade'

app.get '/', (req, res) -> res.render 'root'

app.listen 4000
