import { todo } from '../../../../../utils/todo'
import { Shifts } from '../../../helpers/isValidModel'

export const getGenerator = () => todo<Generator<Shifts>>(undefined, 'Implement generator')
