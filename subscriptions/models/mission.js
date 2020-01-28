var moment = require("moment");
var assert = require("assert");
var _ = require("underscore");

var Mission = function(args){
  args = args || {};
  var mission = {
    status : "open", //open, closed, canceled
    commander : args.Commander || null,
    MAVpilot : args.MAVPilot || null,
    colonists : args.colonists || [],
    tourists : args.tourists || [],
    assignments : [],
    //default to next month on the first
    launchDate : args.launchDate || (moment().add(1,"month").startOf('month')).format("MM-DD-YYYY")
  };
  mission.passengers = function(){
    return (mission.colonists.length + mission.tourists.length) || [];
  }();
  mission.passengersAndCrew = function(){
    return mission.passengers.length + 2;
  }();

  mission.hasRoom = function(){
    return mission.passengersAndCrew < 10;
  }()

  mission.totalWeight = function(){
    var weight = 0;
    _.each(mission.assignments, function(assignment){
      weight+=assignment.passenger.weight;
    });
    return weight;
  }();

  mission.needsRole = function(role){
    var needed = false;
    if(!this.isFlying()){
      return false;
    }
    switch(role){
      case "mission-commander" :
        needed = !mission.commander;
        break;
      case "mav-pilot" :
        needed = !mission.MAVpilot;
        break;
      case "colonist" :
        needed = mission.colonists.length <= 10;
        break;
      case "space-tourist" :
        needed = mission.tourists.length <=20;
        break;
    }
    return needed;
  };

  mission.isFlying = function(){
    return this.status === "open";
  };

  return mission;
};

module.exports = Mission;