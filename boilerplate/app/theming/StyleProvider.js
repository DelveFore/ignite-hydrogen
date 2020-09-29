/**
 */
import { StyleProvider } from 'native-base'
import variables from '@app/theme/variables/material' // TODO Offer a clear "main" / default theme selection
import getTheme from '@app/theme/components'

export default class Provider extends StyleProvider {
  static defaultProps = {
    style: getTheme(variables)
  }
}
