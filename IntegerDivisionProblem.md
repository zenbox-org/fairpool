# Integer Division Problem

## Scenario

* Multiple users call buy() and sell() methods on the Fairpool contract
* The contract arrives into the following state:
  * quoteSupply = x
  * baseSupply = y
* Alice calls a buy() function with msg.value = quoteDeltaProposed
* Contract calls getBuyDeltas to get a pair of (baseDelta, quoteDelta) 
  * getBuyDeltas calls getBaseSupply
* Contract updates its state:
  * quoteSupplyNew = quoteSupply + baseDelta
  * baseSupplyNew = baseSupply + quoteDelta
* Contract asserts that `baseSupplyNew == getBaseSupply(quoteSupplyNew)`, but it fails
  * Actually, `baseSupplyNewCalculated <= baseSupplyNew` because the integer division in getBaseSupply truncates the fractional part

## Notes

## Outline

* Important: a single baseSupply / quoteSupply calculation cycle already gives a very good approximation
  * This solves the refund problem in the buy() function
  * quoteSupplyInt is guaranteed to be less than quoteSupplyRat
* Integer Quadratic Programming (IQP)
  * [Solving Integer Quadratic Programming ...](https://ojs.aaai.org/index.php/AAAI/article/view/3960/3838)
  * [Integer Programming](https://en.wikipedia.org/wiki/Integer_programming)
* [Non-Linear Optimization Library](https://nlopt.readthedocs.io/)
* [Diophantine equation](https://en.wikipedia.org/wiki/Diophantine_equation)
* Output a table of baseSupply for each quoteSupply
  * Interesting: baseSupply(k * (n + 1)) - baseSupply(k * n) == k * baseLimit / quoteOffset - 1
    * Holds for large n as well
* Higher scale -> More optimal pairs

## Options

* Use cudgels
  * Ensure baseDeltaMin >= 1
  * Ensure the full contract balance is withdrawn in the last sell()
  * Increase the curve parameters
* Use a list of precalculated optimal values on the frontend
  * Outline
    * Important
      * We can't know the quoteSupply at the moment when the transaction is going to be executed (quoteSupplyAtExecution)
      * We may know the quoteSupply at the moment before the transaction is submitted (quoteSupplyAtSubmission)
        * quoteSupplyAtExecution < quoteSupplyAtSubmission || quoteSupplyAtExecution == quoteSupplyAtSubmission || quoteSupplyAtExecution > quoteSupplyAtSubmission
      * Higher length of the quoteSupplyOptimal list increases the tx fee but also increases the probability of tx confirmation
        * len(quoteSupplyOptimalPositive) is not bounded by quoteSupplyOptimal <= quoteSupplyAtSubmission + quoteDelta because quoteSupplyAtSubmission !~ quoteSupplyAtExecution
  * Options
    * Use brute force search
    * Use an algorithm for solving a Diophantine equation
* Find a pair of integers
  * Options
    * https://math.stackexchange.com/q/1991605
