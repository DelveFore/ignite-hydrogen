import color from '../../theme/color'
import { DefaultTheme } from 'react-native-paper';

export default {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: color.primary,
    accent: '#03dac4',
    background: color.background,
    text: color.text
  }
}
