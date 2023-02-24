import { $ts } from '../generic/models/Thought'

export const getQuestions = () => $ts([
  'How to upgrade existing contracts?',
  ['How to trade cross-chain + how to accept fiat?', [
    'How to migrate to new chains?',
  ]],
  ['How to guarantee taxes?', [
    ['Options', [
      ['Do not allow to call transfer() from a specific address if it has already been called N times from that address'],
    ]],
  ]],
  ['Should the Fairpool contract implement ERC1155 interface?', [
    ['Maybe supported by social networks', [
      ['Networks', ['Instagram', 'VK', 'Twitter']],
    ]],
  ]],
])
