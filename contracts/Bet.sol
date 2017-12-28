pragma solidity ^0.4.8;
  contract Bet {

    //bet input - originator pays the gas to start the bet
    uint betAmount = 0;

    //the 'better' structure
    struct JediBet {
      uint guess;
      address addr;
    }

    //the two 'betters'
    JediBet originator;
    JediBet taker;

    function createBet(uint _betAmount, uint _guess) public payable {
      betAmount = _betAmount;
      originator = JediBet(_guess, msg.sender);
    }

    function takeBet(uint _betAmount, uint _guess) public payable returns (string){
      if(_betAmount == betAmount) {
        taker = JediBet(_guess, msg.sender);
      }
    }

    function getBetAmount() public view returns (uint) {
      return betAmount;
    }

     function getOriginatorGuess() public view returns (uint) {
       return originator.guess;
     }

     function getTakerGuess() public view returns (uint) {
        return taker.guess;
     }

     function getPot() public view returns (uint256) {
        return this.balance;
     }

     function getBetOutcome() public view returns (string) {

        //todo - not a great way to generate a random number but ok for now
        uint outcome = uint(block.blockhash(block.number-1))%10 + 1;

        if(originator.guess == taker.guess) {
          return 'Both bets were the same, the pot will be split';
        } else if(originator.guess > outcome && taker.guess  > outcome) {
          return 'Both bets were greater than the number so the pot will be split';
        } else {
           if(originator.guess == outcome) {
             return 'Bet originator guessed the number and will receive twice the pot';
           } else if(taker.guess == outcome) {
            return 'Bet taker guessed the number and will receive twice the pot';
           } else if((outcome - originator.guess) < (outcome - taker.guess)) {
             return 'Bet originator guess was closer to the number and will receive the pot';
           }
           else if((outcome - taker.guess) < (outcome - originator.guess)) {
             return 'Bet taker guess was closer to the number and will receive the pot';
           }
           else {
             return '';
           }
        }
      }
  }