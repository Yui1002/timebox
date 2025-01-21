import {StyleSheet} from 'react-native';
import {COLORS} from './theme';

export default class IconStyle {
  static createBasicIconStyle() {
    return StyleSheet.create({
      icon: {
        width: '30%',
        lineHeight: 24
      },
    }).icon;
  }

  static createProgressBar() {
    return StyleSheet.create({
        progressBar: {
            backgroundColor: COLORS.LIGHT_GREY,
            height: 10,
        }
    }).progressBar
  }

  static createProgressBarFocused() {
    return StyleSheet.create({
        progressBar: {
            backgroundColor: COLORS.BLUE,
            height: 10
        }
    }).progressBar
  }
}
