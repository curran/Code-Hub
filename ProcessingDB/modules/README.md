# The ProcessingDB Persistence Module

This module provides an API to an on-disk model consisting of instances of the following classes:

 - Script
   - scriptId:String
   - latestRevisionNumber:Number

 - Revision
   - scriptId:String
   - revisionNumber:Number
   - content:String
   - type:String in ['app','module','template']
   - name:String - only relevant when type == 'module'
   - dependencies:List of Revisions - only relevant when type == 'module' or 'app'
   - template:Revision - only relevant when type == 'app'

The on-disk model is implemented using a combination of MongoDB and Git.

The following parts of the model are persisted in a MongoDB database:
 - Script
   - scriptId:String
   - latestRevisionNumber:Number

 - Revision
   - scriptId:String
   - revisionNumber:Number
   - type:String in ['app','module','template']
   - name:String
   - dependencies:List<Revision>
   - template:Revision

The following parts of the model are persisted in a set of Git repositories in the file system:
 - Script
   - scriptId:String This is the name of the directory containing the Git repository.

 - Revision
   - scriptId:String
   - revisionNumber:Number
   - content:String