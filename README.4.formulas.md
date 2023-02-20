# Fairpool formulas

NOTE: Must be merged with [README.1.formulas.md](./README.1.formulas.md)

Outline:

* These formulas imply that there is a quoteSupplyMax, after which baseSupplyDelta < 1 (impossible with integer arithmetic)
* These formulas imply there is a necessary downscale step (formula has to be applied twice, with refund to buyer)

Notes:

* Variables ending with "F" are unscaled floats

## baseDeltaF

```typescript
x * y == k // Uniswap formula
x = (baseLimit - baseSupply)
y = (quoteOffset + quoteSupply)
k = baseLimit * quoteOffset // initial condition: baseSupply == 0 && quoteSupply == 0
(baseLimit - baseSupply) * (quoteOffset + quoteSupply) == baseLimit * quoteOffset
(-baseSupply) * quoteOffset + (-baseSupply) * quoteSupply + baseLimit * quoteSupply == 0
-1 * baseSupply * (quoteOffset + quoteSupply) == -1 * baseLimit * quoteSupply
baseSupply * (quoteOffset + quoteSupply) == baseLimit * quoteSupply
baseSupply * quoteOffset + baseSupply * quoteSupply == baseLimit * quoteSupply
baseSupply * quoteOffset == (baseLimit - baseSupply) * quoteSupply

baseSupply == baseLimit * quoteSupply / (quoteOffset + quoteSupply)
quoteSupply == baseSupply * quoteOffset / (baseLimit - baseSupply)

// alternative view
baseSupply == baseLimit * (quoteSupply / (quoteOffset + quoteSupply))
quoteSupply == quoteOffset * (baseSupply / (baseLimit - baseSupply))

// alternative view 2
baseSupply * (quoteOffset + quoteSupply) == baseLimit * quoteSupply
quoteSupply * (baseLimit - baseSupply) == quoteOffset * baseSupply

// alternative view 3
baseSupply * quoteSupply + (baseSupply * quoteOffset - quoteSupply * baseLimit) == 0

// For Desmos
b_s = baseSupply
b_l = baseLimit
q_s = quoteSupply
q_o = quoteOffset
b_s == b_l * q_s / (q_o + q_s)
q_s == b_s * q_o / (b_l - b_s)
```

## Deltas

```typescript
baseSupply == baseLimit * quoteSupply / (quoteOffset + quoteSupply)
(baseSupply + baseDelta) == baseLimit * (quoteSupply + quoteDelta) / (quoteOffset + quoteSupply + quoteDelta)
baseLimit * quoteSupply / (quoteOffset + quoteSupply) + baseDelta == baseLimit * (quoteSupply + quoteDelta) / (quoteOffset + quoteSupply + quoteDelta)
baseLimit * quoteSupply / (quoteOffset + quoteSupply) * (quoteOffset + quoteSupply + quoteDelta) + baseDelta * (quoteOffset + quoteSupply + quoteDelta) == baseLimit * (quoteSupply + quoteDelta)

baseLimit * quoteSupply * (quoteOffset + quoteSupply + quoteDelta) + baseDelta * (quoteOffset + quoteSupply + quoteDelta) * (quoteOffset + quoteSupply) == baseLimit * (quoteSupply + quoteDelta) * (quoteOffset + quoteSupply)

baseDelta * (quoteOffset + quoteSupply + quoteDelta) * (quoteOffset + quoteSupply) == baseLimit * (quoteSupply + quoteDelta) * (quoteOffset + quoteSupply) - baseLimit * quoteSupply * (quoteOffset + quoteSupply + quoteDelta)

quoteOS = quoteOffset + quoteSupply
baseDelta * (quoteOS + quoteDelta) * (quoteOS) == baseLimit * (quoteSupply + quoteDelta) * (quoteOS) - baseLimit * quoteSupply * (quoteOS + quoteDelta)
baseDelta * quoteOS * (quoteOS + quoteDelta) == baseLimit * quoteOS * (quoteSupply + quoteDelta) - baseLimit * quoteSupply * (quoteOS + quoteDelta)
baseDelta == (baseLimit * quoteOS * (quoteSupply + quoteDelta) - baseLimit * quoteSupply * (quoteOS + quoteDelta)) / (quoteOS * (quoteOS + quoteDelta))

// --- the formula is not getting simpler, trying alternative approach --- //

(baseSupplyCurrent + baseDelta) * (quoteOffset + quoteSupplyCurrent + quoteDelta) == baseLimit * (quoteSupplyCurrent + quoteDelta)
baseDelta % 1 == 0 // baseDelta is an integer
quoteDelta % 1 == 0 // quoteDelta is an integer
quoteDelta <= quoteDeltaProposed

// --- retry --- //

baseSupply == baseLimit * quoteSupply / (quoteOffset + quoteSupply)
baseSupply == baseLimit * (quoteSupplyCurrent + quoteDelta) / (quoteOffset + quoteSupplyCurrent + quoteDelta)
baseSupply == baseLimit * (quoteSupplyCurrent + 1) / (quoteOffset + quoteSupplyCurrent + 1)

// --- retry --- //
baseLimit = k * quoteOffset // assume this
o = quoteOffset
b = baseSupply
q = quoteSupply
z = quoteSupplyCurrent
d = quoteDelta
baseSupply == baseLimit * quoteSupply / (quoteOffset + quoteSupply)
baseSupply == k * o * quoteSupply / (o + quoteSupply)
b = k * o * q / (o + q)
k * o * q == n * (o + q) // condition for integer divisibility
// interesting: from the equation above, n == b
b * (o + q) == k * o * q
b * o + b * q == k * o * q
b * o + b * q - k * o * q == 0
q * b + o * b - k * o * q == 0 // Diophantine equation (heterogeneous polynomial)
x * y + a * x - k * a * y == 0 // rename vars to make them conventional
// in the case of two indeterminates the problem is equivalent with testing if a rational number is the dth power of another rational number ([source](https://en.wikipedia.org/wiki/Diophantine_equation#Homogeneous_equations))
q >= z
q <= z + d
o = 10000
k = 100
z = 1000
d = 1000000
```

