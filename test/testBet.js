var Bet = artifacts.require('./contracts/Bet');

const betAmountInEth = 0.25;
const agreedUponBetAmount = web3.toWei(betAmountInEth, 'ether');

contract('Bet', function(accounts) {
  const betOriginator = accounts[0];
  const betTaker = accounts[1];
  const originatorBet = 4;
  const takerBet = 5;

  const originatorBalanceBeforeBet = web3.eth.getBalance(betOriginator);
  const takerBalanceBeforeBet = web3.eth.getBalance(betTaker);
  let originatorBalanceAfterBet;
  let takerBalanceAfterBet;

  it('We should be able to create a bet by setting an agreed upon amount and guess', function() {
    return Bet.deployed().then(function(instance) {
      return instance.createBet
        .sendTransaction(agreedUponBetAmount, originatorBet, {
          from: betOriginator,
          value: agreedUponBetAmount,
        })
        .then(tx => {
          assert.notEqual(tx, '', 'We should get a transaction hash');
        });
    });
  });

  it('The originating bet amount in the contract should match the passed in values', function() {
    return Bet.deployed().then(function(instance) {
      return instance.getBetAmount().then(betAmount => {
        console.log('betAmount: ' + agreedUponBetAmount);
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

  it('The originator balance should be less the bet amount and gas', function() {
    const originalBalanceMinusBet = originatorBalanceBeforeBet - agreedUponBetAmount;
    originatorBalanceAfterBet = web3.eth.getBalance(betOriginator);
    assert.equal(
      originatorBalanceAfterBet < originalBalanceMinusBet,
      true,
      'Current Balance should be less than original balance minus bet because of gas',
    );
  });

  it('We should be able to take a bet by setting an agreed upon amount and guess', function() {
    return Bet.deployed().then(function(instance) {
      return instance.takeBet
        .sendTransaction(agreedUponBetAmount, takerBet, {
          from: betTaker,
          value: agreedUponBetAmount,
        })
        .then(tx => {
          assert.notEqual(tx, '', 'We should get a transaction hash');
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

  it('The taker balance should be less the bet amount and gas', function() {
    const originalBalanceMinusBet = takerBalanceBeforeBet - agreedUponBetAmount;
    takerBalanceAfterBet = web3.eth.getBalance(betTaker);
    assert.equal(
      takerBalanceAfterBet < originalBalanceMinusBet,
      true,
      'Current Balance should be less than original balance minus bet because of gas',
    );
  });

  it('The contract balance should reflect the originator and taker bets', function() {
    return Bet.deployed().then(function(instance) {
      return instance.getPot().then(balance => {
        assert.equal(
          balance.toString(),
          (agreedUponBetAmount * 2).toString(),
          'Contact Balance should equal the bet amounts ',
        );
      });
    });
  });

  it('The taker or originator should be able to call the payout to transfer winnings', function() {
    return Bet.deployed().then(function(instance) {
      return instance.payout().then(tx => {
        assert.notEqual(tx.tx, '', 'We should get a transaction hash');
      });
    });
  });

  it('Originator and Taker balances should reflect bet outcome', function() {
    return Bet.deployed().then(function(instance) {
      return instance.getBetOutcome().then(outcome => {
        assert.notEqual(outcome[0], '', 'Bet outcome description should not be empty');
        assert.notEqual(outcome[2], '', 'Bet originator status should not be empty');
        assert.notEqual(outcome[4], '', 'Bet taker status should not be empty');

        const originatorBalanceAfterPayout = web3.eth.getBalance(betOriginator);
        const takerBalanceAfterPayout = web3.eth.getBalance(betTaker);

        console.log(JSON.stringify(outcome));

        if (outcome[2].toString() === '1') {
          let gain = originatorBalanceAfterPayout.minus(originatorBalanceBeforeBet);
          console.log('originator gain:' + gain);

          //if originator won
          assert.equal(
            gain.dividedBy(agreedUponBetAmount).greaterThan(0.9),
            true,
            'Balance Gain after payout for a winning bet should be within 10% of bet amount',
          );
        } else if (outcome[4].toString() === '1') {
          let gain = takerBalanceAfterPayout.minus(takerBalanceBeforeBet);
          console.log('taker gain:' + gain);

          //if taker won
          assert.equal(
            gain.dividedBy(agreedUponBetAmount).greaterThan(0.9),
            true,
            'Balance Gain after payout for a winning bet should be within 10% of bet amount',
          );
        } else {
          //a tie or error

          let takerDelta = takerBalanceBeforeBet.minus(takerBalanceAfterPayout).dividedBy(takerBalanceBeforeBet);

          let originatorDelta = originatorBalanceBeforeBet
            .minus(originatorBalanceAfterPayout)
            .dividedBy(originatorBalanceBeforeBet);

          console.log('originatorDelta: ' + originatorDelta);
          console.log('takerDelta: ' + takerDelta);

          assert.equal(
            takerDelta.lessThan(0.01) && originatorDelta.lessThan(0.01),
            true,
            'Balance after payout for a tied bet should be within 1% of original balance',
          );
        }
      });
    });
  });
});