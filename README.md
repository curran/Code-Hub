# CodeHub
Hello!

CodeHub is a software development tool for JavaScript and HTML which provides:

 - a browser-based code editor which allows you to save and run your code
 - the ability to save and publish of all versions of your code
 - support for dependency management and deployment

Prior art includes:
 - [JSBin](jsbin.com), [JSFiddle](jsfiddle.com], [CSSDesk](cssdesk.com) - These are each [Pastebin](pastebin.com)-like in-browser editors for source code which runs on the same page. These let you create scripts, publish them, and embed them, among other features. These have no notion of reusable modules or dependency management.
 - [Archon](http://enja.org/code/archon/), [Water](http://gabrielflor.it/water) - In-browser code editors for educational tutorials, no saving ability.
 - [RubyMonk](http://rubymonk.com/books/1/chapters/1-collections/lessons/2-arrays-introduction), [Eloquent JavaScript](http://eloquentjavascript.net/chapter2.html), [Codecademy](http://www.codecademy.com/tracks/javascript) - Educational material with code editing and running capability built into the pages.
 - [PlayMyCode](http://www.playmycode.com/) - A Web-based game development and deployment platform.
 - [SketchPad](http://sketchpad.cc/) - A Web-based development and deployment platform for Processing.js programs.
 - [OpenProcessing](http://www.openprocessing.org/) - A showcase of [Processing](http://processing.org/) sketches featuring in-browser code development.
 - [Cloud9 IDE](cloud9ide.com), [Akshell](http://www.akshell.com/ide/) - These project emulate the behavior of desktop IDEs, giving users a view into a private directory tree in which server-side source files reside.
 - [The NPM Registry](http://search.npmjs.org/) - The registry of packages for [Node Package Manager](http://npmjs.org/). This is a global repository of public packages for [Node.js](http://nodejs.org/). Packages can be published here by anyone, and installed by anyone once published, using the `npm` command line tool. NPM has support for dependency management.
 - [CommonJS Modules](http://wiki.commonjs.org/wiki/Modules/1.1.1) and [Asynchronous Module Definition](https://github.com/amdjs/amdjs-api/wiki/AMD) - These are two API definitions for defining JavaScript modules. CommonJS uses a synchronous call to inject dependencies, whereas AMD uses an asynchronous call. CommonJS has a concise syntax, but AMD is more flexible for browser-side code, as resources can be required asynchronously.

No project we found combines Web-based code editing with a repository of public modules and dependency management for browser-side applications. CodeHub fills this gap, allowing users to conduct the software development process entirely within a Web browser, and providing the basis for a generative technology in which an ecosystem of public modules can emerge (imagine a "Wikipedia of Algorithms" topped with a "YouTube of interactive graphics applications").

## Using CodeHub
CodeHub is live at [code-hub.org](http://www.code-hub.org/docs), running on a RackSpace cloud Ubuntu machine. On that page you will find documentation for the concepts in CodeHub.

CodeHub has two views, the editor view and the script list:
 - [New Script](http://code-hub.org/edit) - This page is a blank slate for creating new scripts (this is the editor view for a new script). To create a new script, write code in this page for either a module, template or app using the appropriate CodeHub directives and hit "Save". This will save the script and redirect you to the editor page for the newly created script.
 - In the Editor view for any saved script, when you click "Save", a new revision for that script will be created and you will be redirected to the edit page for that new revision (notice the last part of the URL change).
 - In the editor view for saved apps or modules, links are provided to dependencies in the lower left
   - For example, if the module `foo` contains the code `require('bar')`, then in the editor view for `foo`, there will be a link to the editor view of the latest version of the module `bar`.
 - In the editor view for saved apps, a "run" link is provided in the lower right, and a link to the template is provided in the lower left (after links to module dependencies).

The "run" link can be used to embed applications in iFrames. Here is an example:
`<iframe src="http://code-hub.org/run/8.9" width="690" height="100" scrolling="no"></iframe>` 

This code is running in [this page](http://curransoft.com/interactivegraphics/) to embed a wave simulation into a WordPress blog post.
 - [List Scripts](http://code-hub.org/scripts) - This page lists all scripts and links to the editor view for their latest revisions. For named scripts (modules and templates), the name is used for the link text, but for unnamed scripts (apps), the link text is formed by the script id and revision number in the form `scriptId`.`revNum`. In the future, we hope to be able to identify apps by name as well.

## Running CodeHub
CodeHub is designed to work in Unix environments and depends on having the following installed:
 - The [Git](http://git-scm.com/download) command line tool (the CodeHub server spawns Git child processes).
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
   - Note: we'd like to make CodeHub into a Node package, which would enable NPM to automatically install dependencies. Unfortunately these currently need to be installed manually.

To run the CodeHub server:
 1. Get the source code from GitHub using Git:
   - `git clone git://github.com/curran/CodeHub.git`
 2. Start the MongoDB daemon (`mongod`)
 3. Optionally you can run the unit tests with the following commands:
   - `cd tests`
   - [`sh ./testAll.sh`](https://github.com/curran/CodeHub/blob/master/CodeHub/tests/testAll.sh)
 4. Run the server with the following commands:
   - `cd CodeHub/CodeHub`
   - `node app.js`
     - This runs CodeHub in development mode, which sets up an example model on startup and tears it down on shutdown.
     - The default port is 80, so if you run into permissions errors use `sudo node app.js`
   - `NODE_ENV=production node app.js`
     - This runs CodeHub in production mode, which uses the existing database and Git repository contents or creates an empty model.
   - For production use, use of [Forever](https://github.com/nodejitsu/forever/), a command line tool which automatically restarts Node applications if they crash, is recommeded. After installing Forever, CodeHub can be run with the following command:
     - `NODE_ENV=production forever start -l forever.log -o out.log -e err.log app.js`
 4. CodeHub should now be running at `http://localhost:8000/`

## Content
Here are some apps in CodeHub right now:

 * [Bouncing Ball](http://code-hub.org/edit/24.37) ([run](http://code-hub.org/run/24.37))
 * [Heat Equation Simulation](http://code-hub.org/edit/7.7) ([run](http://code-hub.org/run/7.7))
 * [Wave Equation Simulation](http://code-hub.org/edit/7.5) ([run](http://code-hub.org/run/7.5))
 * [Bouncing balls with attractive force](http://code-hub.org/edit/25.1) ([run](http://code-hub.org/run/25.1))
 * [Balls bouncing off each other](http://code-hub.org/edit/25.12) ([run](http://code-hub.org/run/25.12))