## Price

```typescript
price(quoteSupplyCurrent) == quoteDelta / baseDelta(quoteSupplyCurrent)
quoteDelta == 1
baseDelta(quoteSupplyCurrent) == baseSupplyCurrent(quoteSupplyCurrent + 1) - baseSupplyCurrent(quoteSupplyCurrent)
baseSupplyCurrent == baseSupplyMax * quoteSupplyCurrent / (quoteSupplyInitial + quoteSupplyCurrent)
baseDelta(quoteSupplyCurrent) == baseSupplyMax * (quoteSupplyCurrent + 1) / (quoteSupplyInitial + quoteSupplyCurrent + 1) - baseSupplyCurrent(quoteSupplyCurrent) - baseSupplyMax * quoteSupplyCurrent / (quoteSupplyInitial + quoteSupplyCurrent)

```

## Turning point

```typescript
baseSupply == baseLimit * quoteSupply / (quoteOffset + quoteSupply)
baseLimit = k * quoteOffset // assume this // may be unnecessary
b1 == l * q1 / (o + q1)
b2 == l * q2 / (o + q2)
b2 - b1 == 1
q2 - q1 == 1
l * q2 / (o + q2) - l * q1 / (o + q1) == 1
l * (q1 + 1) / (o + (q1 + 1)) - l * q1 / (o + q1) == 1
// simplify using Wolfram Alpha
l * o == (o + q1) * (1 + o + q1)
// solve using Wolfram Alpha, assuming l > 0 && o > 0 && q1 > 0
q1 = 1/2 * (sqrt(4 * l * o + 1) - 2 * o - 1)
```

## Curve-line divergence point

The point after which the curve cannot be reduced to a line

```typescript
quoteSupply == baseSupply * quoteOffset / (baseLimit - baseSupply)
// apply the truncation rule: the result of division is truncated according to integer arithmetic
quoteSupply == baseSupply * trunc(quoteOffset / (baseLimit - baseSupply))
// apply quoteOffset = k * baseLimit
quoteSupply == baseSupply * trunc(k * baseLimit / (baseLimit - baseSupply))
// show the example of applying the truncation rule
if (isLimitOf(baseSupply, zero) && isLimitOf(baseLimit, Infinity)) { 
  trunc(k * baseLimit / (baseLimit - baseSupply)) == k
  /**
   * trunc(k * 100000 / (100000 - 1))
   * trunc(k * 100000 / 99999)
   * trunc(k * 1.00001)
   * trunc(k * (1 + 0.00001))
   * trunc(k + k * 0.00001)
   * k
   */
}
// apply condition of line divergence
trunc(k * baseLimit / (baseLimit - baseSupply)) > k
k * baseLimit / (baseLimit - baseSupply) >= k + 1
k * baseLimit >= (k + 1) * (baseLimit - baseSupply)
k * baseLimit >= k * baseLimit + baseLimit - (k + 1) * baseSupply
0 >= 0 + baseLimit - (k + 1) * baseSupply
0 + (k + 1) * baseSupply >= 0 + baseLimit
(k + 1) * baseSupply >= baseLimit
baseSupply >= (baseLimit) / (k + 1)
```

## quoteSupplyMax

```typescript
// introduce the goal
quoteSupply == quoteSupplyMax
// introduce the quoteSupply formula
quoteSupply == baseSupply * quoteOffset / (baseLimit - baseSupply)
// introduce the requirement for quoteSupply == quoteSupplyMax
baseSupply == baseLimit - 1
// simplify
quoteSupplyMax == (baseLimit - 1) * quoteOffset / (baseLimit - baseLimit + 1)
quoteSupplyMax == (baseLimit - 1) * quoteOffset / (1)
quoteSupplyMax == baseLimit * quoteOffset - quoteOffset
quoteSupplyMax == quoteOffset * (baseLimit - 1)

```
