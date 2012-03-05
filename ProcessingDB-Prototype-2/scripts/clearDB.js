var scripts = require('../modules/db');
scripts.clearDB(function(){
  scripts.disconnect();
  console.log("Database cleared.");
});


