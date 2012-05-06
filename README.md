# ProcessingDB
ProcessingDB is 

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

To run the ProcessingDB server:
 1. Get the source code from GitHub using Git:
   - `git clone git://github.com/curran/ProcessingDB.git`
 2. Start the MongoDB daemon (`mongod`)
 3. Run the server with the following commands:
   - `cd ProcessingDB/ProcessingDB`
   - `node app.js`
     - This runs ProcessingDB in development mode, which sets up an example model on startup and tears it down on shutdown.
     - The default post is 80, so if you run into permissions errors use `sudo node app.js`
   - `NODE_ENV=production node app.js`
     - This runs ProcessingDB in production mode, which uses the existing database and Git repository contents or creates an empty model.
   - For production use, use of [Forever](https://github.com/nodejitsu/forever/), a command line tool which automatically restarts Node applications if they crash, is recommeded. After installing Forever, ProcessingDB can be run with the following command:
     - `NODE_ENV=production forever start -l forever.log -o out.log -e err.log app.js`
 4. ProcessingDB should now be running at `http://localhost:8000/`
