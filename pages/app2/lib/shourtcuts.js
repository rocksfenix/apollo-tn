import Mousetrap from 'mousetrap'
import { shourtcuts } from '../config'

export default (self, config = shourtcuts) => {
  Mousetrap.bind(config.prevTool, self.toolUp)
  Mousetrap.bind(config.nextTool, self.toolDown)
  Mousetrap.bind(config.find, self.find)
}
