pragma solidity ^0.4.8;
  contract Bet {

    //jedi bet status
    uint constant STATUS_WIN = 1;
    uint constant STATUS_LOSE = 2;
    uint constant STATUS_TIE = 3;
    uint constant STATUS_PENDING = 4;

    //game status
    uint constant STATUS_NOT_STARTED = 1;
    uint constant STATUS_STARTED = 2;
    uint constant STATUS_COMPLETE = 3;

    //general status
    uint constant STATUS_ERROR = 4;

    //the 'game' structure
    struct Game {
      uint betAmount;
      uint outcome;
      uint status;
    }

    //the 'better' structure
    struct JediBet {
      uint guess;
      address addr;
      uint status;
    }

    //the two 'betters'
    JediBet originator;
    JediBet taker;

    //the game
    Game game;

    function createBet(uint _betAmount, uint _guess) public payable {
      game = Game(_betAmount, 0, STATUS_STARTED);
      originator = JediBet(_guess, msg.sender, STATUS_PENDING);
    }

    function takeBet(uint _betAmount, uint _guess) public payable{
      if(_betAmount == game.betAmount) {
        taker = JediBet(_guess, msg.sender, STATUS_PENDING);
        generateBetOutcome();
      }
    }

    function payout() public payable {

     if(originator.status == STATUS_TIE && taker.status == STATUS_TIE) {
       originator.addr.transfer(game.betAmount);
       taker.addr.transfer(game.betAmount);
     } else {
        if(originator.status == STATUS_WIN) {
          originator.addr.transfer(game.betAmount*2);
        }
        else if(taker.status == STATUS_WIN) {
          taker.addr.transfer(game.betAmount*2);
        }
        else {
          originator.addr.transfer(game.betAmount);
          taker.addr.transfer(game.betAmount);
        }
     }
   }

    function getBetAmount() public view returns (uint) {
      return game.betAmount;
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

    function generateBetOutcome() private {
        //todo - not a great way to generate a random number but ok for now
        game.outcome = uint(block.blockhash(block.number-1))%10 + 1;
        game.status = STATUS_COMPLETE;

        if(originator.guess == taker.guess) {
          originator.status = STATUS_TIE;
          taker.status = STATUS_TIE;
        } else if(originator.guess > game.outcome && taker.guess  > game.outcome) {
          originator.status = STATUS_TIE;
          taker.status = STATUS_TIE;
        } else {
           if((game.outcome - originator.guess) < (game.outcome - taker.guess)) {
             originator.status = STATUS_WIN;
             taker.status = STATUS_LOSE;
           }
           else if((game.outcome - taker.guess) < (game.outcome - originator.guess)) {
             originator.status = STATUS_LOSE;
             taker.status = STATUS_WIN;
           }
           else {
             originator.status = STATUS_ERROR;
             taker.status = STATUS_ERROR;
             game.status = STATUS_ERROR;
           }
        }
    }

     //returns - [<description>, 'originator', <originator status>, 'taker', <taker status>]
     function getBetOutcome() public view returns
     (string description,
      string originatorKey,
      uint originatorStatus,
      string takerKey,
      uint takerStatus) {

        if(originator.status == STATUS_TIE || taker.status == STATUS_TIE) {
          description = 'Both bets were the same or were over the number, the pot will be split';
        } else {
           if(originator.status == STATUS_WIN) {
             description = 'Bet originator guess was closer to the number and will receive the pot';
           }
           else if(taker.status == STATUS_WIN) {
             description = 'Bet taker guess was closer to the number and will receive the pot';
           }
           else {
             description = 'Unknown Bet Outcome';
           }
        }
        originatorKey = 'originator';
        originatorStatus = originator.status;
        takerKey = 'taker';
        takerStatus = taker.status;
     }
  }