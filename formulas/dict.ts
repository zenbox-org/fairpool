import { strict as assert } from 'assert'

// define constant "a" equal to "1"
const a = 1
const b = 2 + a

// define constant "b" of type "number" equal to "1"
// const b: number = 1

// define constant "s" equal to "'hello'"
const s = 'hello'

// define constant "addFull" equal to function of two arguments ("a" of type "number", "b" of type "number") with body of one expression (call of function "+" with two arguments: "arg1" equal to "a", "arg2" equal to "b")
function addFull(a: number, b: number) {
  return a + b
}

// define constant "addFull" equal to function of two arguments ("a" of type "number", "b" of type "number") with body of one expression (call of function "+" with two arguments: "arg1" equal to "a", "arg2" equal to "b")
const addShort = (a: number, b: number) => a + b
const addShort_explicit = (a: number, b: number) => { return a + b }

/**
 define constant "add" equal to function
 * with arguments:
  * a of type number
 * with body
  * return constant "f1" equal to function
    * with arguments
      * b of type number
    * with body
      * call of function "+" with two arguments: "arg1" equal to "a", "arg2" equal to "b"
 */
const addCurried = (a: number) => (b: number) => a + b
const addCurried_explicit = (a: number) => { return (b: number) => { return a + b } }

// demo of addCurried
const addCurried1 = addCurried(1)
const addCurried12 = addCurried(1)(2)
const addCurried1_explicit = (b: number) => 1 + b
const addCurried12_explicit = 1 + 2

assert.equal(
  addFull(1, 2),
  addShort(1, 2)
)
assert.equal(
  addFull(1, 2),
  addCurried(1)(2)
)

export default {}
