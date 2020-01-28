var Datastore = require("nedb");
var db = {};
db.missions = new Datastore({ filename: './db/missions.json', autoload: true });
db.assignments = new Datastore({ filename: './db/assignments.json', autoload: true });

var Mission = require("../models/mission");

var DB = function(args){
  this.clearStores = function(next){
    db.missions.remove({}, {multi : true}, function(err,res){
      db.assignments.remove({}, {multi : true}, next);
    });
  };
  
  this.getMissionByLaunchDate = function(launchDate,next){
    db.missions.find({launchDate : launchDate}, function(err,missions){
      var mission = missions.length > 0 ? new Mission(missions[0]) : null;
      next(null,mission);
    });
  };

  this.createNextMission = function(args,next){
    var newMission = new Mission();
    db.missions.insert(newMission, next);
  };

  this.saveAssignment = function(args, next){
    db.assignments.insert(args, next);
  };
};

module.exports = DB;

