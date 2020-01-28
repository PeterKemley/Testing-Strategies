var async = require("async");
var assert = require("assert");
var MissionControl = require("../models/mission_control");
var Assignment = require("../models/assignment");

var ReviewProcess = function(args){
  assert(args.application, "Need an application to review");
  assert(args.db, "Need a database instance");
  assert(args.billing, "Need a subscription processor");

  var db = args.db;
  var billing = args.billing;
  var assignment, mission, app = args.application;
  var missionControl = new MissionControl({
    db : args.db
  });

  //make sure the app is valid
  this.ensureAppValid = function(next){
    if(app.isValid()){
      next(null,true);
    }else{
      next(app.validationMessage(),null);
    }
  };

  //find the next mission
  this.findNextMission = function(next){
    //grab the current mission from mission control
    missionControl.currentMission(function(err,res){
      if(err) {
        next(err,null);
      }else {
        mission = res;
        next(null,res);
      }
    });

  };

  //make sure role selected is available
  this.roleIsAvailable = function(next){
    missionControl.hasSpaceForRole(app.role, next);
  };

  //make sure height/weight/age is right for role
  this.ensureRoleCompatible = function(next){
    assignment = new Assignment({
      passenger : app, 
      role : app.role,
      mission : mission
    });
    //TODO: find out about roles and height/weight etc
    next(null,assignment.passengerIsCompatible);
  };

  this.approveApplication = function(next){
    //send the assignment to disk
    db.saveAssignment({assignment : assignment},next);

  };

  this.startSubscription = function(next){
    //return a subscription
    billing.createSubscription({
      name : app.first + " " + app.last,
      email : app.email,
      plan : app.role,
      card : app.card
    }, next);
  };

  this.processApplication = function(next){
    async.series({
      validated : this.ensureAppValid,
      mission : this.findNextMission,
      roleAvailable: this.roleIsAvailable,
      roleCompatible: this.ensureRoleCompatible,
      subscription: this.startSubscription,
      assignment : this.approveApplication
    }, function(err,result){
      if(err){
        next(null,{
          success : false,
          message : err
        });
      }else{
        result.success = true;
        result.message = "Welcome to Mars!";
        next(null, result);
      }
    });
  };

};

module.exports = ReviewProcess;