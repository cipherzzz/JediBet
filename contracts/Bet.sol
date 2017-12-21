pragma solidity ^0.4.8;
  contract Bet {

    uint betAmount = 0;
    uint originatorGuess = 0;
    uint takerGuess = 0;
    uint randomNumber = 0;

    struct JediBet {
      uint guess;
    }

    JediBet[] jediBets;

    function createBet(uint _betAmount, uint _guess) public payable {
      betAmount = _betAmount;
      randomNumber = uint(block.blockhash(block.number-1))%10 + 1;
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
  }