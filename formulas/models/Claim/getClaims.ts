import { chooseOneWrappedSimpleStatic } from 'libs/decimaker/choose'
import { OptionN } from 'libs/decimaker/models/Option'
import { Runner } from '../../../../generic/models/Runner'
import { ensure } from '../../../../utils/ensure'
import { all } from '../../../../utils/remeda/all'
import { imply } from '../../../../utils/remeda/imply'
import { getClaimsFromParserPipes } from './getClaims/getClaimsFromParserPipes'
import { Claims, getClaimsViaRequirements } from './getClaims/getClaimsViaRequirements'
import { getClaimsViaSchemas } from './getClaims/getClaimsViaSchemas'

type GetterClaims = Runner<void, Claims>

interface GetterClaimsOption extends OptionN<GetterClaims> {
  runsParentParsers: boolean
  reusesSchemas: boolean,
}

export function getClaims() {
  const mustUseSchemas = true // non-array objects must be checked via schemas
  const options: GetterClaimsOption[] = [
    {
      value: getClaimsViaRequirements,
      runsParentParsers: true, // every child parser needs to ensure that the input is valid (= input passes the parent parser)
      reusesSchemas: false,
    },
    {
      value: getClaimsViaSchemas,
      runsParentParsers: true,
      reusesSchemas: true,
    },
    {
      value: getClaimsFromParserPipes,
      runsParentParsers: false,
      reusesSchemas: false,
    },
  ]
  return ensure(chooseOneWrappedSimpleStatic(options, o => all([
    imply(mustUseSchemas, o.reusesSchemas),
  ])))()
}
