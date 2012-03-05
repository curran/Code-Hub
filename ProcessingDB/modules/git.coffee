spawn = require('child_process').spawn
fs = require 'fs'
path = require 'path'

prefix = '.'
repoDirName = 'repos'
repoDir = () -> prefix + '/' + repoDirName
dirFromName = (name) -> repoDir() + '/' + name
executeCommands = (dir, queue, callback) ->                  
  (iterate = () ->
    if queue.length == 0                                   
      callback()
    else
      task = queue.splice(0,1)[0]                            
      command = task[0]                                      
      args = task[1...task.length]
      child = spawn command, args, {cwd:dir}                 
      child.on 'exit', iterate                               
  )()

ensureRepoDirExists = (callback) ->
  path.exists repoDir(), (exists) ->
    if exists 
      callback()
    else
      fs.mkdir repoDir(), 755, callback

createRepo = (name,callback) ->
  ensureRepoDirectoryExists (err) ->
    if err
      callback err
    else
      dir = dirFromName name
      fs.mkdir dir, 755, (err) ->
        if err
          callback err
        else 
          executeCommands dir,[
            ['git', 'init'],
            ['touch', CONTENT_FILE_NAME],
            ['git', 'add','*'],
            ['git', 'commit','-m','Initial Creation']
          ], callback
