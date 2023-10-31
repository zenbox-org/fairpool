import { NonEmptyArray } from '../../../../utils/NonEmptyArray'

export type ShareRoot = bigint

export type ShareRootReferral = bigint

export type ShareRootReferralDiscount = bigint

export type SimpleShare = [ShareRoot, ShareRootReferral, ShareRootReferralDiscount]

export type SimpleShares = NonEmptyArray<SimpleShare>
