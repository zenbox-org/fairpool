import { array, boolean, constant, constantFrom, dictionary, record } from 'fast-check'
import { Arbitrary } from 'fast-check/lib/types/check/arbitrary/definition/Arbitrary'
import { addressArb } from '../../../ethereum/models/Address/addressArb'
import { BigIntBasicArithmetic } from '../../../utils/bigint/BigIntBasicArithmetic'
import { quotientBigIntArb } from '../../../utils/Quotient/Arbitrary/quotientBigIntArb'
import { setDenominator } from '../../../utils/Quotient/setDenominator'
import { Address } from '../models/Address'
import { getQuotientsFromNumberNumerators } from '../models/bigint/BigIntQuotientFunctions'
import { scaleFixed, sharesLengthMax } from '../models/Fairpool/constants'
import { GetTalliesDeltaConfig, getTalliesDeltaConfigTypes } from '../models/GetTalliesDeltaConfig'
import { GetTalliesDeltasFromHoldersConfig } from '../models/GetTalliesDeltaConfig/GetTalliesDeltasFromHoldersConfig'
import { GetTalliesDeltasFromRecipientConfig } from '../models/GetTalliesDeltaConfig/GetTalliesDeltasFromRecipientConfig'
import { GetTalliesDeltasFromReferralsConfig } from '../models/GetTalliesDeltaConfig/GetTalliesDeltasFromReferralsConfig'
import { HieroShare, parseHieroShares } from '../models/HieroShare'
import { getNumeratorsArb } from './getNumeratorsArb'

export const getTalliesDeltasFromHoldersConfigArb = record<GetTalliesDeltasFromHoldersConfig>({
  type: constant('GetTalliesDeltasFromHoldersConfig'),
})

export const getTalliesDeltaFromRecipientConfigArb = record<GetTalliesDeltasFromRecipientConfig>({
  type: constant('GetTalliesDeltasFromRecipientConfig'),
  address: addressArb,
})

export const getTalliesDeltaFromReferralsConfigArb = (users: Address[]) => {
  const usersArb = constantFrom(...users)
  return record<GetTalliesDeltasFromReferralsConfig>({
    type: constant('GetTalliesDeltasFromReferralsConfig'),
    discount: quotientBigIntArb,
    referralsMap: dictionary(usersArb, usersArb),
    isRecognizedReferralMap: dictionary(usersArb, boolean()),
  })
}

export const getTalliesDeltaConfigTypeArb = constantFrom(...getTalliesDeltaConfigTypes)

export const getTalliesDeltaConfigArb = (users: Address[]) => getTalliesDeltaConfigTypeArb.chain<GetTalliesDeltaConfig>(type => {
  switch (type) {
    case 'GetTalliesDeltasFromHoldersConfig': return getTalliesDeltasFromHoldersConfigArb
    case 'GetTalliesDeltasFromRecipientConfig': return getTalliesDeltaFromRecipientConfigArb
    case 'GetTalliesDeltasFromReferralsConfig': return getTalliesDeltaFromReferralsConfigArb(users)
    default: throw new Error()
  }
})

type HieroShareStatic = Omit<HieroShare, 'quotient' | 'name'>

export const shareWithoutQuotientArb = (users: Address[]) => (depth: number): Arbitrary<HieroShareStatic> => record<HieroShareStatic>({
  getTalliesDeltaConfig: getTalliesDeltaConfigArb(users),
  children: depth > 0 ? getSharesArb(users)(depth - 1) : constant([]),
})

// export const getShareFromHoldersArb = (quotient: QuotientGen<bigint>) => record({
//   quotient:
// })

export const getSharesArb = (users: Address[]) => (depth: number) => {
  return getNumeratorsArb(sharesLengthMax + 1)
    .chain(numerators => {
      const quotientsFullRaw = getQuotientsFromNumberNumerators(numerators)
      const quotientsFull = quotientsFullRaw.map(setDenominator(BigIntBasicArithmetic)(scaleFixed))
      const quotients = quotientsFull.slice(0, -1) // ensure sum(quotients) < 1
      return array(shareWithoutQuotientArb(users)(depth), {
        minLength: quotients.length,
        maxLength: quotients.length,
      }).map<HieroShare[]>(sharesWithoutQuotientArb => {
        return sharesWithoutQuotientArb.map((shareWithoutQuotient, index) => ({
          ...shareWithoutQuotient,
          name: JSON.stringify({ depth, index }),
          quotient: quotients[index],
        }))
      })
    })
    .map(parseHieroShares)
}
