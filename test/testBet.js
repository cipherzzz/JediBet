var Bet = artifacts.require('./contracts/Bet');

const agreedUponBetAmount = 1; //eth

contract('Bet', function(accounts) {
  const betOriginator = accounts[0];
  const betTaker = accounts[1];
  const originatorBet = 5;
  const takerBet = 4;

  let originatorBalance = web3.eth.getBalance(betOriginator);
  let takerBalance = web3.eth.getBalance(betTaker);

  it('We should be able to create a bet by setting an agreed upon amount and guess', function() {
    return Bet.deployed().then(function(instance) {
      return instance.createBet.sendTransaction(agreedUponBetAmount, originatorBet, {
        from: betOriginator,
        value: web3.toWei(agreedUponBetAmount, 'ether'),
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

  it('The originator balance should be less the bet amount', function() {
    const remainingBalance = originatorBalance - web3.toWei(agreedUponBetAmount, 'ether');
    const currentBalance = web3.eth.getBalance(betOriginator);
    assert.equal(currentBalance.toString(), remainingBalance.toString(), "Balances aren't adding up");
  });

  it('We should be able to take a bet by setting an agreed upon amount and guess', function() {
    return Bet.deployed().then(function(instance) {
      return instance.takeBet.sendTransaction(agreedUponBetAmount, takerBet, {
        from: betTaker,
        value: web3.toWei(agreedUponBetAmount, 'ether'),
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

  it('The contract balance should reflect the originator and taker bets', function() {
    return Bet.deployed().then(function(instance) {
      return instance.getPot().then(balance => {
        assert.equal(
          web3.fromWei(balance.toString(), 'ether'),
          (agreedUponBetAmount * 2).toString(),
          'Contact Balance should equal the bet amounts ',
        );
      });
    });
  });

  it('The bet outcome should be available', function() {
    return Bet.deployed().then(function(instance) {
      return instance.getBetOutcome().then(outcome => {
        console.log(outcome);
        assert.notEqual(outcome, '', 'Bet outcome should not be empty');
      });
    });
  });
});
