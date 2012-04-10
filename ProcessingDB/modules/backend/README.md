# The ProcessingDB Persistence Module

This module provides an API to an on-disk model consisting of instances of the following classes:

 - Script
   - scriptId:String
   - latestRevisionNumber:Number

 - Revision
   - scriptId:String
   - revNum:Number
   - content:String
   - commitMessage:String
   - commitDate: Date
   - parentRevision:Revision pointer
   - type:String in ['app','module','template']
   - name:String (if type == 'module' or 'template')
   - dependencies:List of Revision pointer (if type == 'module' or 'app')
   - template:Revision pointer (if type == 'app')

A "Revision pointer" is a (scriptId, revNum) pair.

The on-disk model is implemented using a combination of MongoDB and Git. Most of the model 
is stored in a MongoDB database. The content is tracked using a set of Git repositories (one
repository per scriptId, and one commit and tag for each revNum).
