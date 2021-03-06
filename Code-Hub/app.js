var express = require('express');
var app = express.createServer();
var backend = require('./modules/backend');

var port;

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/static'));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
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
    backend.clearModel(function(err){
      console.log('Test model cleared. Exiting.');
      process.exit();
    });
  });
  port = 4000;
});

// NODE_ENV=production node app.js
// NODE_ENV=production forever start -l forever.log -o out.log -e err.log app.js
app.configure('production',function(){
  app.use(express.errorHandler());
  port = 80;
});

var initialContent = "";/* "@app name Increment Test\n"+
            "@app template minimalHTML\n"+
            "var inc = require('increment');\n"+
            "var a = 1;\n"+
            "console.log(inc(a)); // will output 2";*/

app.get('/', function(req, res){
  res.redirect('/docs');
});

app.get('/edit', function(req, res){
  res.render('edit',{
    revision: {
      content: initialContent,
      scriptId: -1
    },
    mode:'javascript'
  });
});

app.get('/edit/:scriptId.:revNum', function(req, res){
  backend.getRevision(req.params.scriptId, req.params.revNum, function(err, revision){
    if(err)
      res.render('error',{ error:err });
    else
      res.render('edit',{
        revision: revision,
        mode:revision.type == 'template'? 'htmlmixed':'javascript'
      });
  });
});

app.get('/run/:scriptId.:revNum',function(req, res){
  backend.compileApp(req.params.scriptId, req.params.revNum, function(err, compiledApp){
    if(err)
      res.render('error',{error:err });
    else{
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(compiledApp);
    }
  });
});

app.get('/edit/:scriptName', function(req, res){
  backend.getLatestRevisionByName(req.params.scriptName, function(err, revision){
    if(err)
      res.render('error',{error:err});
    else
      res.redirect('/edit/'+revision.scriptId+'.'+revision.revNum);
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
  var content = req.body.revision.content;
  var parentRevision = req.body.revision.parentRevision;
  
  createScriptIfNecessary(req.params.scriptId, function(err, scriptId){
    backend.createRevision(scriptId, content, parentRevision, function(err, revNum){
      if(err)
        res.render('error',{error:err});
      else
        res.redirect('/edit/'+scriptId+'.'+revNum);
    });
  });
});

app.get('/scripts', function(req, res){
  backend.listScripts(function(err, scripts){
    if(err)
      res.render('error',{error:err});
    else
      res.render('scripts',{scripts:scripts});
      // res.render('scripts',{
        // modules:modules,
        // templates:templates,
        // apps:apps
      // });
  });
});

app.get('/docs', function(req, res){
  res.render('docs');
});

app.listen(port);
