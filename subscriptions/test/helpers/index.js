var MembershipApplication = require("../../models/membership_application");
var sinon = require("sinon");
var DB = require("../../db");
var Mission = require("../../models/mission");

exports.validApplication = new MembershipApplication({
  first : "Test",
  last : "User",
  email : "test@test.com",
  age : 30,
  height : 66,
  weight : 180,
  role : "commander",
  card : 1
});

// exports.stubDb = function(args){
//   args || (args = {});
//   var mission = args.mission || new Mission();
//   var db = new DB();
//   sinon.stub(db, "getMissionByLaunchDate").yields(null,null);
//   sinon.stub(db, "createNextMission").yields(null,mission);
//   return db;
// };

exports.goodStripeArgs = {
  name : "Test User",
  email : "test@test.com",
  plan : "commander",
  card : 1
};
exports.badStripeArgs = {
  name : "Test User",
  email : "test@test.com",
  plan : "commander",
  card : 2
};
exports.goodStripeResponse = function(args){
  args || (args = {});
  var plan = args.plan || "commander";
  return { 
    object: plan,
    created: 1425829693,
    id: 'cus_5pmBAvK65LCm36',
    livemode: false,
    description: 'Test User',
    email: 'test@test.com',
    delinquent: false,
    metadata: {},
    subscriptions:
     { object: 'list',
       total_count: 1,
       has_more: false,
       url: '/v1/customers/cus_5pmBAvK65LCm36/subscriptions',
       data: [ [Object] ] },
    discount: null,
    account_balance: 0,
    currency: 'usd',
    sources:
     { object: 'list',
       total_count: 1,
       has_more: false,
       url: '/v1/customers/cus_5pmBAvK65LCm36/sources',
       data: [ [Object] ] },
    default_source: 'card_5pmBNPZibeUtn8' 
  }
}();

exports.badStripeResponse = function(){

  return {
    rawType: 'card_error',
    code: 'card_declined',
    param: undefined,
    message: 'Your card was declined.',
    detail: undefined,
    raw: { 
        message: 'Your card was declined.',
        type: 'card_error',
        code: 'card_declined',
        decline_code: 'generic_decline' 
      }, 
    error : "Your card was declined",
    type: 'StripeCardError'
    }
}();
