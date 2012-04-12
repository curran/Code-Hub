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
  res.redirect('/edit/');
});

app.get('/edit/', function(req, res){
  res.render('root',{locals:{
    revision: {
      content: testContent,
      scriptId: -1
    }
  }});
});

app.get('/edit/:scriptId.:revNum', function(req, res){
  backend.getRevision(req.params.scriptId, req.params.revNum, function(err, revision){
    res.render('root',{locals:{ revision: revision }});
  });
});

// If scriptId is -1, make a new script
function createScriptIfNecessary(scriptId, callback){
  if(scriptId == -1)
    backend.createScript(callback);
  else
    callback(null, scriptId);
}

app.put('/:scriptId', function(req, res){
  createScriptIfNecessary(req.params.scriptId, function(err, scriptId){
    
    // TODO call to parser
    var revision = {
      commitMessage: "",//TODO add this
      commitDate: new Date(),
      parentRevision: "",//TODO add this
      type: 'template',//TODO add this
      name: 'TestTemplate',//TODO add this
      content: req.body.revision.content,
      dependencies: '',//TODO add this
      template: ''//TODO add this
    };
    
    backend.createRevision(scriptId, revision, function(err, revNum){
      if(err)
        throw err; //TODO handle errors properly
      res.redirect('/edit/'+scriptId+'.'+revNum);
    });
  });
});

app.listen(4000);
