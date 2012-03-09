ProcessingDB is a Web application supporting mass-collaborative development of Web based interactive graphics applications.

ProcessingDB stores versioned scripts with dependency information. Users can create and edit these scripts. Some scripts are libraries, and some are applications. Libraries can be depended upon by other scripts, and applications can be run.

Modules

A script which is meant to be used by other scripts is called a module. A script can depend on a module by using the notation `@depends on < script name > < version >`.

Applications

A script which is meant to be run is called an application. When an application is run, its dependencies are evaluated and concatenated together to produce the full script content, which is then embedded into an HTML page template. The application specifies which template to use with the notation `@embed in < script name > < version >`. 

Templates

The HTML templates which applications can be embedded into are also stored as scripts. In these scripts, a single occurance of `${code}` will be replaced by the full script content when the template is used for running an application.
