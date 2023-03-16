import { isEqualSC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { identity } from 'remeda'
import { z } from 'zod'
import { Uint256BigIntSchema } from '../../../../ethereum/models/Uint256BigInt'
import { quoteOffsetMax, quoteOffsetMin } from './constants'

export const QuoteOffsetSchema = Uint256BigIntSchema.min(quoteOffsetMin).max(quoteOffsetMax).describe('QuoteOffset')

export const QuoteOffsetsSchema = getArraySchema(QuoteOffsetSchema, identity)

export type QuoteOffset = z.infer<typeof QuoteOffsetSchema>

export const parseQuoteOffset = (quoteOffset: QuoteOffset): QuoteOffset => QuoteOffsetSchema.parse(quoteOffset)

export const parseQuoteOffsets = (quoteOffsets: QuoteOffset[]): QuoteOffset[] => QuoteOffsetsSchema.parse(quoteOffsets)

export const isEqualQuoteOffset = isEqualSC
