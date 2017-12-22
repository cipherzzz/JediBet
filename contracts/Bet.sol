pragma solidity ^0.4.8;
  contract Bet {

    uint betAmount = 0;
    uint originatorGuess = 0;
    uint takerGuess = 0;

    struct JediBet {
      uint guess;
    }

    JediBet[] jediBets;

    function createBet(uint _betAmount, uint _guess) public payable {
      betAmount = _betAmount;
      originatorGuess = _guess;
    }

    function takeBet(uint _betAmount, uint _guess) public payable {
      if(_betAmount == betAmount) {
      takerGuess = _guess;
      }
    }

    function getBetAmount() public view returns (uint) {
      return betAmount;
    }

     function getOriginatorGuess() public view returns (uint) {
       return originatorGuess;
     }

     function getTakerGuess() public view returns (uint) {
        return takerGuess;
     }

     function getBetOutcome() public view returns (string) {
             uint outcome = uint(block.blockhash(block.number-1))%10 + 1;
             if(originatorGuess == takerGuess) {
               return 'Both bets were the same, the pot will be split';
             } else if(originatorGuess > outcome && takerGuess  > outcome) {
               return 'Both bets were greater than the number so the pot will be split';
             } else {
                if(originatorGuess == outcome) {
                  return 'Bet originator guessed the number and will receive twice the pot';
                } else if(takerGuess == outcome) {
                 return 'Bet taker guessed the number and will receive twice the pot';
                } else if((outcome - originatorGuess) < (outcome - takerGuess)) {
                  return 'Bet originator guess was closer to the number and will receive the pot';
                }
                else if((outcome - takerGuess) < (outcome - originatorGuess)) {
                  return 'Bet taker guess was closer to the number and will receive the pot';
                }
                else {
                  return '';
                }
             }
          }
  }