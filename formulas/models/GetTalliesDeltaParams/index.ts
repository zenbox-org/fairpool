export interface GetTalliesDeltaParams {
  offset: bigint
  step: bigint
}

export const zeroGetTalliesDeltaParams: GetTalliesDeltaParams = { offset: 0n, step: 0n }
