var moment = require("moment");
var MissionControl = require("../models/mission_control");
var Mission = require("../models/mission");
var assert = require("assert");
var Helpers = require("./helpers");
var sinon = require("sinon");
var DB = require("../db");

describe("Mission Planning", function () {
  var missionControl, db;
  before(function(){
    missionControl = new MissionControl({db : new DB()});
  });

  describe("No Current Mission", function () {
    var currentMission;
    before(function(done){
      missionControl.currentMission(function(err,res){
        currentMission = res;
        done();
      });
    });
    it("it is created if none exist", function () {
      assert(currentMission);
      //assert(db.getMissionByLaunchDate.called);
    });
  });
  describe("Current Mission Exists", function () {
    var currentMission;
    before(function(done){
      //db.getMissionByLaunchDate.restore();
      //sinon.stub(db, "getMissionByLaunchDate").yields(null,{id : 1000});
      missionControl.currentMission(function(err,res){
        currentMission = res;
        done();
      });
    });
  });
});