# ProcessingDB
ProcessingDB is a software development tool for JavaScript and HTML which provides:

 - a browser-based code editor which allows you to save and run your code
 - the ability to save and publish of all versions of your code
 - support for dependency management and deployment

## Using ProcessingDB
ProcessingDB is live at [processingdb.org](http://www.processingdb.org/docs). On that page you will find documentation for the concepts in ProcessingDB, and instructions on how to use it.

## Running ProcessingDB
ProcessingDB is designed to work in Unix environments and depends on having the following installed:
 - The [Git](http://git-scm.com/download) command line tool (the ProcessingDB server spawns Git child processes).
 - [MongoDB](http://www.mongodb.org/display/DOCS/Quickstart)
 - [Node.js](https://github.com/joyent/node/wiki/Installation)
 - [NPM - Node Package Manager](http://npmjs.org/)
 - The following Node.js packages from NPM:
   - express
   - jade
   - mongoose
   - marked
   - async
   - underscore
   - These are package names which can be installed with the command `npm install packageName` where `packageName` is the name in this list.
   - Note: we'd like to make ProcessingDB into a Node package, which would enable NPM to automatically install dependencies. Unfortunately these currently need to be installed manually.

To run the ProcessingDB server:
 1. Get the source code from GitHub using Git:
   - `git clone git://github.com/curran/ProcessingDB.git`
 2. Start the MongoDB daemon (`mongod`)
 3. Optionally you can run the unit tests with the following commands:
   - `cd tests`
   - `sh ./[testAll.sh](https://github.com/curran/ProcessingDB/blob/master/ProcessingDB/tests/testAll.sh)`
 4. Run the server with the following commands:
   - `cd ProcessingDB/ProcessingDB`
   - `node app.js`
     - This runs ProcessingDB in development mode, which sets up an example model on startup and tears it down on shutdown.
     - The default post is 80, so if you run into permissions errors use `sudo node app.js`
   - `NODE_ENV=production node app.js`
     - This runs ProcessingDB in production mode, which uses the existing database and Git repository contents or creates an empty model.
   - For production use, use of [Forever](https://github.com/nodejitsu/forever/), a command line tool which automatically restarts Node applications if they crash, is recommeded. After installing Forever, ProcessingDB can be run with the following command:
     - `NODE_ENV=production forever start -l forever.log -o out.log -e err.log app.js`
 4. ProcessingDB should now be running at `http://localhost:8000/`

## Using ProcessingDB
ProcessingDB has two views, the editor view and the script List
 - [New Script](http://processingdb.org/edit) - This page is a blank slate for creating new scripts (this is the editor view for a new script). To create a new script, write code in this page for either a module, template or app using the appropriate ProcessingDB directives and hit "Save". This will save the script and redirect you to the editor page for the newly created script.
 - In the Editor view for any saved script, when you click "Save", a new revision for that script will be created and you will be redirected to the edit page for that new revision (notice the last part of the URL change).
 - In the editor view for saved apps or modules, links are provided to dependencies in the lower left
   - For example, if the module `foo` contains the code `require('bar')`, then in the editor view for `foo`, there will be a link to the editor view of the latest version of the module `bar`.
 - In the editor view for saved apps, a "run" link is provided in the lower right, and a link to the template is provided in the lower left (after links to module dependencies).

The "run" link can be used to embed applications in iFrames. Here is an example:
`<iframe src="http://processingdb.org/run/8.9" width="690" height="100" scrolling="no"></iframe>` 
This code is running in [this page](http://curransoft.com/interactivegraphics/).
 - [List Scripts](http://processingdb.org/scripts) - This page lists all scripts and links to the editor view for their latest revisions. For named scripts (modules and templates), the name is used for the link text, but for unnamed scripts (apps), the link text is formed by the script id and revision number in the form `scriptId`.`revNum`. In the future, we hope to be able to identify apps by name as well.
