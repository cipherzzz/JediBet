# A Jedi’s Guide to Ethereum — Part 3

Master Yoda and Obi-Wan love to gamble. If you can recall in [Part
1](https://medium.com/@cipherz/super-simple-ethereum-part-1-7e363dbc1c65) and
[Part 2](https://medium.com/@cipherz/super-simple-ethereum-part-2-6611721a391)
of this series, Yoda and Obi-Wan created a private Ethereum network in order to
transfer some Eth between each other to settle a bet. They have now decided to
create a smart contract to settle their bets in a trustless way. They want to do
the following

* Deploy a smart contract to hold the Eth and bets of each Jedi
* Check the results of the bet
* Use the deployed smart contract to pay out the winnings

The Masters are into a really simple game called *over/under *— where they guess
a number between 1 and 10. The rules are as follows

* The number is **randomly** generated(by the smart contract in this case)
* The player **closest** to the number without going over it wins
* If the players guess the **same** number the winnings are split
* If both players guess **above** the number the winnings are split
* If there is an **error** in the contract execution, the bets are returned to the
players

#### Setup

A contract is a bit of code that performs some logical operation based on given
inputs. The contract is stored and executed in the blockchain. Ethereum’s
preferred language for interacting with its blockchain is called *Solidity*. The
syntax and usage of Solidity is beyond the scope of this article, but we will
comment on the key parts of the code. Before we get into the code itself, let
install a helpful development tool called, *truffle. *Truffle is a node.js CLI
tool that will greatly simplify our Solidity development, testing, and
deployment.

Install *truffle*

    $ npm install -g truffle

Create project

    $ mkdir ~/ethereum/JediBet && cd ~/ethereum/JediBet
    $ truffle init

You should see the following structure

    $ ls
    build        migrations    truffle-config.js
    contracts     test         truffle.js

Create a file named *Bet.sol *with the following content

    pragma solidity ^0.4.8;

    contract Bet {
    }

Create a file named *2_deploy_contracts.js *with the following content

    Bet = artifacts.require("./Bet.sol");
    module.exports = 
    (deployer) {
      deployer.deploy(Bet);
    };

Run the *truffle *development environment to simulate an ethereum network. We
will use our private network later, but this should be good enough to develop on
right now. Notice how the ethereum testnet starts up with a command line as
well. Pretty nice.

    $ truffle development
    ...
    truffle(develop)>

Compile the empty contract, *Bet.sol*

    truffle(develop)> compile
    Compiling ./contracts/Bet.sol...
    Writing artifacts to ./build/contracts

Migrate the contract(Publish it on the blockchain). Note that this publishes the
contract to a local test network that truffle maintains. You can view the output
from this network by running the following from the project directory. Also,
note that this test network does not require you to mine the transactions as a
part of your development and testing. In the real world you would have to mine
any transaction or contract you send to the blockchain.

    truffle development --log

    truffle(develop)> migrate
    Compiling ./contracts/Bet.sol...
    Writing artifacts to ./build/contracts
    Using network 'develop'.
    Running migration: 1_initial_migration.js
      Replacing Migrations...
      ... 0x7bc67e72eca3ffc723a8279d2e00194a19d65f4f42d87b4c51b6e8a2245a5fe6
      Migrations: 0x8cdaf0cd259887258bc13a92c0a6da92698644c0
    Saving successful migration to network...
      ... 0xd7bc86d31bee32fa3988f1c1eabce403a1b5d570340a3a9cdba53a472ee8c956
    Saving artifacts...
    Running migration: 2_deploy_contracts.js
      Replacing Bet...
      ... 0x5c1dfbe5827ed7380063290a48f2357ce2969f57ed59064a1c9222e66400ab56
      Bet: 0x345ca3e014aaf5dca488057592ee47305d9b3e10
    Saving successful migration to network...
      ... 0xf36163615f41ef7ed8f4a8f192149a0bf633fe1a2398ce001bf44c43dc7bdda0
    Saving artifacts...
    truffle(develop)>

#### What?

We have just published an empty ethereum contract, *Bet.sol*, to the truffle
testnet. We can’t do anything with it because it has no logic in it yet, but we
will add that in the next section.

#### The Code

Like good citizens of the Republic, we are creating tests for our code using
truffle’s integration with the *Mocha *test framework. The *Empire *has been
blocking online content through it’s galactic firewalls, but Yoda has managed to
find some good Solidity resources through the decentralized hosting network,
[Substratum](https://substratum.net/). Solidity code and tests are outside of
the scope of this article but they are presented below for your reference.

#### The Contract

If you recall, the purpose of the contract is to facilitate the betting and
payout of Yoda and Obi-Wan’s favorite betting game, ‘Over-Under’. It is
basically guessing a number between 1 and 10 without going over it, but don’t
tell them that. The code below supports the following functions

* Originate Bet — The *originator* can create a bet with an amount and the value
guessed
* Take Bet — The *taker *can accept the bet by verifying the amount of the bet and
passing in a value for their guess.
* Payout Bet — Either gambler* *can request the contract to payout the bet upon
its conclusion.

A couple helpful points to consider while reviewing the contract

* A *contract *can do pretty much everything an *account *can do(Receive,
Transfer, Send, Transact). In this case, our gamblers are sending their ether to
the smart contract where it is stored within the contract’s account. It is not
an IOU, it is literally maintaining the pot for the gamblers and providing a
trustless escrow for their outcome.
* Any transaction with the Ethereum blockchain requires *gas *— and this is no
exception. The truffle tests do not specify a gas amount, but the *gas* is being
taken from the amount sent. Note that *gas* is paid by the **Sender **of a
transaction, so the originator, taker, and contract all pay *gas* to make this
trustless system work. Typically, the *gas *amounts are very small, however, it
is up to the contract developer to make sure that the minimum amount of *gas* is
used while still ensuring the safety of the contract.
* Disclaimer — The contract below does not handle error conditions or prevent a
bad actor from messing with our bet. We will improve our contract in the next
article where we add a simple web ui to facilitate bets more easily.

#### Bet.sol

The contract above is testable with the mocha tests with truffle. Create a
*testBet.js* file in the *test* root project directory. Use the content below

#### testBet.js

Run the test as follows

    truffle(develop)> test './test/testBet.js'
    Using network 'develop'.

    Contract: Bet
        ✓ We should be able to start a bet by setting a guess and sending the bet amount that the contract was initialized with (38ms)
        ✓ The originating bet amount in the contract should match the passed in values
        ✓ The originating bet guess in the contract should match the passed in values
        ✓ The originator balance should be less the bet amount and gas (160ms)
        ✓ We should be able to take a bet by setting a guess and sending the bet amount that the contract was initialized with
        ✓ Taking the bet should fail if the bet amount does not equal the bet amount that the contract was initialized with
        ✓ The taker bet guess in the contract should match the passed in values
        ✓ The taker balance should be less the bet amount and gas (142ms)
        ✓ The contract balance should reflect the originator and taker bets
        ✓ The taker or originator should be able to call the payout to transfer winnings
        ✓ Originator and Taker balances should reflect bet outcome (272ms)
        ✓ ONLY the taker or originator should be able to call the payout function
        ✓ ONLY the taker or originator should be able to call the getBetAmount function
        ✓ ONLY the taker or originator should be able to call the getOriginatorGuess function
        ✓ ONLY the taker or originator should be able to call the getTakerGuess function
        ✓ ONLY the taker or originator should be able to call the getPot function
        ✓ ONLY the taker or originator should be able to call the getBetAmount function

    17 passing (929ms)

    truffle(develop)>

#### Summary

We learned a lot in this portion of our series

* Setting up a development environment with truffle
* Creating and deploying our first Solidity smart contract
* Test-Driven-Development of our Solidity smart contract

In our [next
article](https://medium.com/@cipherz/a-jedis-guide-to-ethereum-part-3b-remix-1b8d98d909d4)
we will deploy this smart contract to our local ethereum network using the Remix
IDE and learn how to use this powerful resource.

The updated code for this example is here:
[https://github.com/cipherzzz/JediBet](https://github.com/cipherzzz/JediBet)

* [Ethereum](https://medium.com/tag/ethereum?source=post)
* [Solidity](https://medium.com/tag/solidity?source=post)
* [Truffle](https://medium.com/tag/truffle?source=post)
* [Smart Contra](https://medium.com/tag/smart-contra?source=post)

### [CipherZ](https://medium.com/@cipherz)
