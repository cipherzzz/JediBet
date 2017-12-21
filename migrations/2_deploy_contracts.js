var Bet = artifacts.require("./Bet.sol");

module.exports = function(deployer) {
  deployer.deploy(Bet);
};