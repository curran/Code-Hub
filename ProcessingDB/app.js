var express = require('express');
var app = express.createServer();
var backend = require('./modules/backend/backend');

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/static'));
});

// NODE_ENV=development node app.js
app.configure('development',function(){
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

// NODE_ENV=production node app.js
app.configure('production',function(){
  app.use(express.errorHandler());
});

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

var testContent =  "@app name Increment Test\n"+
            "@app template minimalHTML\n"+
            "var inc = require('increment');\n"+
            "var a = 1;\n"+
            "console.log(inc(a)); // will output 2";

app.get('/', function(req, res){
  res.render('root',{locals:{
    revision: {
      content: testContent,
      scriptId: -1
    }
  }});
});

// If scriptId is -1, make a new script
function createScriptIfNecessary(scriptId, callback){
  if(scriptId == -1)
    backend.createScript(callback);
  else
    callback(null,scriptId);
}

app.put('/:scriptId', function(req, res){
  createScriptIfNecessary(req.params.scriptId, function(err, scriptId){
    //TODO create a new revision
    
    console.log('content = '+req.body.revision.content);
    testContent = req.body.revision.content;
    res.redirect('/');//+scriptId+'.'+revNum);
  });
});

app.listen(4000);
