import { array, boolean, constant, constantFrom, dictionary, record } from 'fast-check'
import { Arbitrary } from 'fast-check/lib/types/check/arbitrary/definition/Arbitrary'
import { addressArb } from '../../../ethereum/models/Address/addressArb'
import { quotientBigIntArb } from '../../../utils/Quotient/Arbitrary/quotientBigIntArb'
import { getQuotientsFromNumberNumerators } from '../models/bigint/BigIntQuotientFunctions'
import { GetTalliesDeltaConfig, getTalliesDeltaConfigTypes, GetTalliesDeltasFromHoldersConfig, GetTalliesDeltasFromRecipientConfig, GetTalliesDeltasFromReferralsConfig } from '../models/GetTalliesDeltaConfig'
import { HieroShare } from '../models/HieroShare'
import { Address } from '../uni'
import { getNumeratorsArb } from './getNumeratorsArb'
import { sharesLengthMax } from '../constants'

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

type HieroShareWithoutQuotient = Omit<HieroShare, 'quotient'>

type HieroShareWQ = HieroShareWithoutQuotient

export const shareWithoutQuotientArb = (users: Address[]) => (depth: number): Arbitrary<HieroShareWQ> => record<HieroShareWQ>({
  getTalliesDeltaConfig: getTalliesDeltaConfigArb(users),
  children: depth > 0 ? getSharesArb(users)(depth - 1) : constant([]),
})

// export const getShareFromHoldersArb = (quotient: QuotientGen<bigint>) => record({
//   quotient:
// })

export const getSharesArb = (users: Address[]) => (depth: number) => {
  return getNumeratorsArb(sharesLengthMax + 1)
    .chain(numerators => {
      const quotients = getQuotientsFromNumberNumerators(numerators)
      const quotientsPartial = quotients.slice(0, -1) // ensure sum(quotients) < 1
      return array(shareWithoutQuotientArb(users)(depth), {
        minLength: quotientsPartial.length,
        maxLength: quotientsPartial.length,
      }).map<HieroShare[]>(sharesWithoutQuotientArb => {
        return sharesWithoutQuotientArb.map((shareWithoutQuotient, index) => ({
          ...shareWithoutQuotient,
          quotient: quotientsPartial[index],
        }))
      })
    })
}
