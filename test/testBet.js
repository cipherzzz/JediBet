var Bet = artifacts.require('./contracts/Bet');

const agreedUponBetAmount = 5000;
const gasAmount = 1000;

contract('Bet', function(accounts) {
  const betOriginator = accounts[0];
  const betTaker = accounts[1];
  const originatorBet = 5;
  const takerBet = 4;

  it('We should be able to create a bet by setting an agreed upon amount and guess', function() {
    return Bet.deployed().then(function(instance) {
      return instance.createBet.sendTransaction(agreedUponBetAmount, originatorBet, {
        from: betOriginator,
        value: gasAmount,
      });
    });
  });

  it('The originating bet amount in the contract should match the passed in values', function() {
    return Bet.deployed().then(function(instance) {
      return instance.getBetAmount().then(betAmount => {
        assert.equal(betAmount, agreedUponBetAmount, "Bet amounts don't match");
      });
    });
  });

  it('The originating bet guess in the contract should match the passed in values', function() {
    return Bet.deployed().then(function(instance) {
      return instance.getOriginatorGuess().then(betGuess => {
        assert.equal(betGuess, originatorBet, "Bet guesses don't match");
      });
    });
  });

  it('We should be able to take a bet by setting an agreed upon amount and guess', function() {
    return Bet.deployed().then(function(instance) {
      return instance.takeBet.sendTransaction(agreedUponBetAmount, takerBet, {
        from: betTaker,
        value: gasAmount,
      });
    });
  });

  it('The taker bet guess in the contract should match the passed in values', function() {
    return Bet.deployed().then(function(instance) {
      return instance.getTakerGuess().then(betGuess => {
        assert.equal(betGuess, takerBet, "Bet guesses don't match");
      });
    });
  });

  it('The bet outcome should be available', function() {
    return Bet.deployed().then(function(instance) {
      return instance.getBetOutcome().then(outcome => {
        assert.notEqual(outcome, '', 'Bet outcome should not be empty');
        console.log(outcome);
      });
    });
  });
});
