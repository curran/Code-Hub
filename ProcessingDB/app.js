var express = require('express');
var app = express.createServer();
var model = require('./modules/model');

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
  require('./tests/testData').loadExampleModel();
  process.on('SIGINT', function () {
    console.log('Got SIGINT. Clearing test model...');
    model.clear(function(err){
      console.log('Test model cleared. Exiting.');
      process.exit();
    });
  });
});

// NODE_ENV=production node app.js
app.configure('production',function(){
  app.use(express.errorHandler());
});

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

var initialContent = "";/* "@app name Increment Test\n"+
            "@app template minimalHTML\n"+
            "var inc = require('increment');\n"+
            "var a = 1;\n"+
            "console.log(inc(a)); // will output 2";*/

app.get('/', function(req, res){
  res.redirect('/edit/');
});

app.get('/edit/', function(req, res){
  res.render('edit',{locals:{
    revision: {
      content: initialContent,
      scriptId: -1
    }
  }});
});

app.get('/edit/:scriptId.:revNum', function(req, res){
  model.getRevision(req.params.scriptId, req.params.revNum, function(err, revision){
    if(err)
      res.render('error',{locals:{ error:err }});
    else
      res.render('edit',{locals:{
        revision: revision,
        mode:revision.type == 'template'? 'htmlmixed':'javascript'
      }});
  });
});

app.get('/edit/:scriptName', function(req, res){
  model.getLatestRevisionByName(req.params.scriptName, function(err, revision){
    console.log("here "+'edit/'+revision.scriptId+'.'+revision.revNum);
    if(err)
      res.render('error',{locals:{error:err}});
    else
      res.redirect('/edit/'+revision.scriptId+'.'+revision.revNum);
  });
});

// If scriptId is -1, make a new script
function createScriptIfNecessary(scriptId, callback){
  if(scriptId == -1)
    model.createScript(callback);
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
    
    model.createRevision(scriptId, revision, function(err, revNum){
      if(err)
        throw err; //TODO handle errors properly
      res.redirect('/edit/'+scriptId+'.'+revNum);
    });
  });
});

app.listen(4000);
