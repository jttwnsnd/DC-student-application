# Developer Readme

##To begin...
There are a few things to remember if you are working on this in a dev environment.
* Create a creds.json
  * This is what is used for sending the app to the users and has connection info to Mongo. You must have this for testing, so create one with the following fields:
    * email
    * password
    * dbusername
    * dbpassword
  * have a dev/ttest server in mongo for this. and connect to that one with the info in creds.json
* Line 611 in backend/index.js
  * This uses ES6, and though some browsers support it, the localhost may not. for testing, comment it out and use line 610.
* app.js
  * the var API on line 9 must be commented out and instead use the one on line 4.
* have npm serve installed on your machine.
  * if you do, run ```serve frontend``` on the frontend folder.

#Dev Log
* Nov 21, 2016
  * removed code challenge from application.
